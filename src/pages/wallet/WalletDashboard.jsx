import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  WalletIcon,
  CurrencyDollarIcon,
  ArrowUpRightIcon,
  ArrowDownLeftIcon,
  PlusIcon,
  MinusIcon,
  EyeIcon,
  EyeSlashIcon,
  ClipboardDocumentIcon,
  ChartPieIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  SwatchIcon,
  UserGroupIcon,
  GiftIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowsRightLeftIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  TrophyIcon,
  FireIcon,
  LightBulbIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  CpuChipIcon,
  LinkIcon,
  CalendarIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  SparklesIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  EyeIcon as EyeSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { ethers } from 'ethers';

const WalletDashboard = () => {
  const navigate = useNavigate();
  const { connected, address, balance, chainId, signer, updateBalance } = useWallet();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [isLoading, setIsLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendFormData, setSendFormData] = useState({ address: '', amount: '', asset: '' });

  // Get network info
  const getNetworkInfo = (chainId) => {
    const networks = {
      '1': { name: 'Ethereum', currency: 'ETH', isTestnet: false },
      '137': { name: 'Polygon', currency: 'POL', isTestnet: false },
      '80002': { name: 'Polygon Amoy', currency: 'POL', isTestnet: true },
      '11155111': { name: 'Sepolia', currency: 'ETH', isTestnet: true },
      '31337': { name: 'Localhost', currency: 'POL', isTestnet: true },
    };
    return networks[chainId] || { name: 'Unknown', currency: 'POL', isTestnet: true };
  };

  const networkInfo = getNetworkInfo(chainId);

  useEffect(() => {
    setSendFormData((prev) => ({ ...prev, asset: networkInfo.currency }));
  }, [networkInfo.currency]);

  // Wallet data from context - no fake USD for testnet
  const walletData = {
    totalBalance: parseFloat(balance || '0'),
    address: address || '',
    network: networkInfo.name,
    currency: networkInfo.currency,
    isTestnet: networkInfo.isTestnet,
    assets: [
      {
        symbol: networkInfo.currency,
        name: networkInfo.name,
        balance: parseFloat(balance || '0'),
        change24h: 0,
        icon: CurrencyDollarIcon,
        color: 'purple'
      }
    ],
    performance: {
      daily: 0,
      weekly: 0,
      monthly: 0,
      allTime: 0
    },
    staking: {
      totalStaked: 0,
      stakingRewards: 0,
      apy: 0,
      nextReward: 'N/A'
    }
  };

  // Transaction history - empty until blockchain integration
  const [transactions] = useState([]);



  useEffect(() => {
    const loadWalletData = async () => {
      // Check for wallet connection
      if (!connected || !isAuthenticated) {
        navigate('/connect-wallet');
        return;
      }
      setIsLoading(false);
    };

    loadWalletData();
  }, [connected, isAuthenticated, navigate]);

  // Helper functions
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatTokens = (amount, symbol) => {
    return `${amount.toLocaleString()} ${symbol}`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'purchase': return ShoppingCartIcon;
      case 'reward': return BanknotesIcon;
      case 'staking_reward': return TrophyIcon;
      case 'validation_reward': return CheckCircleIcon;
      case 'send': return ArrowUpRightIcon;
      case 'receive': return ArrowDownLeftIcon;
      default: return WalletIcon;
    }
  };

  const getTransactionColor = (type, amount) => {
    if (amount > 0) return 'text-green-400';
    if (amount < 0) return 'text-red-400';
    return 'text-dark-text-muted';
  };



  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleSendSubmit = async (e) => {
    e.preventDefault();

    if (!signer) {
      showError('Connect wallet to send funds.', { title: 'Wallet Required' });
      return;
    }

    if (sendFormData.asset !== walletData.currency) {
      showError(`Only ${walletData.currency} transfers are supported right now.`, { title: 'Asset Not Supported' });
      return;
    }

    try {
      const tx = await signer.sendTransaction({
        to: sendFormData.address,
        value: ethers.parseEther(sendFormData.amount || '0'),
      });
      await tx.wait();

      await updateBalance();
      showSuccess(`Sent ${sendFormData.amount} ${walletData.currency}`, { title: 'Transfer Complete' });
      setShowSendModal(false);
      setSendFormData({ address: '', amount: '', asset: walletData.currency });
    } catch (error) {
      showError(error.message || 'Transfer failed.', { title: 'Transfer Failed' });
    }
  };

  // Main Balance Card Component
  const BalanceCard = () => (
    <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-700 border-blue-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <WalletIcon className="h-8 w-8 text-white mr-3" />
          <div>
            <h2 className="text-lg font-semibold text-white">Total Balance</h2>
            <p className="text-blue-200 text-sm">{formatAddress(walletData.address)}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="text-white hover:text-blue-200 transition-colors"
          >
            {balanceVisible ? <EyeSolidIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => copyToClipboard(walletData.address)}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <ClipboardDocumentIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        {balanceVisible ? (
          <>
            <p className="text-3xl font-bold text-white mb-2">
              {walletData.totalBalance.toFixed(4)} {walletData.currency}
            </p>
            <div className="flex items-center">
              <span className="text-blue-200 text-sm mr-2">
                {walletData.network} {walletData.isTestnet && <Badge variant="warning" size="xs">Testnet</Badge>}
              </span>
              <div className="flex items-center">
                {walletData.performance.daily >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-300 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-300 mr-1" />
                )}
                <span className={clsx(
                  'text-sm',
                  walletData.performance.daily >= 0 ? 'text-green-300' : 'text-red-300'
                )}>
                  {walletData.performance.daily >= 0 ? '+' : ''}{walletData.performance.daily}%
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-4">
            <div className="h-8 bg-white/20 rounded animate-pulse mb-2"></div>
            <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          onClick={() => setShowSendModal(true)}
        >
          <ArrowUpRightIcon className="h-4 w-4 mr-2" />
          Send
        </Button>
        <Button
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
          onClick={() => setShowReceiveModal(true)}
        >
          <ArrowDownLeftIcon className="h-4 w-4 mr-2" />
          Receive
        </Button>
        <Button
          variant="ghost"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Buy
        </Button>
      </div>
    </Card>
  );

  const assetBgMap = { purple: 'bg-purple-500/20', blue: 'bg-blue-500/20', green: 'bg-green-500/20' };
  const assetTextMap = { purple: 'text-purple-400', blue: 'text-blue-400', green: 'text-green-400' };
  const assetBarMap = { purple: 'bg-purple-500', blue: 'bg-blue-500', green: 'bg-green-500' };

  // Portfolio Breakdown Component
  const PortfolioBreakdown = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ChartPieIcon className="h-5 w-5 mr-2" />
          Portfolio
        </h3>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="bg-dark-surface border border-dark-border rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">24h</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="1y">1y</option>
        </select>
      </div>

      <div className="space-y-4">
        {walletData.assets.map((asset) => {
          const Icon = asset.icon;
          
          return (
            <div key={asset.symbol} className="p-4 bg-dark-surface-elevated rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={clsx(
                    'h-10 w-10 rounded-lg flex items-center justify-center mr-3',
                    assetBgMap[asset.color]
                  )}>
                    <Icon className={clsx('h-5 w-5', assetTextMap[asset.color])} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{asset.name}</p>
                    <p className="text-dark-text-muted text-sm">{asset.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-medium">
                    {balanceVisible ? `${asset.balance.toFixed(4)} ${asset.symbol}` : '****'}
                  </p>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dark-text-muted">
                    {balanceVisible ? `${asset.balance.toLocaleString()} ${asset.symbol}` : '****'}
                  </span>
                  <span className="text-dark-text-muted">100.0%</span>
                </div>
                <div className="w-full bg-dark-border rounded-full h-2">
                  <div
                    className={clsx('h-2 rounded-full', assetBarMap[asset.color])}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-text-muted">{walletData.isTestnet ? 'Testnet Token' : 'Native Token'}</span>
                <Button variant="ghost" size="sm">
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  // Recent Transactions Component
  const RecentTransactions = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
        <Link to="/wallet/transactions">
          <Button variant="ghost" size="sm">
            View All
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => {
          const Icon = getTransactionIcon(tx.type);
          return (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-dark-surface-elevated rounded-lg hover:bg-dark-surface/70 transition-colors">
              <div className="flex items-center">
                <div className={clsx(
                  'h-10 w-10 rounded-lg flex items-center justify-center mr-3',
                  tx.amount > 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                )}>
                  <Icon className={clsx(
                    'h-5 w-5',
                    tx.amount > 0 ? 'text-green-400' : 'text-red-400'
                  )} />
                </div>
                
                <div>
                  <p className="text-white font-medium">{tx.counterparty}</p>
                  <div className="flex items-center">
                    <p className="text-dark-text-muted text-sm mr-2">{formatTimeAgo(tx.timestamp)}</p>
                    <Badge
                      variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}
                      size="sm"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className={clsx('font-medium', getTransactionColor(tx.type, tx.amount))}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.asset}
                </p>
                <p className="text-dark-text-muted text-sm">
                  {formatCurrency(Math.abs(tx.amountUSD))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  // Quick Actions Component
  const QuickActions = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
          onClick={() => setShowSendModal(true)}
        >
          <ArrowUpRightIcon className="h-6 w-6 mb-2" />
          <span>Send</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
          onClick={() => setShowReceiveModal(true)}
        >
          <ArrowDownLeftIcon className="h-6 w-6 mb-2" />
          <span>Receive</span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center p-4 h-auto"
        >
          <ArrowsRightLeftIcon className="h-6 w-6 mb-2" />
          <span>Swap</span>
        </Button>
        
        <Link to="/marketplace">
          <Button
            variant="outline"
            className="flex flex-col items-center p-4 h-auto w-full"
          >
            <ShoppingCartIcon className="h-6 w-6 mb-2" />
            <span>Buy Models</span>
          </Button>
        </Link>
      </div>
    </Card>
  );

  // Send Modal Component
  const SendModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) setShowSendModal(false); }}
    >
      <Card role="dialog" aria-modal="true" aria-label="Send tokens" className="w-full max-w-md p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Send Tokens</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setShowSendModal(false)}
            className="inline-flex h-11 w-11 items-center justify-center -mr-2 text-dark-text-muted hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSendSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text-secondary mb-2">Asset</label>
            <select
              value={sendFormData.asset}
              onChange={(e) => setSendFormData(prev => ({ ...prev, asset: e.target.value }))}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {walletData.assets.map((asset) => (
                <option key={asset.symbol} value={asset.symbol}>
                  {asset.symbol} - {asset.balance.toLocaleString()} available
                </option>
              ))}
            </select>
          </div>
          
          <Input
            label="Recipient Address"
            placeholder="0x..."
            value={sendFormData.address}
            onChange={(e) => setSendFormData(prev => ({ ...prev, address: e.target.value }))}
            required
          />
          
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={sendFormData.amount}
            onChange={(e) => setSendFormData(prev => ({ ...prev, amount: e.target.value }))}
            required
            step="0.01"
            min="0"
          />
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSendModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  // Receive Modal Component
  const ReceiveModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) setShowReceiveModal(false); }}
    >
      <Card role="dialog" aria-modal="true" aria-label="Receive tokens" className="w-full max-w-md p-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Receive Tokens</h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setShowReceiveModal(false)}
            className="inline-flex h-11 w-11 items-center justify-center -mr-2 text-dark-text-muted hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          >
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg mb-4 inline-block">
            {/* QR Code placeholder */}
            <div className="w-48 h-48 bg-dark-border flex items-center justify-center">
              <span className="text-dark-text-muted">QR Code</span>
            </div>
          </div>
          
          <p className="text-dark-text-muted text-sm mb-4">Scan QR code or copy address below</p>
          
          <div className="bg-dark-surface border border-dark-border rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-sm text-white break-all">{walletData.address}</code>
              <button
                onClick={() => copyToClipboard(walletData.address)}
                className="ml-2 text-blue-400 hover:text-blue-300"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-300">
                Only send MCT, MCG, or POL tokens to this address. Sending other tokens may result in permanent loss.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Wallet</h1>
          <p className="text-dark-text-muted">Manage your digital assets and transactions</p>
        </div>
        <Link to="/wallet/settings">
          <Button variant="ghost">
            <Cog6ToothIcon className="h-5 w-5 mr-2" />
            Settings
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Balance Card */}
          <BalanceCard />
          
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Portfolio Breakdown */}
          <PortfolioBreakdown />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>

      {/* Modals */}
      {showSendModal && <SendModal />}
      {showReceiveModal && <ReceiveModal />}
    </div>
  );
};

export default WalletDashboard;