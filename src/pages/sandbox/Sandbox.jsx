import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dummyModels } from '../../data/dummyModels';
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

const Sandbox = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State management
  const [selectedModel, setSelectedModel] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    maxTokens: 150,
    topP: 1.0,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    streaming: true
  });
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [showHistoryPanel] = useState(true);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  // Usage stats tracked internally (not displayed in UI yet)
  // eslint-disable-next-line no-unused-vars
  const [usageStats, setUsageStats] = useState({
    tokensUsed: 1250,
    tokenLimit: 5000,
    requestsUsed: 23,
    requestLimit: 100
  });
  const [viewMode, setViewMode] = useState('split'); // 'split', 'input', 'output'
  const [availableModels, setAvailableModels] = useState([]);
  const [modelSearch, setModelSearch] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const outputRef = useRef(null);

  // Initialize
  useEffect(() => {
    // Map category to sandbox category
    const categoryMap = {
      'Language': 'text',
      'Computer Vision': 'image',
      'Audio': 'audio',
      'Multimodal': 'text',
      'Time Series': 'text',
      'Medical': 'text'
    };

    // Convert dummy models to sandbox compatible format
    const sandboxModels = dummyModels.slice(0, 30).map(model => ({
      id: model.id,
      name: model.name,
      provider: model.developer?.name || 'Unknown',
      category: categoryMap[model.category] || 'text',
      description: model.description,
      pricing: {
        type: model.price === 0 ? 'free' : 'token',
        price: model.price || 0
      },
      maxTokens: 4096,
      contextLength: '128K',
      isPopular: model.featured || model.rating >= 4.7,
      isFree: model.price === 0,
      accuracy: model.accuracy,
      rating: model.rating,
      downloads: model.downloads,
      verified: model.verified
    }));

    // Add popular open-source models
    const mockModels = [
      ...sandboxModels,
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo (Demo)',
        provider: 'OpenAI',
        category: 'text',
        description: 'Most capable GPT-4 model with enhanced reasoning',
        pricing: { type: 'token', price: 0.03 },
        maxTokens: 4096,
        contextLength: '128K',
        isPopular: true,
        isFree: false
      },
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus (Demo)',
        provider: 'Anthropic',
        category: 'text',
        description: 'Most capable model for complex reasoning',
        pricing: { type: 'token', price: 0.05 },
        maxTokens: 4096,
        contextLength: '200K',
        isPopular: true,
        isFree: false
      },
      {
        id: 'dall-e-3',
        name: 'DALL-E 3 (Demo)',
        provider: 'OpenAI',
        category: 'image',
        description: 'Advanced image generation model',
        pricing: { type: 'image', price: 0.08 },
        maxTokens: null,
        contextLength: null,
        isPopular: true,
        isFree: false
      }
    ];

    setAvailableModels(mockModels);
    setFilteredModels(mockModels);
    
    // Check if model is specified in URL
    const modelId = searchParams.get('model');
    if (modelId) {
      const model = mockModels.find(m => m.id === modelId);
      if (model) {
        setSelectedModel(model);
      }
    } else {
      // Default to first popular model
      const defaultModel = mockModels.find(m => m.isPopular) || mockModels[0];
      setSelectedModel(defaultModel);
    }

    // Load test history from localStorage
    const savedHistory = localStorage.getItem('sandbox-history');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, [searchParams]);

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

    setIsRunning(true);
    setCurrentTest({
      id: Date.now(),
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      input: inputData,
      parameters: { ...parameters },
      timestamp: new Date().toISOString(),
      status: 'running'
    });

    try {
      // Simulate API call with streaming
      let output = '';
      const responses = [
        'This is a simulated response from ',
        selectedModel.name,
        '. The model is processing your input: "',
        inputData.substring(0, 50),
        '..."\n\n',
        'Key findings:\n',
        '• Temperature setting: ' + parameters.temperature + '\n',
        '• Max tokens: ' + parameters.maxTokens + '\n',
        '• Processing complete\n\n',
        'This is a mock response. Connect your backend API to see real results.'
      ];

      for (const response of responses) {
        await new Promise(resolve => setTimeout(resolve, 150));
        output += response;
        setOutputData(output);
      }

      setCurrentTest(prev => ({
        ...prev,
        status: 'completed',
        executionTime: Math.floor(Math.random() * 2000) + 500,
        tokensUsed: Math.floor(inputData.length / 4) + 50
      }));

      // Update usage stats
      setUsageStats(prev => ({
        ...prev,
        tokensUsed: prev.tokensUsed + 50,
        requestsUsed: prev.requestsUsed + 1
      }));

    } catch (error) {
      console.error('Test error:', error);
      setCurrentTest(prev => ({
        ...prev,
        status: 'failed',
        error: error.message
      }));
    } finally {
      setIsRunning(false);
    }
  }, [selectedModel, inputData, parameters]);

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
    setParameters(item.parameters || parameters);
  };

  const deleteHistoryItem = (id) => {
    setTestHistory(prev => prev.filter(item => item.id !== id));
    if (selectedHistoryItem?.id === id) {
      setSelectedHistoryItem(null);
    }
  };

  if (!selectedModel) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0c10', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', color: '#58a6ff', marginBottom: '16px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0c10' }}>
      {/* Header - Sticky below fixed navbar */}
      <div style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #30363d', position: 'sticky', top: '80px', zIndex: 40 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BeakerIcon style={{ height: '2rem', width: '2rem', color: '#58a6ff', marginRight: '0.75rem' }} />
                <div>
                  <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f0f6fc', margin: 0 }}>AI Sandbox</h1>
                  <p style={{ fontSize: '0.875rem', color: '#8b949e', margin: 0 }}>Test and experiment with AI models</p>
                </div>
              </div>

              {/* Model Selector */}
              <div style={{ position: 'relative' }}>
                <Button
                  variant="outline"
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  style={{ minWidth: '12rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    {selectedModel && (
                      <>
                        {React.createElement(getCategoryIcon(selectedModel.category), { 
                          style: { height: '1rem', width: '1rem', marginRight: '0.5rem' }
                        })}
                        <div style={{ textAlign: 'left', flex: 1 }}>
                          <div style={{ fontWeight: 500 }}>{selectedModel.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#8b949e' }}>{selectedModel.provider}</div>
                        </div>
                      </>
                    )}
                    <ChevronDownIcon style={{ height: '1rem', width: '1rem', marginLeft: '0.5rem' }} />
                  </div>
                </Button>

                {/* Model Dropdown */}
                {showModelSelector && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: 0, 
                    marginTop: '0.5rem', 
                    width: '24rem', 
                    backgroundColor: '#161b22', 
                    border: '1px solid #30363d',
                    borderRadius: '0.5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    zIndex: 50
                  }}>
                    <div style={{ padding: '1rem' }}>
                      <Input
                        type="text"
                        placeholder="Search models..."
                        value={modelSearch}
                        onChange={(e) => setModelSearch(e.target.value)}
                        icon={MagnifyingGlassIcon}
                        style={{ marginBottom: '1rem' }}
                      />
                      
                      <div style={{ maxHeight: '16rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                              style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '0.5rem',
                                textAlign: 'left',
                                border: selectedModel?.id === model.id ? '1px solid #58a6ff' : '1px solid transparent',
                                backgroundColor: selectedModel?.id === model.id ? 'rgba(88, 166, 255, 0.1)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                color: '#f0f6fc'
                              }}
                              onMouseEnter={(e) => {
                                if (selectedModel?.id !== model.id) {
                                  e.target.style.backgroundColor = '#30363d';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedModel?.id !== model.id) {
                                  e.target.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                                  <IconComponent style={{ height: '1.25rem', width: '1.25rem', color: '#8b949e', marginTop: '0.125rem' }} />
                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <h4 style={{ fontWeight: 500, margin: 0, color: '#f0f6fc' }}>{model.name}</h4>
                                      {model.isPopular && (
                                        <Badge variant="accent" size="sm" style={{ marginLeft: '0.5rem' }}>
                                          <FireIcon style={{ height: '0.75rem', width: '0.75rem', marginRight: '0.25rem' }} />
                                          Popular
                                        </Badge>
                                      )}
                                      {model.isFree && (
                                        <Badge variant="success" size="sm" style={{ marginLeft: '0.5rem' }}>
                                          Free
                                        </Badge>
                                      )}
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#8b949e', margin: '0.25rem 0 0 0' }}>{model.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b949e' }}>
                                      <span>{model.provider}</span>
                                      {model.contextLength && (
                                        <>
                                          <span style={{ margin: '0 0.5rem' }}>•</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* View Mode Toggle */}
              <div style={{ display: 'flex', backgroundColor: '#161b22', borderRadius: '0.5rem', padding: '0.25rem' }}>
                <button
                  onClick={() => setViewMode('split')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    transition: 'all 0.2s',
                    backgroundColor: viewMode === 'split' ? '#58a6ff' : 'transparent',
                    color: viewMode === 'split' ? '#fff' : '#8b949e',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Split View"
                >
                  <Squares2X2Icon style={{ height: '1rem', width: '1rem' }} />
                </button>
                <button
                  onClick={() => setViewMode('input')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    transition: 'all 0.2s',
                    backgroundColor: viewMode === 'input' ? '#58a6ff' : 'transparent',
                    color: viewMode === 'input' ? '#fff' : '#8b949e',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Input Focus"
                >
                  <DocumentTextIcon style={{ height: '1rem', width: '1rem' }} />
                </button>
                <button
                  onClick={() => setViewMode('output')}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    transition: 'all 0.2s',
                    backgroundColor: viewMode === 'output' ? '#58a6ff' : 'transparent',
                    color: viewMode === 'output' ? '#fff' : '#8b949e',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Output Focus"
                >
                  <EyeIcon style={{ height: '1rem', width: '1rem' }} />
                </button>
              </div>

              {/* Run Button */}
              <Button 
                onClick={runTest}
                disabled={isRunning || !selectedModel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isRunning ? (
                  <>
                    <ArrowPathIcon style={{ height: '1rem', width: '1rem', animation: 'spin 1s linear infinite' }} />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayIcon style={{ height: '1rem', width: '1rem' }} />
                    Run Test
                  </>
                )}
              </Button>

              {isRunning && (
                <Button 
                  variant="outline"
                  onClick={stopTest}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <StopIcon style={{ height: '1rem', width: '1rem' }} />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : (viewMode === 'input' ? '1fr' : '1fr'), gap: '1.5rem', minHeight: 'calc(100vh - 200px)' }}>
          {/* Input Section */}
          {(viewMode === 'split' || viewMode === 'input') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InputPanel
                model={selectedModel}
                inputData={inputData}
                onInputChange={setInputData}
                parameters={parameters}
                onParametersChange={setParameters}
                isLoading={isRunning}
              />
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button 
                  onClick={runTest}
                  disabled={isRunning || !inputData.trim()}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {isRunning ? (
                    <>
                      <ArrowPathIcon style={{ height: '1rem', width: '1rem', animation: 'spin 1s linear infinite' }} />
                      Running...
                    </>
                  ) : (
                    <>
                      <PlayIcon style={{ height: '1rem', width: '1rem' }} />
                      Run Test
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={clearInput}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <TrashIcon style={{ height: '1rem', width: '1rem' }} />
                </Button>
              </div>
            </div>
          )}

          {/* Output Section */}
          {(viewMode === 'split' || viewMode === 'output') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #30363d' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f0f6fc', margin: 0 }}>Output</h2>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(outputData)}
                    disabled={!outputData}
                    title="Copy to clipboard"
                  >
                    <DocumentDuplicateIcon style={{ height: '1rem', width: '1rem' }} />
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={clearOutput}
                    disabled={!outputData}
                    title="Clear output"
                  >
                    <TrashIcon style={{ height: '1rem', width: '1rem' }} />
                  </Button>
                </div>
              </div>
              
              <OutputPanel
                ref={outputRef}
                data={outputData}
                modelType={selectedModel?.category || 'text'}
                isLoading={isRunning}
                testInfo={currentTest}
              />
            </div>
          )}
        </div>

        {/* History Panel */}
        {showHistoryPanel && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#0d1117', borderRadius: '0.5rem', border: '1px solid #30363d' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f0f6fc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ClockIcon style={{ height: '1.25rem', width: '1.25rem' }} />
                Test History
              </h3>
              <Badge size="sm">
                {testHistory.length}
              </Badge>
            </div>

            {testHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <ClockIcon style={{ height: '2rem', width: '2rem', color: '#8b949e', margin: '0 auto 0.5rem' }} />
                <p style={{ fontSize: '0.875rem', color: '#8b949e', margin: 0 }}>No test history yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {testHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.375rem',
                      border: selectedHistoryItem?.id === item.id ? '1px solid #58a6ff' : '1px solid #30363d',
                      backgroundColor: selectedHistoryItem?.id === item.id ? 'rgba(88, 166, 255, 0.1)' : '#161b22',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedHistoryItem?.id !== item.id) {
                        e.currentTarget.style.borderColor = '#8b949e';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedHistoryItem?.id !== item.id) {
                        e.currentTarget.style.borderColor = '#30363d';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '0.5rem',
                          height: '0.5rem',
                          borderRadius: '50%',
                          backgroundColor: item.status === 'completed' ? '#3fb950' : item.status === 'failed' ? '#f85149' : '#8b949e'
                        }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f0f6fc' }}>
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
                        style={{ padding: '0.25rem' }}
                      >
                        <XMarkIcon style={{ height: '0.75rem', width: '0.75rem' }} />
                      </Button>
                    </div>
                    
                    <p style={{ fontSize: '0.875rem', color: '#8b949e', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.input}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b949e' }}>
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
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #30363d' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTestHistory([]);
                    setSelectedHistoryItem(null);
                    localStorage.removeItem('sandbox-history');
                  }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <TrashIcon style={{ height: '1rem', width: '1rem' }} />
                  Clear History
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Sandbox;
