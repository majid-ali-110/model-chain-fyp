import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useWallet } from '../../contexts/WalletContext';
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Overview = () => {
  const [_timeframe, _setTimeframe] = useState('7d');
  const { balance, chainId } = useWallet();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);
  const isTestnet = ['80002', '80001', '11155111', '31337'].includes(chainId);

  const walletStats = {
    balance: `${parseFloat(balance || '0').toFixed(4)} ${currency}`,
    network: isTestnet ? 'Testnet' : 'Mainnet',
    pendingEarnings: `0 ${currency}`,
    totalEarnings: `0 ${currency}`
  };

  // Real transactions would come from blockchain events
  const recentTransactions = [
    // Placeholder - in production, fetch from blockchain events
  ];

  // Portfolio breakdown - in production, calculate from actual transaction history
  const portfolioBreakdown = [
    { category: 'Model Sales', amount: `0 ${currency}`, percentage: 0 },
    { category: 'Validation Rewards', amount: `0 ${currency}`, percentage: 0 },
    { category: 'Staking Rewards', amount: `0 ${currency}`, percentage: 0 }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earn':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />;
      case 'withdraw':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <CurrencyDollarIcon className="h-4 w-4 text-secondary-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive" size="sm">Failed</Badge>;
      default:
        return <Badge variant="secondary" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <WalletIcon className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Wallet Overview</h1>
          <p className="text-secondary-600">Manage your earnings and transactions</p>
        </div>
      </div>

      {/* Wallet Balance */}
      <Card>
        <Card.Header>
          <Card.Title>Wallet Balance</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary-900">{walletStats.balance}</p>
              <p className="text-lg text-secondary-600">{walletStats.network}</p>
              <p className="text-sm text-secondary-500">Current Balance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{walletStats.pendingEarnings}</p>
              <p className="text-sm text-secondary-500">Pending Earnings</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{walletStats.totalEarnings}</p>
              <p className="text-sm text-secondary-500">Total Earnings</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full">
                <ArrowUpIcon className="h-4 w-4" />
                Withdraw
              </Button>
              <Button variant="outline" className="w-full">
                <ArrowDownIcon className="h-4 w-4" />
                Deposit
              </Button>
            </div>
          </div>
        </Card.Content>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Recent Transactions</Card.Title>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex items-center gap-4 py-3 border-b border-secondary-100 last:border-0">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-secondary-600">
                      {transaction.user} • {transaction.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'earn' ? 'text-green-600' : 
                      transaction.type === 'withdraw' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {transaction.amount}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Portfolio Breakdown */}
        <Card>
          <Card.Header>
            <Card.Title>Earnings Breakdown</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {portfolioBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-secondary-900">{item.category}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-secondary-900">{item.amount}</span>
                      <span className="text-xs text-secondary-600 ml-2">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <ChartBarIcon className="h-5 w-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <CurrencyDollarIcon className="h-5 w-5" />
              <span className="text-sm">Set Up Auto-Withdraw</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <WalletIcon className="h-5 w-5" />
              <span className="text-sm">Connect Wallet</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <ClockIcon className="h-5 w-5" />
              <span className="text-sm">Transaction History</span>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Overview;