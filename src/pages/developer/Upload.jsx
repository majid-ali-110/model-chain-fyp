import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Dropdown from '../../components/ui/Dropdown';
import { CloudArrowUpIcon, DocumentIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useWallet } from '../../contexts/WalletContext';
import { useModels } from '../../contexts/ModelContext';
import { uploadFile, uploadJSON } from '../../services/ipfs';

const Upload = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useWallet();
  const { uploadModel } = useModels();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    license: '',
    tags: '',
    file: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState(null); // 'file', 'metadata', 'contract', 'complete'
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const categories = [
    { value: 'language', label: 'Language Models' },
    { value: 'computer-vision', label: 'Computer Vision' },
    { value: 'audio', label: 'Audio & Speech' },
    { value: 'multimodal', label: 'Multimodal' },
    { value: 'analytics', label: 'Analytics & Prediction' },
    { value: 'research', label: 'Research & Experimental' }
  ];

  const licenses = [
    { value: 'mit', label: 'MIT License' },
    { value: 'apache', label: 'Apache 2.0' },
    { value: 'gpl', label: 'GPL v3' },
    { value: 'custom', label: 'Custom License' },
    { value: 'proprietary', label: 'Proprietary' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet to upload a model');
      return;
    }
    
    setUploading(true);
    setError(null);
    
    try {
      // Step 1: Upload model file to IPFS
      setUploadStep('file');
      const modelFileHash = await uploadFile(formData.file);
      
      // Step 2: Create and upload metadata to IPFS
      setUploadStep('metadata');
      const metadata = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        license: formData.license,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        modelFile: modelFileHash,
        creator: address,
        createdAt: new Date().toISOString(),
        version: '1.0.0',
      };
      
      const metadataHash = await uploadJSON(metadata);
      
      // Step 3: Mint NFT on blockchain
      setUploadStep('contract');
      const result = await uploadModel({
        ...metadata,
        metadataURI: metadataHash,
        price: formData.price,
      });
      
      if (result.success) {
        setUploadStep('complete');
        // Redirect to my models page after short delay
        setTimeout(() => {
          navigate('/developer/my-models');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to mint model NFT');
      }
    } catch (err) {
      setError(err.message);
      setUploadStep(null);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Upload New Model</h1>
        <p className="text-secondary-600">Share your AI model with the ModelChain community</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <Card.Content className="flex items-center gap-3 py-3">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </Card.Content>
        </Card>
      )}

      {/* Upload Progress */}
      {uploadStep && (
        <Card className="border-primary-200 bg-primary-50">
          <Card.Content className="py-4">
            <h3 className="font-medium text-primary-900 mb-3">Upload Progress</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className={`h-5 w-5 ${uploadStep === 'file' || uploadStep === 'metadata' || uploadStep === 'contract' || uploadStep === 'complete' ? 'text-green-500' : 'text-secondary-300'}`} />
                <span className={uploadStep === 'file' ? 'text-primary-700 font-medium' : 'text-secondary-600'}>
                  Uploading model file to IPFS...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className={`h-5 w-5 ${uploadStep === 'metadata' || uploadStep === 'contract' || uploadStep === 'complete' ? 'text-green-500' : 'text-secondary-300'}`} />
                <span className={uploadStep === 'metadata' ? 'text-primary-700 font-medium' : 'text-secondary-600'}>
                  Uploading metadata to IPFS...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className={`h-5 w-5 ${uploadStep === 'contract' || uploadStep === 'complete' ? 'text-green-500' : 'text-secondary-300'}`} />
                <span className={uploadStep === 'contract' ? 'text-primary-700 font-medium' : 'text-secondary-600'}>
                  Minting NFT on blockchain...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircleIcon className={`h-5 w-5 ${uploadStep === 'complete' ? 'text-green-500' : 'text-secondary-300'}`} />
                <span className={uploadStep === 'complete' ? 'text-green-700 font-medium' : 'text-secondary-600'}>
                  Upload complete!
                </span>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <Card>
          <Card.Header>
            <Card.Title>Model File</Card.Title>
            <Card.Description>
              Upload your trained model file. Supported formats: .pkl, .h5, .onnx, .pt, .safetensors
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary-400 bg-primary-50' 
                  : 'border-secondary-300 hover:border-secondary-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.file ? (
                <div className="flex items-center justify-center gap-3">
                  <DocumentIcon className="h-8 w-8 text-primary-600" />
                  <div>
                    <p className="font-medium text-secondary-900">{formData.file.name}</p>
                    <p className="text-sm text-secondary-600">
                      {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleChange('file', null)}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <CloudArrowUpIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-secondary-900 mb-2">
                    Drop your model file here
                  </p>
                  <p className="text-secondary-600 mb-4">or</p>
                  <label className="cursor-pointer">
                    <Button type="button" variant="outline">
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pkl,.h5,.onnx,.pt,.safetensors"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
              )}
            </div>
          </Card.Content>
        </Card>

        {/* Model Details */}
        <Card>
          <Card.Header>
            <Card.Title>Model Details</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <Input
              label="Model Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., GPT-4 Clone"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <Dropdown
                  trigger={(
                    <Button variant="outline" className="w-full justify-between">
                      {formData.category 
                        ? categories.find(c => c.value === formData.category)?.label 
                        : 'Select category'
                      }
                    </Button>
                  )}
                  items={categories.map(category => ({
                    label: category.label,
                    onClick: () => handleChange('category', category.value)
                  }))}
                />
              </div>
              
              <Input
                label="Price (ETH)"
                type="number"
                step="0.001"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.05"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe your model's capabilities, use cases, and performance..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                License
              </label>
              <Dropdown
                trigger={(
                  <Button variant="outline" className="w-full justify-between">
                    {formData.license 
                      ? licenses.find(l => l.value === formData.license)?.label 
                      : 'Select license'
                    }
                  </Button>
                )}
                items={licenses.map(license => ({
                  label: license.label,
                  onClick: () => handleChange('license', license.value)
                }))}
              />
            </div>
            
            <Input
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="machine learning, nlp, transformer (comma separated)"
              helperText="Add tags to help users discover your model"
            />
          </Card.Content>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={uploading}
            disabled={!formData.file || !formData.name || !formData.category || !formData.price || uploading || uploadStep === 'complete'}
          >
            {uploading ? 'Uploading...' : uploadStep === 'complete' ? 'Upload Complete!' : 'Upload Model'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Upload;