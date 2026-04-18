import React, { useState, useRef } from 'react';
import {
  XMarkIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const InputPanel = ({
  model = null,
  inputData = '',
  onInputChange = () => {},
  parameters = {},
  onParametersChange = () => {},
  isLoading = false
}) => {
  const fileInputRef = useRef(null);

  const handleParameterChange = (key, value) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onInputChange(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input Section */}
      <div className="bg-dark-surface rounded-lg border border-dark-border p-4">
        <h3 className="text-base font-semibold text-dark-text-primary mb-4">
          Input
        </h3>
        
        <textarea
          value={inputData}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter your test input here..."
          disabled={isLoading}
          className={`w-full min-h-[200px] p-3 bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm font-mono resize-y ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        />

        <div className="mt-3 text-xs text-dark-text-muted">
          {inputData.length} characters
        </div>
      </div>

      {/* Parameters Section */}
      <div className="bg-dark-surface rounded-lg border border-dark-border p-4">
        <h3 className="text-base font-semibold text-dark-text-primary mb-4 flex items-center gap-2">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
          Parameters
        </h3>

        <div className="flex flex-col gap-4">
          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-dark-text-primary">
                Temperature
              </label>
              <span className="text-sm text-primary-400 font-bold">
                {parameters.temperature?.toFixed(2) || '0.70'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={parameters.temperature || 0.7}
              onChange={(e) => handleParameterChange('temperature', parseFloat(e.target.value))}
              disabled={isLoading}
              className={`w-full h-2 bg-dark-border rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            />
            <div className="text-xs text-dark-text-muted mt-1">
              Controls randomness: 0 (deterministic) to 2 (creative)
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="text-sm font-medium text-dark-text-primary block mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              min="1"
              max="4096"
              value={parameters.maxTokens || 150}
              onChange={(e) => handleParameterChange('maxTokens', parseInt(e.target.value))}
              disabled={isLoading}
              className={`w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
            />
          </div>

          {/* Top P */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-dark-text-primary">
                Top P
              </label>
              <span className="text-sm text-primary-400 font-bold">
                {parameters.topP?.toFixed(2) || '1.00'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={parameters.topP || 1.0}
              onChange={(e) => handleParameterChange('topP', parseFloat(e.target.value))}
              disabled={isLoading}
              className={`w-full h-2 bg-dark-border rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            />
          </div>

          {/* Frequency Penalty */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-dark-text-primary">
                Frequency Penalty
              </label>
              <span className="text-sm text-primary-400 font-bold">
                {parameters.frequencyPenalty?.toFixed(2) || '0.00'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={parameters.frequencyPenalty || 0}
              onChange={(e) => handleParameterChange('frequencyPenalty', parseFloat(e.target.value))}
              disabled={isLoading}
              className={`w-full h-2 bg-dark-border rounded-lg ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-dark-surface rounded-lg border border-dark-border p-4 text-center">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <DocumentTextIcon className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept=".txt,.json,.md"
        />
        <p className="text-xs text-dark-text-muted mt-2">
          Supported: .txt, .json, .md
        </p>
      </div>
    </div>
  );
};

export default InputPanel;
