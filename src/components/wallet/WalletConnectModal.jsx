import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  WalletIcon,
  LinkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  QrCodeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  CubeIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Loading from '../ui/Loading';
import Badge from '../ui/Badge';

const WalletConnectModal = ({
  isOpen = false,
  onClose,
  onConnect,
  isConnecting = false,
  connectionError = null,
  className = ''
}) => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [connectionStep, setConnectionStep] = useState('select'); // 'select', 'connecting', 'success', 'error'
  const [qrCode, setQrCode] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedProvider(null);
      setConnectionStep('select');
      setQrCode(null);
    }
  }, [isOpen]);

  // Handle connection status changes
  useEffect(() => {
    if (isConnecting) {
      setConnectionStep('connecting');
    } else if (connectionError) {
      setConnectionStep('error');
    }
  }, [isConnecting, connectionError]);

  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Connect using browser extension',
      icon: '🦊',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-400',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      downloadUrl: 'https://metamask.io/download/',
      features: ['Browser Extension', 'Hardware Wallet Support', 'Secure'],
      type: 'extension'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Scan with your mobile wallet',
      icon: '📱',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      isInstalled: true,
      features: ['Mobile Wallets', 'QR Code', 'Cross-Platform'],
      type: 'qr'
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      description: 'Connect with Coinbase Wallet',
      icon: '🔵',
      color: 'text-blue-500',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-600/30 hover:border-blue-500',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet,
      downloadUrl: 'https://wallet.coinbase.com/',
      features: ['Mobile & Desktop', 'DeFi Ready', 'NFT Support'],
      type: 'extension'
    },
    {
      id: 'trust',
      name: 'Trust Wallet',
      description: 'Connect with Trust Wallet',
      icon: '🔷',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30 hover:border-cyan-400',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isTrust,
      downloadUrl: 'https://trustwallet.com/download',
      features: ['Mobile First', 'Multi-Chain', 'Built-in Browser'],
      type: 'extension'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      description: 'Connect with Phantom wallet',
      icon: '👻',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30 hover:border-purple-400',
      isInstalled: typeof window !== 'undefined' && window.solana?.isPhantom,
      downloadUrl: 'https://phantom.app/',
      features: ['Solana Support', 'NFT Gallery', 'DApp Browser'],
      type: 'extension'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      description: 'Connect with Rainbow wallet',
      icon: '🌈',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30 hover:border-pink-400',
      isInstalled: typeof window !== 'undefined' && window.ethereum?.isRainbow,
      downloadUrl: 'https://rainbow.me/',
      features: ['Beautiful UI', 'NFT Focus', 'Social Features'],
      type: 'extension'
    }
  ];

  const handleProviderSelect = async (provider) => {
    setSelectedProvider(provider);
    
    if (!provider.isInstalled && provider.type === 'extension') {
      // Show installation prompt
      return;
    }

    if (provider.type === 'qr') {
      // Generate QR code for WalletConnect
      setQrCode('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ3aGl0ZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiPkRlbW8gUVIgQ29kZTwvdGV4dD48L3N2Zz4=');
    }

    try {
      await onConnect?.(provider.id);
      setConnectionStep('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch {
      setConnectionStep('error');
    }
  };

  const handleInstallWallet = (provider) => {
    window.open(provider.downloadUrl, '_blank');
  };

  const handleRetry = () => {
    setConnectionStep('select');
    setSelectedProvider(null);
    setQrCode(null);
  };

  const renderWalletProvider = (provider) => (
    <div
      key={provider.id}
      onClick={() => !isConnecting && handleProviderSelect(provider)}
      className={clsx(
        'relative w-full p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
        'bg-dark-surface-elevated hover:bg-dark-surface-hover',
        'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
        provider.borderColor,
        {
          'opacity-50 cursor-not-allowed': isConnecting,
          'border-primary-500 bg-primary-500/10': selectedProvider?.id === provider.id
        }
      )}
    >
      <div className="flex items-start space-x-4">
        {/* Provider Icon */}
        <div className={clsx(
          'flex items-center justify-center w-12 h-12 rounded-xl',
          provider.bgColor
        )}>
          <span className="text-2xl">{provider.icon}</span>
        </div>

        {/* Provider Info */}
        <div className="flex-1 text-left">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-dark-text-primary">
              {provider.name}
            </h3>
            {provider.isInstalled ? (
              <Badge variant="success" size="xs">
                <CheckCircleIcon className="h-3 w-3 mr-1" />
                Detected
              </Badge>
            ) : (
              <Badge variant="warning" size="xs">
                Install Required
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-dark-text-secondary mb-2">
            {provider.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1">
            {provider.features.map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-dark-surface-primary text-dark-text-muted"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Action Indicator */}
        <div className="flex items-center">
          {provider.isInstalled ? (
            <div className={clsx('text-xl', provider.color)}>
              →
            </div>
          ) : (
            <div className="text-dark-text-muted">
              <LinkIcon className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>

      {/* Install prompt overlay */}
      {!provider.isInstalled && provider.type === 'extension' && (
        <div className="absolute inset-0 bg-dark-surface-elevated/95 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-dark-text-secondary mb-3">
              {provider.name} not detected
            </p>
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleInstallWallet(provider);
              }}
            >
              Install {provider.name}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderConnectionStep = () => {
    switch (connectionStep) {
      case 'connecting':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <Loading variant="neon" size="lg" />
            </div>
            
            <h3 className="text-lg font-semibold text-dark-text-primary mb-2">
              Connecting to {selectedProvider?.name}
            </h3>
            
            <p className="text-dark-text-secondary mb-4">
              {selectedProvider?.type === 'qr' 
                ? 'Scan the QR code with your mobile wallet'
                : 'Confirm the connection in your wallet extension'
              }
            </p>

            {selectedProvider?.type === 'qr' && qrCode && (
              <div className="bg-white p-4 rounded-lg inline-block mb-4">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 text-sm text-dark-text-muted">
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              <span>Waiting for confirmation...</span>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto animate-pulse" />
            </div>
            
            <h3 className="text-lg font-semibold text-dark-text-primary mb-2">
              Connection Successful!
            </h3>
            
            <p className="text-dark-text-secondary mb-4">
              Your wallet has been connected successfully.
            </p>

            <div className="flex items-center justify-center space-x-2 text-sm text-green-400">
              <CheckCircleIcon className="h-4 w-4" />
              <span>Redirecting...</span>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center py-8">
            <div className="mb-6">
              <ExclamationCircleIcon className="h-16 w-16 text-red-400 mx-auto" />
            </div>
            
            <h3 className="text-lg font-semibold text-dark-text-primary mb-2">
              Connection Failed
            </h3>
            
            <p className="text-dark-text-secondary mb-4">
              {connectionError || 'Failed to connect to your wallet. Please try again.'}
            </p>

            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                variant="primary"
                className="w-full"
              >
                Try Again
              </Button>
              
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-dark-text-primary mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-dark-text-secondary">
                Choose your preferred wallet to connect to ModelChain
              </p>
            </div>

            {/* Popular Wallets */}
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary mb-3 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2 text-primary-400" />
                Popular Wallets
              </h3>
              <div className="space-y-3">
                {walletProviders.slice(0, 2).map(renderWalletProvider)}
              </div>
            </div>

            {/* More Wallets */}
            <div>
              <h3 className="text-sm font-medium text-dark-text-primary mb-3 flex items-center">
                <CubeIcon className="h-4 w-4 mr-2 text-primary-400" />
                More Wallets
              </h3>
              <div className="space-y-3">
                {walletProviders.slice(2).map(renderWalletProvider)}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-5 w-5 text-primary-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-dark-text-primary font-medium mb-1">
                    Secure Connection
                  </p>
                  <p className="text-dark-text-secondary">
                    Your wallet connection is secured with end-to-end encryption. 
                    We never store your private keys or personal information.
                  </p>
                </div>
              </div>
            </div>

            {/* Help Links */}
            <div className="text-center">
              <p className="text-xs text-dark-text-muted mb-2">
                Need help choosing a wallet?
              </p>
              <div className="flex justify-center space-x-4">
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Wallet Guide
                </button>
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  Security Tips
                </button>
                <button className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                  FAQ
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={clsx('max-w-md', className)}
      closeOnBackdrop={connectionStep === 'select'}
    >
      <div className="relative">
        {/* Close Button */}
        {connectionStep !== 'connecting' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-dark-text-muted hover:text-dark-text-primary transition-colors z-10"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}

        {/* Content */}
        <div className="p-6">
          {renderConnectionStep()}
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectModal;