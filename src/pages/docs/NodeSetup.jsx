import React from 'react';
import { Link } from 'react-router-dom';
import {
  ServerIcon,
  CommandLineIcon,
  CpuChipIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NodeSetup = () => {
  const requirements = [
    { category: 'Minimum', cpu: '4 cores', ram: '8 GB', storage: '100 GB SSD', network: '100 Mbps' },
    { category: 'Recommended', cpu: '8 cores', ram: '16 GB', storage: '500 GB SSD', network: '1 Gbps' },
    { category: 'Enterprise', cpu: '16+ cores', ram: '32+ GB', storage: '1 TB+ NVMe', network: '10 Gbps' }
  ];

  const setupSteps = [
    {
      title: 'Install Dependencies',
      code: `# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER`,
      description: 'Install required software packages'
    },
    {
      title: 'Download ModelChain Node',
      code: `# Download latest release
wget https://github.com/modelchain/node/releases/latest/download/modelchain-node.tar.gz

# Extract files
tar -xzf modelchain-node.tar.gz
cd modelchain-node

# Make executable
chmod +x modelchain-node`,
      description: 'Get the official validator node software'
    },
    {
      title: 'Configure Node',
      code: `# Create configuration file
cp config.example.yaml config.yaml

# Edit configuration
nano config.yaml

# Set your validator address, RPC endpoints, etc.`,
      description: 'Set up your node configuration'
    },
    {
      title: 'Start Validator Node',
      code: `# Initialize node
./modelchain-node init --network mainnet

# Start as background service
./modelchain-node start --daemon

# Check status
./modelchain-node status`,
      description: 'Launch your validator node'
    },
    {
      title: 'Stake Tokens',
      code: `# Stake MCT tokens (minimum 10,000 MCT)
./modelchain-node stake --amount 10000

# Verify stake
./modelchain-node stake-status`,
      description: 'Stake tokens to activate validator status'
    }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary py-12">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <div className="flex items-center text-dark-text-secondary mb-4">
            <Link to="/" className="hover:text-primary-400">Home</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-dark-text-primary">Node Setup</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Validator Node
            </span> Setup Guide
          </h1>
          <p className="text-xl text-dark-text-secondary max-w-3xl">
            Complete guide to setting up and running a ModelChain validator node.
          </p>
        </div>

        {/* System Requirements */}
        <Card variant="elevated" className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requirements.map((req, index) => (
              <div key={index} className="bg-dark-surface rounded-lg p-6 border border-dark-border">
                <h3 className="text-lg font-bold text-primary-400 mb-4">{req.category}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">CPU:</span>
                    <span className="text-dark-text-primary font-semibold">{req.cpu}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">RAM:</span>
                    <span className="text-dark-text-primary font-semibold">{req.ram}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">Storage:</span>
                    <span className="text-dark-text-primary font-semibold">{req.storage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark-text-secondary">Network:</span>
                    <span className="text-dark-text-primary font-semibold">{req.network}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Setup Steps */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-dark-text-primary mb-6">Setup Instructions</h2>
          <div className="space-y-6">
            {setupSteps.map((step, index) => (
              <Card key={index} variant="elevated" className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 border-2 border-primary-400 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-primary-400">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark-text-primary mb-2">{step.title}</h3>
                    <p className="text-dark-text-secondary mb-4">{step.description}</p>
                    <div className="bg-dark-bg-primary rounded-lg p-4 overflow-x-auto">
                      <pre className="text-sm text-green-400"><code>{step.code}</code></pre>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <Card variant="elevated" className="p-8 text-center">
          <ServerIcon className="h-16 w-16 text-primary-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-text-primary mb-4">Ready to Validate?</h2>
          <p className="text-dark-text-secondary mb-6">
            Start earning rewards by validating models and securing the network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/validator">
              <Button variant="primary">Validator Dashboard</Button>
            </Link>
            <Link to="/docs/validation">
              <Button variant="secondary">Validation Guidelines</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NodeSetup;
