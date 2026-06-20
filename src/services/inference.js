const API_BASE = import.meta.env.VITE_INFERENCE_API_BASE || '';

const normalizeError = (message) => {
  if (!message) return 'Inference request failed.';
  return String(message);
};

/**
 * Upload a model file directly to the inference server.
 * Returns a short modelKey that the server uses to locate the file on disk.
 * This bypasses IPFS so local-dev models are always reachable by the server.
 */
export const uploadModelToInferenceServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/inference/upload-model`, {
    method: 'POST',
    body: formData,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse failure
  }

  if (!response.ok || !data?.success) {
    throw new Error(normalizeError(data?.error || `HTTP ${response.status}`));
  }

  return data.modelKey;
};

/**
 * Upload a Keras tokenizer JSON file (tokenizer.to_json()) for an already-uploaded model.
 * Associates the tokenizer with the given modelKey so the inference server can
 * automatically tokenise raw text inputs for that model.
 */
export const uploadTokenizerToInferenceServer = async (modelKey, file) => {
  const formData = new FormData();
  formData.append('modelKey', modelKey);
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/api/inference/upload-tokenizer`, {
    method: 'POST',
    body: formData,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse failure
  }

  if (!response.ok || !data?.success) {
    throw new Error(normalizeError(data?.error || `HTTP ${response.status}`));
  }

  return data;
};

export const runSandboxInference = async ({ input, features, selectedModel }) => {
  const payload = {
    input,
    features,
    modelPath: import.meta.env.VITE_SANDBOX_MODEL_PATH || undefined,
    modelKey: selectedModel?.inferenceModelKey || undefined,
    ipfsHash: selectedModel?.ipfsHash || undefined,
  };

  const response = await fetch(`${API_BASE}/api/inference/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Keep null and throw below
  }

  if (!response.ok || !data?.success) {
    throw new Error(normalizeError(data?.error || `HTTP ${response.status}`));
  }

  return data.result;
};

export const checkInferenceHealth = async () => {
  const response = await fetch(`${API_BASE}/api/inference/health`);
  if (!response.ok) {
    throw new Error(`Inference health failed with status ${response.status}`);
  }

  return response.json();
};
