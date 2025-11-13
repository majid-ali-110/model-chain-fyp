import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Dropdown from '../../components/ui/Dropdown';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

const Upload = () => {
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
    setUploading(true);
    
    // TODO: Implement upload logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploading(false);
    console.log('Upload complete:', formData);
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
          <Button type="button" variant="outline">
            Save Draft
          </Button>
          <Button 
            type="submit" 
            loading={uploading}
            disabled={!formData.file || !formData.name || !formData.category}
          >
            {uploading ? 'Uploading...' : 'Upload Model'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Upload;