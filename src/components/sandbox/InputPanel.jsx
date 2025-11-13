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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Input Section */}
      <div style={{ 
        backgroundColor: '#0d1117', 
        borderRadius: '0.5rem', 
        border: '1px solid #30363d',
        padding: '1rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', margin: '0 0 1rem 0' }}>
          Input
        </h3>
        
        <textarea
          value={inputData}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Enter your test input here..."
          disabled={isLoading}
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '0.75rem',
            backgroundColor: '#161b22',
            border: '1px solid #30363d',
            borderRadius: '0.375rem',
            color: '#f0f6fc',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            opacity: isLoading ? 0.5 : 1,
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
        />

        <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#8b949e' }}>
          {inputData.length} characters
        </div>
      </div>

      {/* Parameters Section */}
      <div style={{ 
        backgroundColor: '#0d1117', 
        borderRadius: '0.5rem', 
        border: '1px solid #30363d',
        padding: '1rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f0f6fc', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AdjustmentsHorizontalIcon style={{ height: '1.25rem', width: '1.25rem' }} />
          Parameters
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Temperature */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f0f6fc', margin: 0 }}>
                Temperature
              </label>
              <span style={{ fontSize: '0.875rem', color: '#58a6ff', fontWeight: 'bold' }}>
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
              style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#30363d',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#8b949e', marginTop: '0.25rem' }}>
              Controls randomness: 0 (deterministic) to 2 (creative)
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f0f6fc', display: 'block', marginBottom: '0.5rem' }}>
              Max Tokens
            </label>
            <input
              type="number"
              min="1"
              max="4096"
              value={parameters.maxTokens || 150}
              onChange={(e) => handleParameterChange('maxTokens', parseInt(e.target.value))}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                backgroundColor: '#161b22',
                border: '1px solid #30363d',
                borderRadius: '0.375rem',
                color: '#f0f6fc',
                fontSize: '0.875rem',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Top P */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f0f6fc', margin: 0 }}>
                Top P
              </label>
              <span style={{ fontSize: '0.875rem', color: '#58a6ff', fontWeight: 'bold' }}>
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
              style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#30363d',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            />
          </div>

          {/* Frequency Penalty */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#f0f6fc', margin: 0 }}>
                Frequency Penalty
              </label>
              <span style={{ fontSize: '0.875rem', color: '#58a6ff', fontWeight: 'bold' }}>
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
              style={{
                width: '100%',
                height: '0.5rem',
                backgroundColor: '#30363d',
                borderRadius: '0.5rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1
              }}
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div style={{ 
        backgroundColor: '#0d1117', 
        borderRadius: '0.5rem', 
        border: '1px solid #30363d',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          <DocumentTextIcon style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept=".txt,.json,.md"
        />
        <p style={{ fontSize: '0.75rem', color: '#8b949e', margin: '0.5rem 0 0 0' }}>
          Supported: .txt, .json, .md
        </p>
      </div>
    </div>
  );
};

export default InputPanel;
