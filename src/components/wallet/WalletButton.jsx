import React, { useState, useRef, useEffect } from 'react';
import {
  WalletIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  ArrowRightOnRectangleIcon,
  CogIcon,
  UserIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SignalIcon,
  SignalSlashIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const WalletButton = ({
  isConnected = false,
  isConnecting = false,
  walletAddress = '',
  balance = { eth: '0.0', usd: '0.00' },
  network = 'ethereum',
  walletType = 'MetaMask',
  onConnect,
  onDisconnect,
  onViewProfile,
  onSettings,
  onCopyAddress,
  onViewOnExplorer,
  className = '',
  showBalance = true,
  showNetwork = true,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset copy success after timeout
  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const networkConfig = {
    ethereum: {
      name: 'Ethereum',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      icon: '⟠'
    },
    polygon: {
      name: 'Polygon',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      icon: '🔷'
    },
    bsc: {
      name: 'BSC',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      icon: '🟡'
    },
    arbitrum: {
      name: 'Arbitrum',
      color: 'text-blue-300',
      bgColor: 'bg-blue-400/20',
      icon: '🔵'
    },
    optimism: {
      name: 'Optimism',
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      icon: '🔴'
    }
  };

  const currentNetwork = networkConfig[network] || networkConfig.ethereum;

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (value) => {
    if (!isBalanceVisible) return '••••';
    const num = parseFloat(value);
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    if (num >= 1) return num.toFixed(3);
    return num.toFixed(4);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopySuccess(true);
      onCopyAddress?.();
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const toggleBalance = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleConnect = () => {
    setIsOpen(false);
    onConnect?.();
  };

  const handleDisconnect = () => {
    setIsOpen(false);
    onDisconnect?.();
  };

  const handleViewProfile = () => {
    setIsOpen(false);
    onViewProfile?.();
  };

  const handleSettings = () => {
    setIsOpen(false);
    onSettings?.();
  };

  const handleViewOnExplorer = () => {
    setIsOpen(false);
    onViewOnExplorer?.(walletAddress, network);
  };

  // If not connected, show connect button
  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        loading={isConnecting}
        disabled={isConnecting}
        variant="primary"
        className={clsx('relative overflow-hidden', className)}
      >
        <WalletIcon className="h-5 w-5 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        
        {/* Connecting animation overlay */}
        {isConnecting && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-400/20 to-transparent animate-shimmer" />
        )}
      </Button>
    );
  }

  // Connected wallet button with dropdown
  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all duration-200',
          'bg-dark-surface-elevated border-dark-surface-elevated hover:border-primary-500/50',
          'text-dark-text-primary hover:bg-dark-surface-hover',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
          {
            'px-3 py-1.5': compact,
            'border-primary-500/50 bg-primary-500/10': isOpen
          }
        )}
      >
        {/* Network indicator */}
        {showNetwork && (
          <div className={clsx(
            'flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium',
            currentNetwork.bgColor,
            currentNetwork.color
          )}>
            {currentNetwork.icon}
          </div>
        )}

        {/* Wallet info */}
        <div className="flex flex-col items-start min-w-0">
          <div className="flex items-center space-x-2">
            <span className={clsx(
              'text-sm font-medium truncate',
              compact ? 'max-w-16' : 'max-w-24'
            )}>
              {formatAddress(walletAddress)}
            </span>
            {/* Connection status indicator */}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Balance display */}
          {showBalance && !compact && (
            <div className="flex items-center space-x-1 text-xs text-dark-text-secondary">
              <span>{formatBalance(balance.eth)} ETH</span>
              <span>•</span>
              <span>${formatBalance(balance.usd)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBalance();
                }}
                className="ml-1 text-dark-text-muted hover:text-dark-text-secondary transition-colors"
              >
                {isBalanceVisible ? (
                  <EyeSlashIcon className="h-3 w-3" />
                ) : (
                  <EyeIcon className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dropdown arrow */}
        <ChevronDownIcon className={clsx(
          'h-4 w-4 text-dark-text-muted transition-transform duration-200',
          { 'rotate-180': isOpen }
        )} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-dark-surface-elevated border border-dark-surface-elevated rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-dark-surface-elevated/30 bg-dark-surface-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={clsx(
                  'flex items-center justify-center w-8 h-8 rounded-full',
                  currentNetwork.bgColor
                )}>
                  <span className={clsx('text-sm', currentNetwork.color)}>
                    {currentNetwork.icon}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-dark-text-primary">
                    {walletType}
                  </div>
                  <div className="text-xs text-dark-text-secondary">
                    {currentNetwork.name} Network
                  </div>
                </div>
              </div>
              <Badge variant="success" size="xs">
                <SignalIcon className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="px-4 py-3 border-b border-dark-surface-elevated/30">
            <div className="space-y-2">
              {/* Address */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-secondary">Address</span>
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-dark-text-primary bg-dark-surface-primary px-2 py-1 rounded">
                    {formatAddress(walletAddress)}
                  </code>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 text-dark-text-muted hover:text-primary-400 transition-colors"
                    title="Copy address"
                  >
                    {copySuccess ? (
                      <CheckIcon className="h-4 w-4 text-green-400" />
                    ) : (
                      <DocumentDuplicateIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-text-secondary">Balance</span>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-dark-text-primary">
                      {formatBalance(balance.eth)} ETH
                    </div>
                    <div className="text-xs text-dark-text-secondary">
                      ${formatBalance(balance.usd)} USD
                    </div>
                  </div>
                  <button
                    onClick={toggleBalance}
                    className="p-1 text-dark-text-muted hover:text-primary-400 transition-colors"
                    title={isBalanceVisible ? 'Hide balance' : 'Show balance'}
                  >
                    {isBalanceVisible ? (
                      <EyeSlashIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <div className="py-2">
            <button
              onClick={handleViewProfile}
              className="w-full px-4 py-2 text-left text-sm text-dark-text-primary hover:bg-dark-surface-hover flex items-center space-x-3 transition-colors"
            >
              <UserIcon className="h-4 w-4 text-dark-text-muted" />
              <span>View Profile</span>
            </button>

            <button
              onClick={handleViewOnExplorer}
              className="w-full px-4 py-2 text-left text-sm text-dark-text-primary hover:bg-dark-surface-hover flex items-center space-x-3 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4 text-dark-text-muted" />
              <span>View on Explorer</span>
            </button>

            <button
              onClick={handleCopyAddress}
              className="w-full px-4 py-2 text-left text-sm text-dark-text-primary hover:bg-dark-surface-hover flex items-center space-x-3 transition-colors"
            >
              <DocumentDuplicateIcon className="h-4 w-4 text-dark-text-muted" />
              <span>Copy Address</span>
              {copySuccess && (
                <CheckIcon className="h-4 w-4 text-green-400 ml-auto" />
              )}
            </button>

            <div className="border-t border-dark-surface-elevated/30 my-2" />

            <button
              onClick={handleSettings}
              className="w-full px-4 py-2 text-left text-sm text-dark-text-primary hover:bg-dark-surface-hover flex items-center space-x-3 transition-colors"
            >
              <CogIcon className="h-4 w-4 text-dark-text-muted" />
              <span>Wallet Settings</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center space-x-3 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-dark-surface-elevated/30 bg-dark-surface-primary/10">
            <div className="flex items-center justify-between text-xs text-dark-text-muted">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Secure Connection</span>
              </div>
              <span>{currentNetwork.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Copy success toast */}
      {copySuccess && (
        <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-green-500 text-white text-xs rounded-lg shadow-lg z-50 animate-fade-in">
          Address copied to clipboard!
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WalletButton;