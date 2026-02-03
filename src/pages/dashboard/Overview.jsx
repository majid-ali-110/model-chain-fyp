import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import { useWallet } from '../../contexts/WalletContext';
import {
  CurrencyDollarIcon,
  CubeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const Overview = () => {
  const { balance, chainId, isConnected } = useWallet();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);

  // Stats - in production these would come from blockchain/database
  const stats = [
    {
      title: 'Wallet Balance',
      value: isConnected ? `${parseFloat(balance || '0').toFixed(4)} ${currency}` : 'Not connected',
      change: '--',
      changeType: 'neutral',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Active Models',
      value: '0',
      change: '--',
      changeType: 'neutral',
      icon: CubeIcon
    },
    {
      title: 'Total Downloads',
      value: '0',
      change: '--',
      changeType: 'neutral',
      icon: ChartBarIcon
    },
    {
      title: 'Followers',
      value: '0',
      change: '--',
      changeType: 'neutral',
      icon: UserGroupIcon
    }
  ];

  // Recent models - would come from ModelRegistry contract
  const recentModels = [
    // Empty - will be populated from blockchain
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Dashboard Overview</h1>
        <p className="text-secondary-600">Welcome back! Here's what's happening with your models.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-secondary-600 ml-1">vs last month</span>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Models */}
        <Card>
          <Card.Header>
            <Card.Title>Recent Models</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentModels.length === 0 ? (
                <div className="text-center py-8 text-secondary-500">
                  <CubeIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No models yet</p>
                  <p className="text-sm">Upload your first model to get started</p>
                </div>
              ) : recentModels.map(model => (
                <div key={model.id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                  <div>
                    <p className="font-medium text-secondary-900">{model.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={model.status === 'active' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {model.status}
                      </Badge>
                      <span className="text-sm text-secondary-600">
                        {model.downloads} downloads
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{model.earnings}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View All Models</Button>
            </div>
          </Card.Content>
        </Card>

        {/* Performance */}
        <Card>
          <Card.Header>
            <Card.Title>Model Performance</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div className="text-center py-8 text-secondary-500">
                <ChartBarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No performance data</p>
                <p className="text-sm">Upload models to track their performance</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">View Analytics</Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Overview;