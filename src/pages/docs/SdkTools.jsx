import React from 'react';
import { Link } from 'react-router-dom';
import {
  CodeBracketIcon,
  CommandLineIcon,
  CubeIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  CloudArrowDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const SdkTools = () => {
  const sdks = [
    {
      name: 'JavaScript SDK',
      language: 'JavaScript/TypeScript',
      version: 'v2.5.0',
      icon: CodeBracketIcon,
      install: 'npm install @modelchain/sdk',
      docs: '/docs/sdk/javascript',
      github: 'https://github.com/modelchain/sdk-javascript',
      features: ['TypeScript support', 'Promise-based API', 'Browser & Node.js', 'Auto-retry logic']
    },
    {
      name: 'Python SDK',
      language: 'Python',
      version: 'v2.3.1',
      icon: CommandLineIcon,
      install: 'pip install modelchain-sdk',
      docs: '/docs/sdk/python',
      github: 'https://github.com/modelchain/sdk-python',
      features: ['Async/await support', 'Type hints', 'Pandas integration', 'CLI tools']
    },
    {
      name: 'Go SDK',
      language: 'Go',
      version: 'v1.8.0',
      icon: CubeIcon,
      install: 'go get github.com/modelchain/sdk-go',
      docs: '/docs/sdk/go',
      github: 'https://github.com/modelchain/sdk-go',
      features: ['Native concurrency', 'Zero dependencies', 'High performance', 'Idiomatic Go']
    }
  ];

  const tools = [
    {
      name: 'ModelChain CLI',
      description: 'Command-line interface for managing models and deployments',
      install: 'npm install -g @modelchain/cli',
      icon: CommandLineIcon,
      commands: ['mc login', 'mc upload', 'mc deploy', 'mc logs']
    },
    {
      name: 'VS Code Extension',
      description: 'Develop, test, and deploy models directly from VS Code',
      install: 'Search "ModelChain" in VS Code Extensions',
      icon: DocumentTextIcon,
      commands: ['Syntax highlighting', 'IntelliSense', 'Debugging', 'Deployment']
    },
    {
      name: 'Docker Images',
      description: 'Pre-configured containers for model development and deployment',
      install: 'docker pull modelchain/runtime:latest',
      icon: CubeIcon,
      commands: ['Base runtime', 'GPU-enabled', 'Development env', 'Production ready']
    }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">SDK & Tools</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              SDKs
            </span> & Developer Tools
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Official SDKs and tools to accelerate your development with ModelChain.
          </p>
        </div>

        {/* SDKs */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark-text-primary mb-6">Official SDKs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <Card key={index} variant="elevated" className="p-6 hover:border-primary-400/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <sdk.icon className="h-12 w-12 text-primary-400" />
                  <span className="text-sm text-dark-text-secondary">{sdk.version}</span>
                </div>
                
                <h3 className="text-xl font-bold text-dark-text-primary mb-2">{sdk.name}</h3>
                <p className="text-dark-text-secondary mb-4">{sdk.language}</p>
                
                <div className="bg-dark-bg-primary rounded p-3 mb-4">
                  <code className="text-sm text-green-400">{sdk.install}</code>
                </div>

                <div className="space-y-2 mb-6">
                  {sdk.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-dark-text-secondary">
                      <CheckCircleIcon className="h-4 w-4 text-accent-400 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="primary" size="sm" className="flex-1">
                    Documentation
                  </Button>
                  <Button variant="secondary" size="sm">
                    GitHub
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Developer Tools */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark-text-primary mb-6">Developer Tools</h2>
          <div className="space-y-6">
            {tools.map((tool, index) => (
              <Card key={index} variant="elevated" className="p-6">
                <div className="flex items-start gap-6">
                  <div className="bg-primary-500/20 rounded-lg p-4">
                    <tool.icon className="h-8 w-8 text-primary-400" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark-text-primary mb-2">{tool.name}</h3>
                    <p className="text-dark-text-secondary mb-4">{tool.description}</p>
                    
                    <div className="bg-dark-bg-primary rounded p-4 mb-4">
                      <code className="text-sm text-cyan-400">{tool.install}</code>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {tool.commands.map((cmd, i) => (
                        <div key={i} className="bg-dark-surface rounded px-3 py-2 text-sm text-dark-text-secondary">
                          {cmd}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="primary">Install</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card variant="elevated" className="p-8 text-center">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Ready to Get Started?</h2>
          <p className="text-dark-text-secondary mb-6">
            Check out our API documentation and tutorials to begin building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/docs/api">
              <Button variant="primary">API Documentation</Button>
            </Link>
            <Link to="/developer/upload">
              <Button variant="secondary">Upload Your Model</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SdkTools;
