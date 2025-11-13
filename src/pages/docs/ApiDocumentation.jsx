import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CodeBracketIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ChevronRightIcon,
  CommandLineIcon,
  KeyIcon,
  CloudArrowUpIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { clsx } from 'clsx';

const ApiDocumentation = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/v1/models',
      description: 'Retrieve list of all available AI models',
      params: ['page', 'limit', 'category', 'sort'],
      response: {
        success: true,
        data: [
          {
            id: 'model_123',
            name: 'GPT-Vision Pro',
            category: 'Computer Vision',
            price: '100 MCT'
          }
        ]
      }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/models/{id}',
      description: 'Get detailed information about a specific model',
      params: ['id (required)'],
      response: {
        success: true,
        data: {
          id: 'model_123',
          name: 'GPT-Vision Pro',
          description: 'Advanced computer vision model',
          creator: '0x1234...5678',
          price: '100 MCT',
          downloads: 15420
        }
      }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/models',
      description: 'Upload a new AI model to the marketplace',
      params: ['name', 'description', 'category', 'price', 'file'],
      response: {
        success: true,
        data: {
          id: 'model_456',
          transaction_hash: '0xabc...def',
          status: 'pending_validation'
        }
      }
    },
    {
      method: 'POST',
      endpoint: '/api/v1/models/{id}/execute',
      description: 'Execute a model with provided input data',
      params: ['id', 'input_data', 'parameters'],
      response: {
        success: true,
        data: {
          result: { output: 'Model execution result' },
          execution_time: '234ms',
          cost: '0.5 MCT'
        }
      }
    },
    {
      method: 'GET',
      endpoint: '/api/v1/wallet/balance',
      description: 'Get wallet balance and transaction history',
      params: ['address'],
      response: {
        success: true,
        data: {
          address: '0x1234...5678',
          balance: '1500 MCT',
          transactions: []
        }
      }
    }
  ];

  const codeExamples = {
    javascript: `// Initialize ModelChain SDK
import { ModelChain } from '@modelchain/sdk';

const client = new ModelChain({
  apiKey: 'YOUR_API_KEY',
  network: 'mainnet'
});

// Get all models
const models = await client.models.list({
  category: 'nlp',
  limit: 10
});

// Execute a model
const result = await client.models.execute('model_123', {
  input: 'Hello, world!',
  parameters: {
    temperature: 0.7,
    max_tokens: 100
  }
});

console.log(result.data);`,
    python: `# Install: pip install modelchain-sdk
from modelchain import ModelChain

# Initialize client
client = ModelChain(
    api_key='YOUR_API_KEY',
    network='mainnet'
)

# Get all models
models = client.models.list(
    category='nlp',
    limit=10
)

# Execute a model
result = client.models.execute('model_123', {
    'input': 'Hello, world!',
    'parameters': {
        'temperature': 0.7,
        'max_tokens': 100
    }
})

print(result['data'])`,
    curl: `# Get models
curl -X GET "https://api.modelchain.io/v1/models?category=nlp&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# Execute model
curl -X POST "https://api.modelchain.io/v1/models/model_123/execute" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": "Hello, world!",
    "parameters": {
      "temperature": 0.7,
      "max_tokens": 100
    }
  }'`
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">API Documentation</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              API
            </span> Documentation
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Complete REST API reference for integrating ModelChain into your applications.
            Get started with our powerful API endpoints and SDKs.
          </p>
        </div>

        {/* Quick Start */}
        <Card variant="elevated" className="p-8 mb-8">
          <div className="flex items-center mb-6">
            <KeyIcon className="h-8 w-8 text-primary-400 mr-3" />
            <h2 className="text-2xl font-bold text-dark-text-primary">Quick Start</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">1. Get Your API Key</h3>
              <p className="text-dark-text-secondary mb-4">
                Generate your API key from your <Link to="/dashboard" className="text-primary-400 hover:text-primary-300">Dashboard</Link>
              </p>
              <div className="bg-dark-bg-primary p-4 rounded font-mono text-sm text-green-400">
                API_KEY=mck_live_1234567890abcdef
              </div>
            </div>

            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">2. Base URL</h3>
              <p className="text-dark-text-secondary mb-4">All API requests should be made to:</p>
              <div className="bg-dark-bg-primary p-4 rounded font-mono text-sm text-cyan-400 flex items-center justify-between">
                <span>https://api.modelchain.io/v1</span>
                <button
                  onClick={() => copyToClipboard('https://api.modelchain.io/v1', 'base-url')}
                  className="text-dark-text-secondary hover:text-primary-400"
                >
                  {copiedEndpoint === 'base-url' ? (
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-2">3. Authentication</h3>
              <p className="text-dark-text-secondary mb-4">Include your API key in the Authorization header:</p>
              <div className="bg-dark-bg-primary p-4 rounded font-mono text-sm text-purple-400">
                Authorization: Bearer YOUR_API_KEY
              </div>
            </div>
          </div>
        </Card>

        {/* Code Examples */}
        <Card variant="elevated" className="p-8 mb-8">
          <div className="flex items-center mb-6">
            <CodeBracketIcon className="h-8 w-8 text-secondary-400 mr-3" />
            <h2 className="text-2xl font-bold text-dark-text-primary">Code Examples</h2>
          </div>

          <div className="flex space-x-4 mb-6">
            {['javascript', 'python', 'curl'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={clsx(
                  'px-6 py-2 rounded-lg font-semibold transition-all',
                  selectedLanguage === lang
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-surface text-dark-text-secondary hover:bg-dark-surface-hover'
                )}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          <div className="bg-dark-bg-primary rounded-lg p-6 relative">
            <button
              onClick={() => copyToClipboard(codeExamples[selectedLanguage], 'code-example')}
              className="absolute top-4 right-4 text-dark-text-secondary hover:text-primary-400"
            >
              {copiedEndpoint === 'code-example' ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <DocumentDuplicateIcon className="h-5 w-5" />
              )}
            </button>
            <pre className="text-sm text-green-400 overflow-x-auto">
              <code>{codeExamples[selectedLanguage]}</code>
            </pre>
          </div>
        </Card>

        {/* API Endpoints */}
        <Card variant="elevated" className="p-8 mb-8">
          <div className="flex items-center mb-6">
            <CommandLineIcon className="h-8 w-8 text-accent-400 mr-3" />
            <h2 className="text-2xl font-bold text-dark-text-primary">API Endpoints</h2>
          </div>

          <div className="space-y-6">
            {apiEndpoints.map((endpoint, index) => (
              <div
                key={index}
                className="bg-dark-surface rounded-lg p-6 border border-dark-border hover:border-primary-400/30 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span
                      className={clsx(
                        'px-3 py-1 rounded font-semibold text-sm',
                        endpoint.method === 'GET' && 'bg-green-500/20 text-green-400',
                        endpoint.method === 'POST' && 'bg-blue-500/20 text-blue-400',
                        endpoint.method === 'PUT' && 'bg-yellow-500/20 text-yellow-400',
                        endpoint.method === 'DELETE' && 'bg-red-500/20 text-red-400'
                      )}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-primary-400 font-mono text-sm">{endpoint.endpoint}</code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(endpoint.endpoint, `endpoint-${index}`)}
                    className="text-dark-text-secondary hover:text-primary-400"
                  >
                    {copiedEndpoint === `endpoint-${index}` ? (
                      <CheckIcon className="h-5 w-5 text-green-400" />
                    ) : (
                      <DocumentDuplicateIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <p className="text-dark-text-secondary mb-4">{endpoint.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-dark-text-primary mb-2">Parameters</h4>
                    <div className="bg-dark-bg-primary rounded p-3">
                      {endpoint.params.map((param, i) => (
                        <div key={i} className="text-sm text-cyan-400 font-mono">• {param}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-dark-text-primary mb-2">Response</h4>
                    <div className="bg-dark-bg-primary rounded p-3">
                      <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                        {JSON.stringify(endpoint.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Rate Limits */}
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-primary-400 mb-2">Free Tier</h3>
              <p className="text-3xl font-bold text-dark-text-primary mb-2">100</p>
              <p className="text-dark-text-secondary">requests per hour</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-6 border border-primary-400/50">
              <h3 className="text-lg font-semibold text-secondary-400 mb-2">Pro Tier</h3>
              <p className="text-3xl font-bold text-dark-text-primary mb-2">1,000</p>
              <p className="text-dark-text-secondary">requests per hour</p>
            </div>
            <div className="bg-dark-surface rounded-lg p-6 border border-dark-border">
              <h3 className="text-lg font-semibold text-accent-400 mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-dark-text-primary mb-2">Unlimited</p>
              <p className="text-dark-text-secondary">custom rate limits</p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card variant="elevated" className="p-8 text-center">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Need Help?</h2>
          <p className="text-dark-text-secondary mb-6">
            Join our developer community or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/support/developers">
              <Button variant="primary">Developer Support</Button>
            </Link>
            <Link to="/docs/sdk">
              <Button variant="secondary">SDK Documentation</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocumentation;
