const API_BASE = import.meta.env.VITE_INFERENCE_API_BASE || '';

const normalizeError = (message) => {
  if (!message) return 'Inference request failed.';
  return String(message);
};

export const runSandboxInference = async ({ input, features, selectedModel }) => {
  const payload = {
    input,
    features,
    modelPath: import.meta.env.VITE_SANDBOX_MODEL_PATH || undefined,
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
