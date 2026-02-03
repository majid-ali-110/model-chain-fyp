import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  WalletIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  SparklesIcon,
  CubeTransparentIcon,
  LockClosedIcon,
  BoltIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import WalletConnectModal from '../components/wallet/WalletConnectModal';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

const ConnectWallet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { connected, connecting, connectWallet, profile, needsOnboarding } = useWallet();
  const { isAuthenticated } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  // Get the page user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect to the intended page (or dashboard) if already authenticated
  // Or if connected and has profile (even if onboarding hasn't completed yet)
  useEffect(() => {
    if (connected && isAuthenticated) {
      navigate(from, { replace: true });
    } else if (connected && profile && !needsOnboarding) {
      // User is connected with profile, auth might be in progress
      // Give it a moment then redirect
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          navigate(from, { replace: true });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connected, isAuthenticated, navigate, from, profile, needsOnboarding]);

  const handleConnectClick = () => {
    setShowWalletModal(true);
  };

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure',
      description: 'Cryptographic wallet signatures'
    },
    {
      icon: LockClosedIcon,
      title: 'Private',
      description: 'No passwords to remember'
    },
    {
      icon: BoltIcon,
      title: 'Instant',
      description: 'One-click authentication'
    }
  ];

  const benefits = [
    'Access decentralized AI marketplace',
    'Own and trade AI models as NFTs',
    'Earn rewards for validation',
    'Participate in governance'
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6 shadow-lg shadow-primary-500/25">
            <CubeTransparentIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Welcome to ModelChain
          </h1>
          <p className="text-dark-text-secondary">
            Connect your wallet to access the decentralized AI marketplace
          </p>
        </div>

        {/* Redirect Notice */}
        {location.state?.from && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-dark-text-primary font-medium mb-1">
                  Wallet Connection Required
                </p>
                <p className="text-dark-text-secondary">
                  Please connect your wallet to access this page. You'll be redirected after connecting.
                </p>
              </div>
            </div>
          </div>
        )}

        <Card variant="elevated" className="p-8">
          {/* Main Connect Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-full mb-6">
              <WalletIcon className="h-10 w-10 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-dark-text-primary mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-sm text-dark-text-secondary mb-6">
              Use MetaMask, WalletConnect, or any Web3 wallet to sign in securely
            </p>

            {/* Wallet Connect Button */}
            <Button
              onClick={handleConnectClick}
              disabled={connecting}
              variant="primary"
              className="w-full justify-center py-4 text-lg"
            >
              <WalletIcon className="h-5 w-5 mr-2" />
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-dark-text-primary font-medium mb-1">
                  Secure Wallet Authentication
                </p>
                <p className="text-dark-text-secondary">
                  Sign a message to prove wallet ownership. We never access your private keys or funds.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-sm">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                <span className="text-dark-text-secondary">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Features Grid */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-dark-surface-elevated rounded-lg mb-2">
                <feature.icon className="h-5 w-5 text-primary-400" />
              </div>
              <p className="text-sm font-medium text-dark-text-primary">
                {feature.title}
              </p>
              <p className="text-xs text-dark-text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* New User Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-dark-text-secondary">
            New to Web3?{' '}
            <a 
              href="https://metamask.io/download/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-medium"
            >
              Get MetaMask
            </a>
            {' '}to create a wallet
          </p>
        </div>

        {/* Bottom Badges */}
        <div className="mt-6 flex justify-center gap-2">
          <Badge variant="secondary" size="sm">
            <SparklesIcon className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" size="sm">
            <CubeTransparentIcon className="h-3 w-3 mr-1" />
            Decentralized
          </Badge>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={connectWallet}
        isConnecting={connecting}
      />
    </div>
  );
};

export default ConnectWallet;
