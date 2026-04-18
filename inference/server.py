#!/usr/bin/env python3
import json
import os
import pickle
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

MODEL_CACHE: Dict[str, Any] = {}
DOWNLOADED_MODELS: Dict[str, str] = {}
DEFAULT_MODEL_PATH = os.environ.get("SANDBOX_MODEL_PATH", "model.pkl")
IPFS_GATEWAYS = [
    "https://ipfs.io/ipfs/{hash}",
    "https://gateway.pinata.cloud/ipfs/{hash}",
    "https://cloudflare-ipfs.com/ipfs/{hash}",
]


def install_sklearn_compat_aliases() -> None:
    """Map legacy scikit-learn pickle module paths to modern modules.

    Old pickles often reference modules like ``sklearn.linear_model.logistic``
    which were moved/renamed in newer sklearn versions.
    """

    module_aliases = {
        "sklearn.linear_model.logistic": "sklearn.linear_model._logistic",
        "sklearn.svm.classes": "sklearn.svm._classes",
        "sklearn.ensemble.forest": "sklearn.ensemble._forest",
        "sklearn.tree.tree": "sklearn.tree._classes",
        "sklearn.neighbors.classification": "sklearn.neighbors._classification",
    }

    for legacy_name, modern_name in module_aliases.items():
        if legacy_name in sys.modules:
            continue

        try:
            module = __import__(modern_name, fromlist=["*"])
            sys.modules[legacy_name] = module
        except ImportError:
            # Best-effort aliasing; ignore when module is unavailable.
            continue


class CompatUnpickler(pickle.Unpickler):
    MODULE_REMAP = {
        "sklearn.linear_model.logistic": "sklearn.linear_model._logistic",
        "sklearn.svm.classes": "sklearn.svm._classes",
        "sklearn.ensemble.forest": "sklearn.ensemble._forest",
        "sklearn.tree.tree": "sklearn.tree._classes",
        "sklearn.neighbors.classification": "sklearn.neighbors._classification",
    }

    def find_class(self, module, name):
        remapped_module = self.MODULE_REMAP.get(module, module)
        return super().find_class(remapped_module, name)


def with_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.after_request
def apply_cors(response):
    return with_cors(response)


@app.route("/api/inference/health", methods=["GET", "OPTIONS"])
def health():
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    return jsonify({
        "ok": True,
        "defaultModelPath": str(Path(DEFAULT_MODEL_PATH).resolve()),
    })


def parse_features(payload: Dict[str, Any]) -> Tuple[List[float], Dict[str, Any]]:
    metadata: Dict[str, Any] = {}

    if isinstance(payload.get("features"), list):
        return [float(v) for v in payload["features"]], metadata

    raw_input = payload.get("input")
    if isinstance(raw_input, list):
        return [float(v) for v in raw_input], metadata

    if isinstance(raw_input, str) and raw_input.strip():
        text = raw_input.strip()

        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                return [float(v) for v in parsed], metadata
            if isinstance(parsed, dict):
                if isinstance(parsed.get("features"), list):
                    return [float(v) for v in parsed["features"]], metadata

                iris_keys = [
                    "sepal_length",
                    "sepal_width",
                    "petal_length",
                    "petal_width",
                ]
                if all(k in parsed for k in iris_keys):
                    metadata["featureOrder"] = iris_keys
                    return [float(parsed[k]) for k in iris_keys], metadata
        except json.JSONDecodeError:
            pass

        # Fallback CSV parsing: 5.1,3.5,1.4,0.2
        if "," in text:
            return [float(v.strip()) for v in text.split(",") if v.strip()], metadata

    raise ValueError(
        "Unable to parse model input. Send either {'features':[...]} or a JSON/CSV array with numeric values."
    )


def download_model_from_ipfs(ipfs_hash: str) -> str:
    if ipfs_hash in DOWNLOADED_MODELS:
        cached = DOWNLOADED_MODELS[ipfs_hash]
        if Path(cached).exists():
            return cached

    for template in IPFS_GATEWAYS:
        url = template.format(hash=ipfs_hash)
        try:
            response = requests.get(url, timeout=20)
            if response.status_code != 200:
                continue

            temp_dir = Path(tempfile.gettempdir()) / "modelchain-inference"
            temp_dir.mkdir(parents=True, exist_ok=True)
            model_path = temp_dir / f"{ipfs_hash}.pkl"
            model_path.write_bytes(response.content)
            DOWNLOADED_MODELS[ipfs_hash] = str(model_path)
            return str(model_path)
        except requests.RequestException:
            continue

    raise FileNotFoundError(f"Could not download model from IPFS for hash: {ipfs_hash}")


def resolve_model_path(payload: Dict[str, Any]) -> str:
    model_path = payload.get("modelPath")
    if isinstance(model_path, str) and model_path.strip():
        return model_path.strip()

    ipfs_hash = payload.get("ipfsHash")
    if isinstance(ipfs_hash, str) and ipfs_hash.strip():
        return download_model_from_ipfs(ipfs_hash.strip())

    return DEFAULT_MODEL_PATH


def load_model(path: str):
    resolved = str(Path(path).expanduser().resolve())
    if resolved in MODEL_CACHE:
        return MODEL_CACHE[resolved], resolved

    file_path = Path(resolved)
    if not file_path.exists():
        raise FileNotFoundError(
            f"Model file not found at {resolved}. Set SANDBOX_MODEL_PATH or provide modelPath/ipfsHash."
        )

    install_sklearn_compat_aliases()

    with file_path.open("rb") as f:
        model = CompatUnpickler(f).load()

    MODEL_CACHE[resolved] = model
    return model, resolved


@app.route("/api/inference/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    payload = request.get_json(silent=True) or {}

    try:
        features, feature_meta = parse_features(payload)
        model_path = resolve_model_path(payload)
        model, resolved_model_path = load_model(model_path)

        x = np.array([features], dtype=float)
        prediction = model.predict(x)

        result = {
            "prediction": prediction.tolist(),
            "predictedClass": prediction[0].item() if hasattr(prediction[0], "item") else prediction[0],
            "inputFeatures": features,
            "modelPath": resolved_model_path,
            "metadata": feature_meta,
        }

        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(x)
            result["probabilities"] = probabilities.tolist()

        return jsonify({"success": True, "result": result})

    except (ValueError, FileNotFoundError) as error:
        return jsonify({"success": False, "error": str(error)}), 400
    except Exception as error:  # pylint: disable=broad-except
        return jsonify({"success": False, "error": f"Inference failed: {error}"}), 500


if __name__ == "__main__":
    host = os.environ.get("SANDBOX_INFERENCE_HOST", "127.0.0.1")
    port = int(os.environ.get("SANDBOX_INFERENCE_PORT", "8000"))
    app.run(host=host, port=port, debug=False)
