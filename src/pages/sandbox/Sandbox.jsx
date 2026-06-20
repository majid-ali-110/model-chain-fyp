import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useModel } from '../../contexts/ModelContext';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ArrowPathIcon,
  ClockIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  ChartBarIcon,
  CodeBracketIcon,
  BeakerIcon,
  SparklesIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  BookmarkIcon,
  ShareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon,
  CreditCardIcon,
  StarIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  FireIcon,
  RocketLaunchIcon,
  GiftIcon,
  TrophyIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { 
  PlayIcon as PlaySolidIcon,
  StarIcon as StarSolidIcon 
} from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import InputPanel from '../../components/sandbox/InputPanel';
import OutputPanel from '../../components/sandbox/OutputPanel';
import { runSandboxInference, uploadTokenizerToInferenceServer } from '../../services/inference';

const parseSandboxInput = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { rawInput: '', features: null };
  }

  // Base64 data URL (image/audio/video) — pass as rawInput, no feature extraction
  if (trimmed.startsWith('data:')) {
    return { rawInput: trimmed, features: null };
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (Array.isArray(parsed)) {
      // Filter out nulls (unfilled tabular fields)
      const nums = parsed.filter(v => v !== null).map(Number);
      return { rawInput: trimmed, features: nums.length > 0 ? nums : null };
    }

    if (Array.isArray(parsed?.features)) {
      return { rawInput: trimmed, features: parsed.features.map(Number) };
    }

    // Named-key objects (e.g. {sepal_length: 5.1, ...})
    const values = Object.values(parsed);
    if (values.length > 0 && values.every(v => typeof v === 'number' || !isNaN(Number(v)))) {
      return { rawInput: trimmed, features: values.map(Number) };
    }
  } catch {
    // Non-JSON text will be sent as raw input.
  }

  // CSV fallback (5.1,3.5,1.4,0.2)
  if (/^[\d.,\s-]+$/.test(trimmed) && trimmed.includes(',')) {
    const nums = trimmed.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    if (nums.length > 0) return { rawInput: trimmed, features: nums };
  }

  return { rawInput: trimmed, features: null };
};

const formatInferenceResult = (result, classLabels = []) => {
  const structured = {
    type: 'classification',
    predictedClass: result.predictedClass,
    predictedLabel: classLabels[result.predictedClass] || null,
    probabilities: [],
  };

  if (Array.isArray(result?.probabilities?.[0])) {
    structured.probabilities = result.probabilities[0].map((value, index) => ({
      label: classLabels[index] || `class_${index}`,
      value: Number(value),
      percent: parseFloat((Number(value) * 100).toFixed(2)),
    }));
  } else if (result?.probabilities && !Array.isArray(result.probabilities[0])) {
    // flat array fallback
    structured.probabilities = result.probabilities.map((value, index) => ({
      label: classLabels[index] || `class_${index}`,
      value: Number(value),
      percent: parseFloat((Number(value) * 100).toFixed(2)),
    }));
  }

  return JSON.stringify(structured);
};

const Sandbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { models: contextModels } = useModel();
  
  // State management
  const [selectedModel, setSelectedModel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [showHistoryPanel] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [modelSearch, setModelSearch] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [tokenizerUpload, setTokenizerUpload] = useState({ uploading: false, done: false, error: null });
  const tokenizerInputRef = useRef(null);
  const outputRef = useRef(null);

  // Whether the last inference failed because no tokenizer was found
  const needsTokenizer = outputData.includes('TOKENIZER_REQUIRED');
  // Whether the model expects sequential numeric data, not text
  const needsNumericInput = outputData.includes('INPUT_FORMAT_ERROR');
  // Extract the helpful hint from INPUT_FORMAT_ERROR message
  const inputFormatHint = needsNumericInput
    ? outputData.replace(/.*INPUT_FORMAT_ERROR:\s*/s, '').replace(/^Error:\s*/i, '').trim()
    : null;

  // Initialize
  useEffect(() => {
    // Convert context models to sandbox compatible format
    // model.category from blockchain is already 'text','image','audio','video','multimodal','other'
    const sandboxModels = contextModels.map(model => ({
      id: model.id,
      name: model.name,
      provider: model.developer?.name || model.owner || 'Unknown',
      ipfsHash: model.ipfsHash,
      category: model.category || 'text',
      description: model.description,
      pricing: {
        type: model.price === 0 ? 'free' : 'token',
        price: model.price || 0
      },
      maxTokens: 4096,
      contextLength: '128K',
      isPopular: model.featured || (model.rating || 0) >= 4.7,
      isFree: model.price === 0,
      accuracy: model.accuracy,
      rating: model.rating,
      downloads: model.downloads,
      verified: model.verified,
      // Use stored inputTypes filtered to valid sandbox types.
      // When absent fall back to category if valid, else 'text'.
      inputTypes: (() => {
        const VALID = ['text', 'image', 'audio', 'video', 'tabular'];
        if (model.inputTypes?.length > 0) {
          const f = model.inputTypes.filter(t => VALID.includes(t));
          if (f.length > 0) return f;
        }
        const cat = model.category || 'text';
        return [VALID.includes(cat) ? cat : 'text'];
      })(),
      classLabels: model.classLabels ? model.classLabels.split(',').map(l => l.trim()).filter(Boolean) : [],
      featureNames: model.featureNames || '',
      exampleInputs: model.exampleInputs || {},
      exampleOutputs: model.exampleOutputs || {},
      inferenceModelKey: model.inferenceModelKey || '',
    }));

    // Use context models or show empty state
    const allModels = sandboxModels;

    setAvailableModels(allModels);
    setFilteredModels(allModels);
    
    // Check if model is specified in URL
    const modelId = searchParams.get('model');
    if (modelId && allModels.length > 0) {
      const model = allModels.find(m => m.id === modelId);
      if (model) {
        setSelectedModel(model);
      }
    } else if (allModels.length > 0) {
      // Default to first popular model
      const defaultModel = allModels.find(m => m.isPopular) || allModels[0];
      setSelectedModel(defaultModel);
    }

    // Load test history from localStorage
    const savedHistory = localStorage.getItem('sandbox-history');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, [searchParams, contextModels]);

  // Filter models based on search
  useEffect(() => {
    if (!modelSearch) {
      setFilteredModels(availableModels);
    } else {
      const filtered = availableModels.filter(model =>
        model.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        model.provider.toLowerCase().includes(modelSearch.toLowerCase()) ||
        model.description.toLowerCase().includes(modelSearch.toLowerCase())
      );
      setFilteredModels(filtered);
    }
  }, [modelSearch, availableModels]);

  // Update URL when model changes
  useEffect(() => {
    if (selectedModel) {
      setSearchParams({ model: selectedModel.id });
    }
  }, [selectedModel, setSearchParams]);

  // Save test history to localStorage
  useEffect(() => {
    if (testHistory.length > 0) {
      localStorage.setItem('sandbox-history', JSON.stringify(testHistory));
    }
  }, [testHistory]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'text': DocumentTextIcon,
      'image': PhotoIcon,
      'audio': SpeakerWaveIcon,
      'video': VideoCameraIcon
    };
    return iconMap[category] || DocumentTextIcon;
  };

  // Run model test
  const runTest = useCallback(async () => {
    if (!selectedModel || !inputData.trim()) return;

    const { rawInput, features } = parseSandboxInput(inputData);
    const startedAt = performance.now();

    setIsRunning(true);
    setCurrentTest({
      id: Date.now(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      input: inputData,
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    try {
      const result = await runSandboxInference({
        input: rawInput,
        features,
        selectedModel,
      });

      const formattedOutput = formatInferenceResult(result, selectedModel?.classLabels || []);
      const executionTime = Math.max(1, Math.round(performance.now() - startedAt));
      const tokensUsed = Math.max(1, Math.ceil(inputData.length / 4));

      setOutputData(formattedOutput);

      setCurrentTest(prev => ({
        ...prev,
        status: 'completed',
        executionTime,
        tokensUsed
      }));

      const historyItem = {
        id: Date.now(),
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        input: inputData,
        output: formattedOutput,
        timestamp: new Date().toISOString(),
        status: 'completed',
        tokensUsed,
        executionTime,
      };
      setTestHistory(prev => [historyItem, ...prev].slice(0, 50));

    } catch (error) {
      const friendlyError = error.message?.includes('Failed to fetch')
        ? 'Could not reach inference backend. Start it with: npm run inference:dev'
        : error.message;

      console.error('Test error:', error);
      setOutputData(`Inference failed.\n${friendlyError}`);
      setCurrentTest(prev => ({
        ...prev,
        status: 'failed',
        error: friendlyError
      }));

      const failedItem = {
        id: Date.now(),
        modelId: selectedModel?.id,
        modelName: selectedModel?.name || 'Unknown model',
        input: inputData,
        output: '',
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
      setTestHistory(prev => [failedItem, ...prev].slice(0, 50));
    } finally {
      setIsRunning(false);
    }
  }, [selectedModel, inputData]);

  const stopTest = () => {
    setIsRunning(false);
    setCurrentTest(prev => prev ? { ...prev, status: 'stopped' } : null);
  };

  const clearInput = () => {
    setInputData('');
  };

  const clearOutput = () => {
    setOutputData('');
  };

  const loadHistoryItem = (item) => {
    setSelectedHistoryItem(item);
    setInputData(item.input);
    setOutputData(item.output || '');
  };

  const handleTokenizerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const modelKey = selectedModel?.inferenceModelKey;
    if (!modelKey) {
      setTokenizerUpload({ uploading: false, done: false, error: 'Model has no inference key. Re-upload the model file first.' });
      return;
    }
    setTokenizerUpload({ uploading: true, done: false, error: null });
    try {
      await uploadTokenizerToInferenceServer(modelKey, file);
      setTokenizerUpload({ uploading: false, done: true, error: null });
      setOutputData('');
    } catch (err) {
      setTokenizerUpload({ uploading: false, done: false, error: err.message });
    }
  };

  const deleteHistoryItem = (id) => {
    setTestHistory(prev => prev.filter(item => item.id !== id));
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
    }
  };

  if (!selectedModel) {
    return (
      <div className="min-h-screen bg-dark-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-primary-400 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg-primary page-content">
      {/* Header - Sticky below fixed navbar */}
      <div className="bg-dark-surface border-b border-dark-border sticky top-[var(--navbar-height)] z-40">
        <div className="page-shell py-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <BeakerIcon className="h-8 w-8 text-primary-400 mr-3" />
                <div>
                  <h1 className="text-3xl font-bold text-dark-text-primary">AI Sandbox</h1>
                  <p className="text-sm text-dark-text-muted">Test and experiment with AI models</p>
                </div>
              </div>

              {/* Model Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="min-w-48"
                >
                  <div className="flex items-center w-full">
                    {selectedModel && (
                      <>
                        {React.createElement(getCategoryIcon(selectedModel.category), { 
                          className: 'h-4 w-4 mr-2'
                        })}
                        <div className="text-left flex-1">
                          <div className="font-medium">{selectedModel.name}</div>
                          <div className="text-xs text-dark-text-muted">{selectedModel.provider}</div>
                        </div>
                      </>
                    )}
                    <ChevronDownIcon className="h-4 w-4 ml-2" />
                  </div>
                </Button>

                {/* Model Dropdown */}
                {showModelSelector && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-dark-surface border border-dark-border rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <Input
                        type="text"
                        placeholder="Search models..."
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        icon={MagnifyingGlassIcon}
                        className="mb-4"
                      />
                      
                      <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
                        {filteredModels.map((model) => {
                          const IconComponent = getCategoryIcon(model.category);
                          return (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model);
                                setShowModelSelector(false);
                                setModelSearch('');
                              }}
                              className={`w-full p-3 rounded-lg text-left border cursor-pointer transition-all duration-200 text-dark-text-primary ${
                                selectedModel?.id === model.id
                                  ? 'border-primary-400 bg-primary-400/10'
                                  : 'border-transparent hover:bg-dark-border'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <IconComponent className="h-5 w-5 text-dark-text-muted mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-dark-text-primary">{model.name}</h4>
                                      {model.isPopular && (
                                        <Badge variant="accent" size="sm" className="ml-2">
                                          <FireIcon className="h-3 w-3 mr-1" />
                                          Popular
                                        </Badge>
                                      )}
                                      {model.isFree && (
                                        <Badge variant="success" size="sm" className="ml-2">
                                          Free
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-dark-text-muted mt-1">{model.description}</p>
                                    <div className="flex items-center mt-2 text-xs text-dark-text-muted">
                                      <span>{model.provider}</span>
                                      {model.contextLength && (
                                        <>
                                          <span className="mx-2">•</span>
                                          <span>{model.contextLength} context</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Usage Stats & Controls */}
            <div className="flex items-center gap-4">
              {/* Run Button */}
              <Button 
                onClick={runTest}
                disabled={isRunning || !selectedModel}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    Run Test
                  </>
                )}
              </Button>

              {isRunning && (
                <Button 
                  variant="outline"
                  onClick={stopTest}
                  className="flex items-center gap-2"
                >
                  <StopIcon className="h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-shell py-6">
        <div className="grid gap-6 min-h-[calc(100vh-200px)] grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
          {/* Input Section */}
          <div className="flex flex-col gap-4">
              <InputPanel
                model={selectedModel}
                inputData={inputData}
                onInputChange={setInputData}
                isLoading={isRunning}
              />
              
              <div className="flex gap-2">
                <Button 
                  onClick={runTest}
                  disabled={isRunning || !inputData.trim()}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  {isRunning ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-4 w-4" />
                      Run Test
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearInput}
                  className="px-4 py-2"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

          {/* Output Section */}
          <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-dark-border">
                <h2 className="text-lg font-semibold text-dark-text-primary">Output</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(outputData)}
                    disabled={!outputData}
                    title="Copy to clipboard"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={clearOutput}
                    disabled={!outputData}
                    title="Clear output"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {needsNumericInput && (
                <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4 mb-2">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-300 mb-1">This model expects numeric sequence data, not text</p>
                      <p className="text-xs text-blue-200/70 mb-2">{inputFormatHint}</p>
                      <p className="text-xs text-blue-200/50">Switch to the <strong className="text-blue-200">Features</strong> tab in the input panel to enter comma-separated numbers, or paste a JSON array.</p>
                    </div>
                  </div>
                </div>
              )}

              {needsTokenizer && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 mb-2">
                  <div className="flex items-start gap-3">
                    <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-300 mb-1">Tokenizer required</p>

                      <p className="text-xs text-amber-200/70 mb-3">
                        The model converts text to numbers using a vocabulary that was fixed at training time —
                        without it, predictions will be wrong. There are <strong className="text-amber-200">two ways</strong> to fix this:
                      </p>

                      {/* Option 1 */}
                      <div className="bg-black/20 rounded-lg p-3 mb-2">
                        <p className="text-xs font-semibold text-amber-200 mb-1">Option 1 — Upload the tokenizer file from the same GitHub repo</p>
                        <p className="text-xs text-amber-200/60 mb-1">Look for any of these files in the repo:</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {['tokenizer.json', 'tokenizer.pickle', 'tokenizer.pkl', 'word_index.json', 'vocab.txt'].map(f => (
                            <code key={f} className="px-1.5 py-0.5 bg-black/30 rounded text-amber-100/80 text-xs">{f}</code>
                          ))}
                        </div>
                        {tokenizerUpload.done ? (
                          <p className="text-xs text-green-400 font-medium">✓ Tokenizer uploaded — run inference again.</p>
                        ) : (
                          <>
                            <input
                              ref={tokenizerInputRef}
                              type="file"
                              accept=".json,.pickle,.pkl,.txt,application/json,application/octet-stream,text/plain"
                              className="hidden"
                              onChange={handleTokenizerUpload}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => tokenizerInputRef.current?.click()}
                              disabled={tokenizerUpload.uploading}
                            >
                              {tokenizerUpload.uploading ? 'Uploading…' : 'Upload tokenizer file'}
                            </Button>
                            {tokenizerUpload.error && (
                              <p className="text-xs text-red-400 mt-2">{tokenizerUpload.error}</p>
                            )}
                          </>
                        )}
                      </div>

                      {/* Option 2 */}
                      <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-xs font-semibold text-amber-200 mb-1">Option 2 — If it's a BERT / DistilBERT / transformer model</p>
                        <p className="text-xs text-amber-200/60 mb-2">
                          Transformer models use a <em>standard</em> tokenizer we can apply automatically — no file needed.
                          Install the <code className="px-1 bg-black/30 rounded">transformers</code> library in the inference server:
                        </p>
                        <code className="block text-xs bg-black/40 rounded px-2 py-1.5 text-green-300 font-mono select-all">
                          pip install transformers
                        </code>
                        <p className="text-xs text-amber-200/50 mt-1.5">
                          Then restart the inference server. The server will auto-detect the architecture (BERT, RoBERTa, etc.)
                          and apply the correct tokenizer with no extra files.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <OutputPanel
                ref={outputRef}
                data={(needsTokenizer || needsNumericInput) ? '' : outputData}
                modelType={selectedModel?.category || 'text'}
                isLoading={isRunning}
                testInfo={currentTest}
              />
            </div>
          </div>

        {/* History Panel */}
        {showHistoryPanel && (
          <div className="mt-8 p-6 bg-dark-surface rounded-lg border border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dark-text-primary flex items-center gap-2">
                <ClockIcon className="h-5 w-5" />
                Test History
              </h3>
              <Badge size="sm">
                {testHistory.length}
              </Badge>
            </div>

            {testHistory.length === 0 ? (
              <div className="text-center p-8">
                <ClockIcon className="h-8 w-8 text-dark-text-muted mx-auto mb-2" />
                <p className="text-sm text-dark-text-muted">No test history yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                {testHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`p-3 rounded-md border cursor-pointer transition-all duration-200 ${
                      selectedHistoryItem?.id === item.id
                        ? 'border-primary-400 bg-primary-400/10'
                        : 'border-dark-border bg-dark-surface hover:border-dark-text-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' : item.status === 'failed' ? 'bg-red-500' : 'bg-dark-text-muted'
                        }`} />
                        <span className="text-sm font-medium text-dark-text-primary">
                          {item.modelName}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHistoryItem(item.id);
                        }}
                        className="p-1"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-dark-text-muted truncate">
                      {item.input}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-dark-text-muted">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      {item.tokensUsed && (
                        <span>{item.tokensUsed} tokens</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {testHistory.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestHistory([]);
                    setSelectedHistoryItem(null);
                    localStorage.removeItem('sandbox-history');
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear History
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sandbox;
