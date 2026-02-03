import React, { useState, useCallback } from 'react';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  SpeakerWaveIcon,
  CpuChipIcon,
  TagIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChartBarIcon,
  ClockIcon,
  BeakerIcon,
  AcademicCapIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  LinkIcon,
  FolderIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const UploadModel = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsHash, setIpfsHash] = useState('');
  const [blockchainTxHash, setBlockchainTxHash] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Upload step
    files: [],
    modelType: '',
    framework: '',
    
    // Metadata step
    name: '',
    description: '',
    category: '',
    tags: [],
    version: '1.0.0',
    license: 'MIT',
    documentation: '',
    demoUrl: '',
    
    // Pricing step
    pricingModel: 'free', // free, one-time, subscription, usage-based
    price: '',
    currency: 'MCT',
    usageTiers: [],
    royaltyPercentage: '10',
    
    // Additional metadata
    requirements: {
      python: '',
      dependencies: '',
      hardware: '',
      memory: ''
    },
    performance: {
      accuracy: '',
      speed: '',
      modelSize: ''
    }
  });

  const steps = [
    {
      id: 'upload',
      title: 'Upload Files',
      description: 'Upload your model files and select framework',
      icon: CloudArrowUpIcon,
      color: 'blue'
    },
    {
      id: 'metadata',
      title: 'Model Details',
      description: 'Add metadata and documentation',
      icon: DocumentTextIcon,
      color: 'green'
    },
    {
      id: 'pricing',
      title: 'Pricing & License',
      description: 'Set pricing model and licensing terms',
      icon: CurrencyDollarIcon,
      color: 'yellow'
    },
    {
      id: 'review',
      title: 'Review & Deploy',
      description: 'Review and deploy to blockchain',
      icon: EyeIcon,
      color: 'purple'
    }
  ];

  const modelCategories = [
    { value: 'text', label: 'Text & NLP', icon: DocumentTextIcon },
    { value: 'image', label: 'Computer Vision', icon: PhotoIcon },
    { value: 'audio', label: 'Audio Processing', icon: SpeakerWaveIcon },
    { value: 'video', label: 'Video Analysis', icon: VideoCameraIcon },
    { value: 'multimodal', label: 'Multimodal', icon: CpuChipIcon },
    { value: 'reinforcement', label: 'Reinforcement Learning', icon: BeakerIcon },
    { value: 'recommendation', label: 'Recommendation', icon: ChartBarIcon },
    { value: 'classification', label: 'Classification', icon: TagIcon },
    { value: 'regression', label: 'Regression', icon: AcademicCapIcon }
  ];

  const frameworks = [
    'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'XGBoost',
    'Hugging Face', 'OpenAI', 'ONNX', 'JAX', 'MXNet', 'Caffe', 'Other'
  ];

  const licenses = [
    'MIT', 'Apache 2.0', 'GPL v3', 'BSD 3-Clause', 'Creative Commons',
    'Commercial', 'Proprietary', 'Custom'
  ];

  // File upload handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  // Form handlers
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Navigation
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Upload and deployment
  const simulateIPFSUpload = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Placeholder IPFS hash - will be replaced with real IPFS integration
    const placeholderHash = 'QmPlaceholder' + Date.now().toString(36);
    setIpfsHash(placeholderHash);
    setIsUploading(false);
  };

  const simulateBlockchainRegistration = async () => {
    setIsUploading(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Placeholder transaction hash - will be replaced with real blockchain tx
    const placeholderTxHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setBlockchainTxHash(placeholderTxHash);
    setIsUploading(false);
  };

  const handleFinalSubmit = async () => {
    await simulateIPFSUpload();
    await simulateBlockchainRegistration();
  };

  // Validation
  const isStepValid = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Upload
        return formData.files.length > 0 && formData.modelType && formData.framework;
      case 1: // Metadata
        return formData.name && formData.description && formData.category;
      case 2: // Pricing
        return formData.pricingModel && (formData.pricingModel === 'free' || formData.price);
      case 3: // Review
        return true;
      default:
        return false;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Step Components
  const UploadStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Upload Model Files</h3>
        <p className="text-gray-400">Upload your trained model files, weights, and configuration</p>
      </div>

      {/* File Upload Zone */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-gray-600 hover:border-gray-500'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white font-medium mb-2">Drag and drop files here</p>
        <p className="text-gray-400 text-sm mb-4">or click to browse</p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          accept=".pkl,.h5,.pt,.pth,.onnx,.tflite,.pb,.json,.yaml,.yml"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" as="span">
            Browse Files
          </Button>
        </label>
      </div>

      {/* Uploaded Files */}
      {formData.files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium">Uploaded Files</h4>
          {formData.files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <DocumentArrowUpIcon className="h-5 w-5 text-blue-400 mr-3" />
                <div>
                  <p className="text-white text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-300"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Model Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model Category</label>
          <select
            value={formData.modelType}
            onChange={(e) => updateFormData('modelType', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {modelCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Framework</label>
          <select
            value={formData.framework}
            onChange={(e) => updateFormData('framework', e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select framework</option>
            {frameworks.map((framework) => (
              <option key={framework} value={framework}>
                {framework}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Tips */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Upload Tips</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Include model weights, configuration, and tokenizer files</li>
              <li>• Supported formats: .pkl, .h5, .pt, .pth, .onnx, .tflite, .pb</li>
              <li>• Maximum file size: 5GB per file</li>
              <li>• Consider compressing large models</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const MetadataStep = () => {
    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e) => {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput.trim());
        setTagInput('');
      }
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Model Information</h3>
          <p className="text-gray-400">Provide detailed information about your model</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Model Name *"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter model name"
          />
          <Input
            label="Version"
            value={formData.version}
            onChange={(e) => updateFormData('version', e.target.value)}
            placeholder="1.0.0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your model's capabilities, use cases, and key features..."
          />
        </div>

        {/* Category and License */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => updateFormData('category', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {modelCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">License</label>
            <select
              value={formData.license}
              onChange={(e) => updateFormData('license', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {licenses.map((license) => (
                <option key={license} value={license}>
                  {license}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
          <form onSubmit={handleAddTag} className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tags (e.g., nlp, classification, computer-vision)"
            />
            <Button type="submit" size="sm">Add</Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-gray-400 hover:text-gray-300"
                >
                  <XCircleIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Documentation URL"
            value={formData.documentation}
            onChange={(e) => updateFormData('documentation', e.target.value)}
            placeholder="https://docs.example.com"
          />
          <Input
            label="Demo URL"
            value={formData.demoUrl}
            onChange={(e) => updateFormData('demoUrl', e.target.value)}
            placeholder="https://demo.example.com"
          />
        </div>

        {/* Technical Requirements */}
        <Card className="p-4">
          <h4 className="text-white font-medium mb-4">Technical Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Python Version"
              value={formData.requirements.python}
              onChange={(e) => updateNestedFormData('requirements', 'python', e.target.value)}
              placeholder="3.8+"
            />
            <Input
              label="Memory Requirements"
              value={formData.requirements.memory}
              onChange={(e) => updateNestedFormData('requirements', 'memory', e.target.value)}
              placeholder="4GB RAM"
            />
            <Input
              label="Dependencies"
              value={formData.requirements.dependencies}
              onChange={(e) => updateNestedFormData('requirements', 'dependencies', e.target.value)}
              placeholder="torch>=1.10.0, transformers>=4.0.0"
            />
            <Input
              label="Hardware"
              value={formData.requirements.hardware}
              onChange={(e) => updateNestedFormData('requirements', 'hardware', e.target.value)}
              placeholder="GPU recommended"
            />
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-4">
          <h4 className="text-white font-medium mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Accuracy/Score"
              value={formData.performance.accuracy}
              onChange={(e) => updateNestedFormData('performance', 'accuracy', e.target.value)}
              placeholder="95.2%"
            />
            <Input
              label="Inference Speed"
              value={formData.performance.speed}
              onChange={(e) => updateNestedFormData('performance', 'speed', e.target.value)}
              placeholder="100ms"
            />
            <Input
              label="Model Size"
              value={formData.performance.modelSize}
              onChange={(e) => updateNestedFormData('performance', 'modelSize', e.target.value)}
              placeholder="125MB"
            />
          </div>
        </Card>
      </div>
    );
  };

  const PricingStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Pricing & Monetization</h3>
        <p className="text-gray-400">Choose how you want to monetize your model</p>
      </div>

      {/* Pricing Model Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">Pricing Model</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              value: 'free',
              title: 'Free',
              description: 'Open source model, free for everyone',
              icon: GlobeAltIcon,
              color: 'green'
            },
            {
              value: 'one-time',
              title: 'One-time Purchase',
              description: 'Pay once, use forever',
              icon: BanknotesIcon,
              color: 'blue'
            },
            {
              value: 'subscription',
              title: 'Subscription',
              description: 'Monthly or yearly subscription',
              icon: ClockIcon,
              color: 'purple'
            },
            {
              value: 'usage-based',
              title: 'Usage-based',
              description: 'Pay per API call or inference',
              icon: ChartBarIcon,
              color: 'orange'
            }
          ].map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.value}
                onClick={() => updateFormData('pricingModel', model.value)}
                className={clsx(
                  'p-4 rounded-lg border text-left transition-colors',
                  formData.pricingModel === model.value
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                )}
              >
                <div className="flex items-center mb-2">
                  <Icon className="h-5 w-5 mr-2" />
                  <span className="font-medium">{model.title}</span>
                </div>
                <p className="text-sm text-gray-400">{model.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Input */}
      {formData.pricingModel !== 'free' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {formData.pricingModel === 'usage-based' ? 'Price per Call' : 'Price'}
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-3 pr-16 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              <div className="absolute right-3 top-2 text-gray-400">
                {formData.currency}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => updateFormData('currency', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MCT">MCT (ModelChain Token)</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ETH">ETH</option>
            </select>
          </div>
        </div>
      )}

      {/* Subscription Options */}
      {formData.pricingModel === 'subscription' && (
        <Card className="p-4">
          <h4 className="text-white font-medium mb-4">Subscription Tiers</h4>
          <div className="space-y-3">
            {['Basic', 'Pro', 'Enterprise'].map((tier) => (
              <div key={tier} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">{tier}</p>
                  <p className="text-sm text-gray-400">Configure {tier.toLowerCase()} tier pricing</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Usage Tiers */}
      {formData.pricingModel === 'usage-based' && (
        <Card className="p-4">
          <h4 className="text-white font-medium mb-4">Usage Tiers</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-sm text-gray-400 font-medium">
              <div>Calls/Month</div>
              <div>Price per Call</div>
              <div>Actions</div>
            </div>
            {[
              { calls: '0 - 1,000', price: '0.01' },
              { calls: '1,001 - 10,000', price: '0.008' },
              { calls: '10,001+', price: '0.005' }
            ].map((tier, index) => (
              <div key={index} className="grid grid-cols-3 gap-3 items-center p-2 bg-gray-800/50 rounded">
                <div className="text-white text-sm">{tier.calls}</div>
                <div className="text-white text-sm">{tier.price} MCT</div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Royalty Settings */}
      <Card className="p-4">
        <h4 className="text-white font-medium mb-4">Revenue Sharing</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platform Fee</label>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-white">10% of revenue</p>
              <p className="text-sm text-gray-400">Standard ModelChain platform fee</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Your Revenue</label>
            <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/30">
              <p className="text-green-400 font-medium">90% of revenue</p>
              <p className="text-sm text-gray-400">After platform fee</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Pricing Summary */}
      <Card className="p-4 bg-blue-900/20 border-blue-500/30">
        <h4 className="text-blue-400 font-medium mb-2">Pricing Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Model:</span>
            <span className="text-white capitalize">{formData.pricingModel}</span>
          </div>
          {formData.pricingModel !== 'free' && formData.price && (
            <div className="flex justify-between">
              <span className="text-gray-400">Price:</span>
              <span className="text-white">{formData.price} {formData.currency}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Platform Fee:</span>
            <span className="text-white">10%</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const ReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Review & Deploy</h3>
        <p className="text-gray-400">Review your model information before deploying to the blockchain</p>
      </div>

      {/* Model Summary */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-white">{formData.name || 'Unnamed Model'}</h4>
            <p className="text-gray-400">{formData.category && modelCategories.find(c => c.value === formData.category)?.label}</p>
          </div>
          <Badge variant="primary">v{formData.version}</Badge>
        </div>

        {formData.description && (
          <p className="text-gray-300 mb-4">{formData.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400">Framework</p>
            <p className="text-white font-medium">{formData.framework}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">License</p>
            <p className="text-white font-medium">{formData.license}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Files</p>
            <p className="text-white font-medium">{formData.files.length} files</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pricing</p>
            <p className="text-white font-medium capitalize">{formData.pricingModel}</p>
          </div>
        </div>

        {formData.tags.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Deployment Status */}
      <Card className="p-6">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <CloudArrowUpIcon className="h-5 w-5 mr-2" />
          Deployment Status
        </h4>

        <div className="space-y-4">
          {/* IPFS Upload */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <div className={clsx(
                'h-8 w-8 rounded-full flex items-center justify-center mr-3',
                ipfsHash ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
              )}>
                {ipfsHash ? <CheckCircleIcon className="h-5 w-5" /> : <FolderIcon className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-white font-medium">IPFS Storage</p>
                <p className="text-sm text-gray-400">
                  {ipfsHash ? `Stored: ${ipfsHash}` : 'Upload files to IPFS'}
                </p>
              </div>
            </div>
            {isUploading && !ipfsHash && (
              <div className="text-blue-400">
                <Loading size="sm" />
              </div>
            )}
          </div>

          {/* Blockchain Registration */}
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <div className={clsx(
                'h-8 w-8 rounded-full flex items-center justify-center mr-3',
                blockchainTxHash ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
              )}>
                {blockchainTxHash ? <CheckCircleIcon className="h-5 w-5" /> : <LinkIcon className="h-5 w-5" />}
              </div>
              <div>
                <p className="text-white font-medium">Blockchain Registration</p>
                <p className="text-sm text-gray-400">
                  {blockchainTxHash ? `Tx: ${blockchainTxHash.slice(0, 20)}...` : 'Register on blockchain'}
                </p>
              </div>
            </div>
            {isUploading && ipfsHash && !blockchainTxHash && (
              <div className="text-blue-400">
                <Loading size="sm" />
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && !ipfsHash && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Uploading to IPFS...</span>
                <span className="text-white">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Blockchain Details */}
      {ipfsHash && blockchainTxHash && (
        <Card className="p-6 bg-green-900/20 border-green-500/30">
          <h4 className="text-green-400 font-medium mb-4 flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Model Successfully Deployed
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400">IPFS Hash:</p>
              <code className="text-green-400 bg-gray-800 px-2 py-1 rounded text-xs break-all">
                {ipfsHash}
              </code>
            </div>
            <div>
              <p className="text-gray-400">Transaction Hash:</p>
              <code className="text-green-400 bg-gray-800 px-2 py-1 rounded text-xs break-all">
                {blockchainTxHash}
              </code>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="mr-2">
                View on Explorer
              </Button>
              <Button variant="outline" size="sm">
                Go to Model Page
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Deploy Button */}
      {!ipfsHash && !blockchainTxHash && (
        <div className="flex justify-center">
          <Button
            onClick={handleFinalSubmit}
            disabled={isUploading || !isStepValid(3)}
            size="lg"
            className="px-8"
          >
            {isUploading ? (
              <>
                <Loading size="sm" className="mr-2" />
                Deploying...
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Deploy Model
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return <UploadStep />;
      case 1: return <MetadataStep />;
      case 2: return <PricingStep />;
      case 3: return <ReviewStep />;
      default: return <UploadStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Model</h1>
          <p className="text-gray-400">Deploy your AI model to the ModelChain marketplace</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || (index === currentStep && isStepValid(index));
              const isAvailable = index <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isAvailable && setCurrentStep(index)}
                    className={clsx(
                      'flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors',
                      isActive && 'border-blue-500 bg-blue-500 text-white',
                      isCompleted && !isActive && 'border-green-500 bg-green-500 text-white',
                      !isActive && !isCompleted && 'border-gray-600 bg-gray-800 text-gray-400'
                    )}
                    disabled={!isAvailable}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </button>
                  
                  <div className="ml-3 hidden md:block">
                    <p className={clsx(
                      'text-sm font-medium',
                      isActive ? 'text-white' : 'text-gray-400'
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="w-8 h-0.5 bg-gray-600 mx-4 hidden md:block" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 mb-6">
          {renderStepContent()}
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <div className="text-sm text-gray-400">
              {ipfsHash && blockchainTxHash ? 'Model deployed successfully!' : 'Click deploy to publish your model'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModel;