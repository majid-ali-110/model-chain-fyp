#!/usr/bin/env python3
import base64
import io
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


def image_data_url_to_features(data_url: str, model) -> Tuple[List[float], Dict[str, Any]]:
    """Convert a base64 data-URL image into a flat float feature vector.

    Strategy: resize to a square (matching the model's expected feature count if
    detectable, otherwise try common sizes) and flatten.  Works for sklearn
    classifiers trained on raw pixel data (e.g. grayscale 64×64 = 4096 features).
    """
    try:
        from PIL import Image  # type: ignore
    except ImportError:
        raise ValueError(
            "Pillow is required for image inference. Install it with: pip install Pillow"
        )

    metadata: Dict[str, Any] = {"inputType": "image"}

    # Strip the data-URL prefix (data:image/jpeg;base64,<data>)
    if "," in data_url:
        header, b64_data = data_url.split(",", 1)
    else:
        b64_data = data_url

    img_bytes = base64.b64decode(b64_data)
    img = Image.open(io.BytesIO(img_bytes))

    # Determine expected feature count from the model
    expected_features: Optional[int] = None
    if hasattr(model, "n_features_in_"):
        expected_features = int(model.n_features_in_)

    # Choose target size
    if expected_features:
        # Try to find a square that matches: channels × h × w
        for channels in (1, 3):
            pixels = expected_features // channels
            side = int(pixels ** 0.5)
            if side * side * channels == expected_features:
                target_size = (side, side)
                target_channels = channels
                break
        else:
            # Non-square — just resize and flatten to expected_features
            side = int((expected_features) ** 0.5) or 64
            target_size = (side, side)
            target_channels = 3
    else:
        # Fallback: 64×64 grayscale
        target_size = (64, 64)
        target_channels = 1

    if target_channels == 1:
        img = img.convert("L")
    else:
        img = img.convert("RGB")

    img = img.resize(target_size)
    arr = np.array(img, dtype=np.float32) / 255.0
    features = arr.flatten().tolist()

    metadata["imageSize"] = f"{target_size[0]}x{target_size[1]}"
    metadata["channels"] = target_channels
    return features, metadata


def parse_features(payload: Dict[str, Any], model=None) -> Tuple[List[float], Dict[str, Any]]:
    metadata: Dict[str, Any] = {}

    if isinstance(payload.get("features"), list):
        return [float(v) for v in payload["features"]], metadata

    raw_input = payload.get("input")

    # Base64 image data-URL
    if isinstance(raw_input, str) and raw_input.startswith("data:image/"):
        return image_data_url_to_features(raw_input, model)

    if isinstance(raw_input, list):
        return [float(v) for v in raw_input], metadata

    if isinstance(raw_input, str) and raw_input.strip():
        text = raw_input.strip()

        try:
            parsed = json.loads(text)
            if isinstance(parsed, list):
                # Filter None/null values that can come from unfilled tabular fields
                return [float(v) for v in parsed if v is not None], metadata
            if isinstance(parsed, dict):
                if isinstance(parsed.get("features"), list):
                    return [float(v) for v in parsed["features"]], metadata
                # Any dict with all-numeric values: use values in insertion order
                values = list(parsed.values())
                if values and all(isinstance(v, (int, float)) for v in values):
                    return [float(v) for v in values], metadata
        except json.JSONDecodeError:
            pass

        # Fallback CSV parsing: 5.1,3.5,1.4,0.2
        if "," in text:
            try:
                return [float(v.strip()) for v in text.split(",") if v.strip()], metadata
            except ValueError:
                pass

    raise ValueError(
        "Unable to parse model input. Supported formats:\n"
        "  Tabular/numeric: [5.1, 3.5, 1.4, 0.2]  or  5.1, 3.5, 1.4, 0.2\n"
        "  Image: base64 data-URL from file upload\n"
        "  Named features: {\"sepal_length\": 5.1, ...}"
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

            content = response.content
            ext = _detect_extension(content)  # '.h5' for HDF5/Keras, '.pkl' otherwise
            temp_dir = Path(tempfile.gettempdir()) / "modelchain-inference"
            temp_dir.mkdir(parents=True, exist_ok=True)
            model_path = temp_dir / f"{ipfs_hash}{ext}"
            model_path.write_bytes(content)
            DOWNLOADED_MODELS[ipfs_hash] = str(model_path)
            return str(model_path)
        except requests.RequestException:
            continue

    raise FileNotFoundError(f"Could not download model from IPFS for hash: {ipfs_hash}")


# HDF5 magic bytes (first 8 bytes of every .h5 / HDF5 file)
_HDF5_MAGIC = b"\x89HDF\r\n\x1a\n"


def _detect_extension(data: bytes) -> str:
    """Return '.h5' for HDF5 / Keras files, '.pkl' otherwise."""
    return ".h5" if data[:8] == _HDF5_MAGIC else ".pkl"


def resolve_model_path(payload: Dict[str, Any]) -> str:
    model_path = payload.get("modelPath")
    if isinstance(model_path, str) and model_path.strip():
        return model_path.strip()

    # modelKey: a short SHA-256 fingerprint assigned when the model file was
    # uploaded directly to the inference server via /api/inference/upload-model.
    model_key = payload.get("modelKey")
    if isinstance(model_key, str) and model_key.strip():
        temp_dir = Path(tempfile.gettempdir()) / "modelchain-inference"
        for ext in (".h5", ".pkl"):
            key_path = temp_dir / f"{model_key.strip()}{ext}"
            if key_path.exists():
                return str(key_path)

    ipfs_hash = payload.get("ipfsHash")
    if isinstance(ipfs_hash, str) and ipfs_hash.strip():
        try:
            return download_model_from_ipfs(ipfs_hash.strip())
        except FileNotFoundError:
            # IPFS download failed (e.g. localhost mock hash) — fall through to
            # the default model path so development still works.
            pass

    return DEFAULT_MODEL_PATH


def _patch_tf_compat_shims() -> None:
    """Inject missing symbols that were removed in newer TensorFlow versions.

    Old H5 models serialised with TF < 2.9 reference
    ``tensorflow.python.distribute.input_lib.DistributedDatasetInterface``
    which no longer exists.  We add a no-op stub so pickle/Keras can
    deserialise the config without crashing.
    """
    try:
        import tensorflow.python.distribute.input_lib as _input_lib  # type: ignore
        if not hasattr(_input_lib, "DistributedDatasetInterface"):
            class DistributedDatasetInterface:  # noqa: D101 – compat stub
                pass
            _input_lib.DistributedDatasetInterface = DistributedDatasetInterface
    except Exception:
        pass

    # Additional removals seen across TF versions
    _stub_attrs = [
        ("tensorflow.python.eager.context", "eager_mode"),
        ("tensorflow.python.framework.ops", "disable_eager_execution"),
    ]
    for mod_name, attr in _stub_attrs:
        try:
            mod = sys.modules.get(mod_name) or __import__(mod_name, fromlist=["*"])
            if not hasattr(mod, attr):
                setattr(mod, attr, lambda *a, **kw: None)
        except Exception:
            pass


def _load_keras_model_with_fallbacks(load_path: str):
    """Try several strategies to load an .h5 / Keras model.

    Applies compatibility shims first, then cascades through loaders to
    handle models saved with any TF 2.x version on any newer runtime.
    """
    import tensorflow as tf  # already confirmed importable at call site

    # Patch missing symbols from removed TF internals before any load attempt.
    _patch_tf_compat_shims()

    # ── Strategy 1: standard Keras loader ────────────────────────────────────
    try:
        return tf.keras.models.load_model(load_path, compile=False)
    except Exception as err1:
        pass

    # ── Strategy 2: tf.keras legacy H5 loader (TF < 2.16 / Keras 2 path) ────
    try:
        import h5py  # type: ignore
        with h5py.File(load_path, "r") as h5f:
            legacy = getattr(tf.keras.saving, "legacy", None)
            if legacy and hasattr(legacy, "load_model_from_hdf5"):
                return legacy.load_model_from_hdf5(h5f)
    except Exception:
        pass

    # ── Strategy 3: internal hdf5_format loader ───────────────────────────────
    try:
        import h5py  # type: ignore
        from tensorflow.python.keras.saving import hdf5_format  # type: ignore
        with h5py.File(load_path, "r") as h5f:
            return hdf5_format.load_model_from_hdf5(h5f)
    except Exception:
        pass

    # ── Strategy 4: standalone keras package ──────────────────────────────────
    try:
        import keras  # type: ignore
        return keras.saving.load_model(load_path, compile=False)
    except Exception:
        pass

    # All strategies failed — surface the original error with guidance.
    raise ValueError(
        f"Failed to load Keras model: {err1}\n"
        "Possible fixes:\n"
        "  1. Resave the model with your current TF version: model.save('name.h5')\n"
        "  2. If using Keras 3 / TF 2.16+, save as SavedModel: model.save('name')\n"
        "  3. Install a matching TF version: pip install tensorflow==2.15"
    )


def load_model(path: str):
    """Load a model from *path* and return ``(model, model_type, resolved_path)``.

    *model_type* is ``'keras'`` for .h5 / HDF5 / SavedModel files or
    ``'sklearn'`` for pickle-serialised scikit-learn estimators.
    The result is cached by resolved path.
    """
    resolved = str(Path(path).expanduser().resolve())
    if resolved in MODEL_CACHE:
        cached = MODEL_CACHE[resolved]
        return cached[0], cached[1], resolved

    file_path = Path(resolved)
    if not file_path.exists():
        raise FileNotFoundError(
            f"Model file not found at {resolved}. Set SANDBOX_MODEL_PATH or provide modelPath/ipfsHash."
        )

    # Detect Keras / HDF5 by magic bytes OR file extension
    is_keras = file_path.suffix in (".h5", ".keras")
    if not is_keras:
        try:
            with file_path.open("rb") as fh:
                magic = fh.read(8)
            is_keras = magic == _HDF5_MAGIC
        except OSError:
            pass

    if is_keras:
        try:
            import tensorflow as tf  # type: ignore
        except ImportError as exc:
            raise ImportError(
                "TensorFlow is required to run .h5 / Keras models.\n"
                "  Apple Silicon (M1/M2/M3): pip install tensorflow-macos tensorflow-metal\n"
                "  All other platforms:       pip install tensorflow"
            ) from exc

        # Keras 3 uses file extension to select the loading format.
        # If the file has HDF5 magic bytes but a non-standard extension
        # (e.g. .pkl from IPFS download), copy it to a .h5 path first.
        load_path = resolved
        if file_path.suffix not in (".h5", ".keras"):
            h5_path = file_path.with_suffix(".h5")
            if not h5_path.exists():
                import shutil
                shutil.copy2(resolved, str(h5_path))
            load_path = str(h5_path)

        model = _load_keras_model_with_fallbacks(load_path)
        model_type = "keras"
    else:
        install_sklearn_compat_aliases()
        with file_path.open("rb") as f:
            model = CompatUnpickler(f).load()
        model_type = "sklearn"

    MODEL_CACHE[resolved] = (model, model_type)
    return model, model_type, resolved


@app.route("/api/inference/upload-model", methods=["POST", "OPTIONS"])
def upload_model_file():
    """Accept a model .pkl file from the frontend and store it locally.

    Returns a short ``modelKey`` (hex fingerprint) that can be sent back in
    subsequent ``/api/inference/predict`` requests to resolve the model without
    needing a live IPFS gateway.  This is the primary flow used during local
    development where the browser's IPFS mock cannot be reached by the server.
    """
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    if "file" not in request.files:
        return jsonify({"success": False, "error": "No 'file' field in request"}), 400

    file_bytes = request.files["file"].read()
    if not file_bytes:
        return jsonify({"success": False, "error": "Uploaded file is empty"}), 400

    import hashlib
    model_key = hashlib.sha256(file_bytes).hexdigest()[:16]
    ext = _detect_extension(file_bytes)  # '.h5' for Keras/HDF5, '.pkl' otherwise

    temp_dir = Path(tempfile.gettempdir()) / "modelchain-inference"
    temp_dir.mkdir(parents=True, exist_ok=True)
    model_path = temp_dir / f"{model_key}{ext}"
    model_path.write_bytes(file_bytes)

    return jsonify({"success": True, "modelKey": model_key, "modelFormat": ext.lstrip(".")}) 


@app.route("/api/inference/upload-tokenizer", methods=["POST", "OPTIONS"])
def upload_tokenizer_file():
    """Accept a tokenizer file in any of several common formats and store it.

    Supported formats (auto-detected):
      • tokenizer.json    – produced by keras Tokenizer.to_json()
      • tokenizer.pickle / tokenizer.pkl – pickled keras Tokenizer object
      • word_index.json   – plain {"word": index, ...} dict
      • vocab.txt         – one word per line (index = line number, 0-padded)

    The file is stored keyed by *modelKey* so the predict endpoint can
    automatically tokenise raw text for that model.
    """
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    model_key = request.form.get("modelKey", "").strip()
    if not model_key:
        return jsonify({"success": False, "error": "modelKey is required"}), 400

    if "file" not in request.files:
        return jsonify({"success": False, "error": "No 'file' field in request"}), 400

    uploaded = request.files["file"]
    file_bytes = uploaded.read()
    if not file_bytes:
        return jsonify({"success": False, "error": "Uploaded file is empty"}), 400

    original_name = (uploaded.filename or "").lower()
    temp_dir = Path(tempfile.gettempdir()) / "modelchain-inference"
    temp_dir.mkdir(parents=True, exist_ok=True)

    # ── Pickle tokenizer (.pkl / .pickle) ────────────────────────────────────
    _PICKLE_MAGIC = {b"\x80\x02", b"\x80\x03", b"\x80\x04", b"\x80\x05"}
    if original_name.endswith((".pkl", ".pickle")) or file_bytes[:2] in _PICKLE_MAGIC:
        try:
            obj = pickle.loads(file_bytes)  # noqa: S301 – user-supplied model file
            # Extract word_index from a Keras Tokenizer object or plain dict
            if hasattr(obj, "word_index"):
                # Keras Tokenizer object
                word_index = obj.word_index
                oov_token = getattr(obj, "oov_token", None)
                num_words = getattr(obj, "num_words", None)
            elif isinstance(obj, dict):
                # Plain {word: index} dict
                word_index = obj
                oov_token = None
                num_words = None
            elif isinstance(obj, (list, tuple)):
                # Vocabulary list — most common format for words.pkl
                # e.g. ['<PAD>', '<UNK>', 'the', 'a', ...]
                # index 0 is reserved for padding; each word maps to its position
                word_index = {str(w): i for i, w in enumerate(obj) if str(w).strip()}
                oov_token = None
                num_words = None
            else:
                return jsonify({
                    "success": False,
                    "error": (
                        f"Pickle file contains an unsupported type: {type(obj).__name__}. "
                        "Expected a Keras Tokenizer object, a {{word: index}} dict, or a vocabulary list."
                    )
                }), 400

            config = {"word_index": word_index, "lower": True, "split": " ",
                      "oov_token": oov_token, "num_words": num_words}
            tok_path = temp_dir / f"{model_key}_tokenizer.json"
            tok_path.write_text(json.dumps(config), encoding="utf-8")
            return jsonify({"success": True, "message": "Pickle tokenizer uploaded and converted successfully",
                            "vocab_size": len(word_index)})
        except Exception as exc:
            return jsonify({"success": False, "error": f"Could not load pickle tokenizer: {exc}"}), 400

    # ── JSON (Keras to_json or plain word_index) ──────────────────────────────
    try:
        raw = json.loads(file_bytes)
    except json.JSONDecodeError:
        # ── vocab.txt fallback (one word per line) ────────────────────────────
        try:
            lines = file_bytes.decode("utf-8").splitlines()
            word_index = {line.strip(): i + 1 for i, line in enumerate(lines) if line.strip()}
            config = {"word_index": word_index, "lower": True, "split": " ",
                      "oov_token": None, "num_words": None}
            tok_path = temp_dir / f"{model_key}_tokenizer.json"
            tok_path.write_text(json.dumps(config), encoding="utf-8")
            return jsonify({"success": True, "message": "Vocab file uploaded successfully",
                            "vocab_size": len(word_index)})
        except Exception as exc:
            return jsonify({"success": False,
                            "error": "Unrecognised tokenizer format. Supported: .json (tokenizer.to_json()), "
                                     ".pkl/.pickle (pickled Keras Tokenizer), vocab.txt (one word per line)"}), 400

    # Normalise JSON: plain word_index dict, or Keras to_json wrapper
    if isinstance(raw, dict) and "word_index" not in raw and "config" not in raw:
        # Plain {"word": idx, ...} word-index dict
        config = {"word_index": raw, "lower": True, "split": " ", "oov_token": None, "num_words": None}
    elif isinstance(raw, dict) and "config" in raw:
        # Keras to_json() wrapper — store as-is, _load_keras_tokenizer handles unwrapping
        config = raw
    else:
        config = raw  # already a flat config dict

    tok_path = temp_dir / f"{model_key}_tokenizer.json"
    tok_path.write_text(json.dumps(config), encoding="utf-8")
    vocab_size = len(config.get("word_index", {})) or len(raw)
    return jsonify({"success": True, "message": "Tokenizer uploaded successfully", "vocab_size": vocab_size})


def _load_keras_tokenizer(model_key: str) -> Optional[Dict]:
    """Return the stored Keras tokenizer config dict for *model_key*, or None."""
    if not model_key:
        return None
    tok_path = Path(tempfile.gettempdir()) / "modelchain-inference" / f"{model_key}_tokenizer.json"
    if not tok_path.exists():
        return None
    try:
        with tok_path.open(encoding="utf-8") as fh:
            raw = json.load(fh)
        # Keras saves two shapes: a bare config dict, or {"class_name": ..., "config": {...}}
        if "config" in raw and isinstance(raw["config"], (dict, str)):
            inner = raw["config"]
            if isinstance(inner, str):
                inner = json.loads(inner)  # nested JSON string (older Keras)
            return inner
        return raw  # already a flat config
    except Exception:
        return None


def _tokenize_with_keras_tokenizer(
    text: str,
    config: Dict,
    input_shape,
) -> np.ndarray:
    """Convert *text* to a token-ID sequence using a saved Keras Tokenizer config.

    Parameters mirror the fields saved by ``keras.preprocessing.text.Tokenizer.to_json()``.
    Unknown words are mapped to the OOV index when ``oov_token`` is configured,
    otherwise they are skipped (index 0 = padding, so skipping is safe).
    The sequence is post-padded / truncated to match *input_shape[1]* when known.
    """
    word_index: Dict[str, int] = config.get("word_index", {})
    # word_index may be stored as a JSON string in very old Keras versions
    if isinstance(word_index, str):
        word_index = json.loads(word_index)

    lower: bool = config.get("lower", True)
    split: str = config.get("split", " ") or " "
    oov_token: Optional[str] = config.get("oov_token", None)
    oov_index: int = word_index.get(oov_token, 0) if oov_token else 0
    num_words: Optional[int] = config.get("num_words", None)

    processed = text.lower() if lower else text
    words = processed.split(split)

    sequence: List[int] = []
    for word in words:
        word = word.strip()
        if not word:
            continue
        idx = word_index.get(word)
        if idx is None:
            if oov_token:
                sequence.append(oov_index)
            # else skip unknown words (index 0 kept for padding)
        elif num_words and idx >= num_words:
            if oov_token:
                sequence.append(oov_index)
        else:
            sequence.append(idx)

    # Determine target sequence length from input shape: (None, maxlen) or (None, None)
    maxlen: Optional[int] = None
    try:
        if len(input_shape) > 1 and input_shape[1]:
            maxlen = int(input_shape[1])
    except Exception:
        pass

    if maxlen:
        if len(sequence) > maxlen:
            sequence = sequence[:maxlen]
        else:
            sequence = sequence + [0] * (maxlen - len(sequence))  # post-pad

    return np.array([sequence], dtype=np.float32)


def _try_hf_tokenizer(
    text: str, model, input_shape
) -> Optional[Tuple[np.ndarray, Dict]]:
    """Try to tokenise *text* using a HuggingFace tokenizer auto-detected from
    the model's layer names / config.

    Works for transformer-based models downloaded from GitHub (BERT, DistilBERT,
    RoBERTa, ALBERT, XLNet, etc.) that were converted to Keras/.h5 format.
    Returns (x_array, metadata_dict) on success, or None if not applicable.
    """
    try:
        from transformers import AutoTokenizer  # type: ignore
    except ImportError:
        return None  # transformers not installed — skip silently

    # ── Detect transformer architecture from layer names ────────────────────
    layer_names = " ".join(l.name.lower() for l in model.layers)
    config_str = ""
    try:
        config_str = str(model.get_config()).lower()
    except Exception:
        pass
    combined = layer_names + " " + config_str

    # Map detected keyword → canonical HuggingFace model name for the tokenizer
    ARCH_MAP = [
        ("distilbert",        "distilbert-base-uncased"),
        ("bert",              "bert-base-uncased"),
        ("roberta",           "roberta-base"),
        ("albert",            "albert-base-v2"),
        ("xlnet",             "xlnet-base-cased"),
        ("electra",           "google/electra-small-discriminator"),
        ("deberta",           "microsoft/deberta-base"),
        ("longformer",        "allenai/longformer-base-4096"),
        ("camembert",         "camembert-base"),
        ("xlm_roberta",       "xlm-roberta-base"),
    ]

    hf_model_name = None
    for keyword, name in ARCH_MAP:
        if keyword in combined:
            hf_model_name = name
            break

    if hf_model_name is None:
        return None  # Not a recognisable transformer — cannot auto-tokenise

    try:
        tokenizer = AutoTokenizer.from_pretrained(hf_model_name)
    except Exception:
        return None

    # Determine max_length from model input shape
    maxlen = 128
    try:
        if len(input_shape) > 1 and input_shape[1]:
            maxlen = int(input_shape[1])
    except Exception:
        pass

    encoded = tokenizer(
        text,
        max_length=maxlen,
        padding="max_length",
        truncation=True,
        return_tensors="np",
    )
    x = encoded["input_ids"].astype(np.float32)  # (1, maxlen)
    meta = {
        "inputType": "text",
        "tokenizer": f"hf:{hf_model_name}",
    }
    return x, meta


def _predict_keras(model, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Run inference for a Keras / TensorFlow model.

    Supports image data-URLs (resized to model.input_shape) and plain
    numeric lists / feature dicts.
    """
    raw_input = payload.get("input")
    input_shape = model.input_shape  # e.g. (None, 224, 224, 3) or (None, 128)
    metadata: Dict[str, Any] = {}

    if isinstance(raw_input, str) and raw_input.startswith("data:image/"):
        # ---- Image path --------------------------------------------------------
        try:
            from PIL import Image  # type: ignore
        except ImportError as exc:
            raise ValueError(
                "Pillow is required for image inference. pip install Pillow"
            ) from exc

        b64_data = raw_input.split(",", 1)[1] if "," in raw_input else raw_input
        img_bytes = base64.b64decode(b64_data)
        img = Image.open(io.BytesIO(img_bytes))

        if len(input_shape) == 4:  # (None, H, W, C)
            h = int(input_shape[1]) if input_shape[1] else 224
            w = int(input_shape[2]) if input_shape[2] else 224
            c = int(input_shape[3]) if input_shape[3] else 3
            img = img.convert("RGB" if c != 1 else "L")
            img = img.resize((w, h))
            arr = np.array(img, dtype=np.float32) / 255.0
            if c == 1 and arr.ndim == 2:
                arr = arr[:, :, np.newaxis]  # (H, W, 1)
            x = arr[np.newaxis, ...]  # (1, H, W, C)
            metadata = {"inputType": "image", "imageSize": f"{w}x{h}", "channels": c}
        else:
            # Flat model that happens to receive image — flatten pixels
            img = img.convert("L").resize((64, 64))
            arr = np.array(img, dtype=np.float32) / 255.0
            x = arr.flatten()[np.newaxis, :]  # (1, 4096)
            metadata = {"inputType": "image", "flattened": True}

    elif isinstance(payload.get("features"), list):
        x = np.array([payload["features"]], dtype=np.float32)
    elif isinstance(raw_input, list):
        x = np.array([raw_input], dtype=np.float32)
    elif isinstance(raw_input, str) and raw_input.strip():
        text = raw_input.strip()

        # Detect 3D sequence models early so we can give a helpful error for text input
        _is_3d_model = len(input_shape) == 3  # (None, timesteps, features)
        _n_features = int(input_shape[2]) if _is_3d_model and input_shape[2] else None

        # ── Try JSON / CSV numeric first ──────────────────────────────────────
        parsed_nums = None
        parsed_2d = None  # may already be a 2-D list [[...], [...], ...]
        try:
            parsed = json.loads(text)
            if isinstance(parsed, list) and parsed and isinstance(parsed[0], list):
                # Already 2-D: [[f0,f1,...], [f0,f1,...], ...]
                parsed_2d = [[float(v) for v in row] for row in parsed]
            elif isinstance(parsed, list):
                parsed_nums = [float(v) for v in parsed]
            else:
                parsed_nums = [float(v) for v in parsed.values()]
        except (json.JSONDecodeError, ValueError, TypeError):
            pass

        if parsed_nums is None and parsed_2d is None and "," in text:
            try:
                parsed_nums = [float(v.strip()) for v in text.split(",") if v.strip()]
            except ValueError:
                pass

        if parsed_2d is not None:
            x = np.array([parsed_2d], dtype=np.float32)  # (1, T, features)
        elif parsed_nums is not None:
            flat = np.array(parsed_nums, dtype=np.float32)
            if _is_3d_model and _n_features and flat.size % _n_features == 0:
                # Auto-reshape flat list → (1, T, features)
                n_steps = flat.size // _n_features
                x = flat.reshape(1, n_steps, _n_features)
                metadata["inputType"] = "sequence"
                metadata["reshapedTo"] = f"1×{n_steps}×{_n_features}"
            else:
                x = flat[np.newaxis, :]  # (1, N) for 2-D models
        else:
            # ── Plain text / NLP input ────────────────────────────────────────

            # Reject text early for 3-D sequence models — they need numeric features,
            # not token IDs, so a tokenizer file won't help.
            if _is_3d_model and _n_features:
                raise ValueError(
                    f"INPUT_FORMAT_ERROR: This model expects sequential numeric data "
                    f"(shape: timesteps × {_n_features} features), not plain text. "
                    f"Provide your input as a flat comma-separated list of numbers "
                    f"(multiples of {_n_features}), or as a 2-D JSON array "
                    f'(e.g. [[f1,f2,...,f{_n_features}], [f1,f2,...,f{_n_features}], ...]).'
                )

            import tensorflow as tf  # already loaded at this point
            text_vec_layer = None
            for layer in model.layers:
                if isinstance(layer, tf.keras.layers.TextVectorization):
                    text_vec_layer = layer
                    break

            if text_vec_layer is not None:
                # Model has a built-in TextVectorization preprocessing layer —
                # feed the raw string directly; the layer handles tokenisation.
                x = text_vec_layer([text]).numpy()  # (1, seq_len)
                metadata["inputType"] = "text"
            else:
                # No built-in TextVectorization — try an uploaded Keras tokenizer JSON
                model_key = payload.get("modelKey", "") or ""
                tokenizer_config = _load_keras_tokenizer(model_key)
                if tokenizer_config is not None:
                    x = _tokenize_with_keras_tokenizer(text, tokenizer_config, input_shape)
                    metadata["inputType"] = "text"
                    metadata["tokenizer"] = "keras_json"
                else:
                    # ── Last resort: try HuggingFace transformers auto-tokenizer ──
                    # Works for BERT, DistilBERT, RoBERTa, etc. downloaded from GitHub
                    hf_result = _try_hf_tokenizer(text, model, input_shape)
                    if hf_result is not None:
                        x, hf_meta = hf_result
                        metadata.update(hf_meta)
                    else:
                        # No tokenizer available — raise an actionable error the UI detects
                        raise ValueError(
                            "TOKENIZER_REQUIRED: This model expects tokenised input but no tokenizer "
                            "has been uploaded for it yet. Please upload your tokenizer.json file "
                            "(generated with tokenizer.to_json()) to enable text inference."
                        )
    else:
        raise ValueError(
            "Could not prepare input for Keras model. "
            "Provide an image data-URL, a numeric feature list, or text (if the model includes a TextVectorization layer)."
        )

    probs = model.predict(x, verbose=0)  # (1, num_classes) or (1,)
    probs_row = probs[0]

    if probs_row.shape == () or (probs_row.ndim == 0):
        probs_list = [float(probs_row)]
    else:
        probs_list = probs_row.tolist()

    if len(probs_list) == 1:
        # Binary sigmoid output
        predicted_idx = int(probs_list[0] >= 0.5)
        probs_list = [1.0 - probs_list[0], probs_list[0]]  # [P(0), P(1)]
    else:
        predicted_idx = int(np.argmax(probs_row))

    return {
        "prediction": [predicted_idx],
        "predictedClass": predicted_idx,
        "probabilities": [probs_list],
        "inputFeatures": [],
        "metadata": metadata,
    }


@app.route("/api/inference/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    payload = request.get_json(silent=True) or {}

    try:
        model_path = resolve_model_path(payload)
        model, model_type, resolved_model_path = load_model(model_path)

        if model_type == "keras":
            result = _predict_keras(model, payload)
            result["modelPath"] = resolved_model_path
        else:
            # sklearn path
            features, feature_meta = parse_features(payload, model)
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

    except (ValueError, FileNotFoundError, ImportError) as error:
        return jsonify({"success": False, "error": str(error)}), 400
    except Exception as error:  # pylint: disable=broad-except
        return jsonify({"success": False, "error": f"Inference failed: {error}"}), 500


if __name__ == "__main__":
    host = os.environ.get("SANDBOX_INFERENCE_HOST", "127.0.0.1")
    port = int(os.environ.get("SANDBOX_INFERENCE_PORT", "8000"))
    app.run(host=host, port=port, debug=False)
