import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  StarIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ChevronRightIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  BeakerIcon,
  HeartIcon,
  WalletIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';

import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import LineChart from '../../components/charts/LineChart';
import { useWallet } from '../../contexts/WalletContext';
import { useUser } from '../../contexts/UserContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { chainId } = useWallet();
  const { profile, purchases, userModels, earnings, rewards, activity, loading: userLoading } = useUser();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001', '31337'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Load dashboard data from contexts
  useEffect(() => {
    setIsLoading(userLoading);
  }, [userLoading]);

  // Compute stats from real data
  const userStats = {
    totalRequests: purchases.length,
    totalTokens: 0, // TODO: Calculate from blockchain
    totalSpent: earnings.total,
    activeSubscriptions: purchases.length,
    favoriteModels: 0, // TODO: Implement favorites
    testsRun: 0, // TODO: Track test runs
    avgResponseTime: 0,
    successRate: 100,
    memberSince: profile?.joinedAt || new Date().toISOString(),
    currentPlan: profile?.role === 'developer' ? 'Developer' : profile?.role === 'validator' ? 'Validator' : 'User'
  };

  // Usage data for chart - empty for now, will be populated from blockchain
  const usageData = [
    { date: 'Mon', day: 0, requests: 0, cost: 0 },
    { date: 'Tue', day: 1, requests: 0, cost: 0 },
    { date: 'Wed', day: 2, requests: 0, cost: 0 },
    { date: 'Thu', day: 3, requests: 0, cost: 0 },
    { date: 'Fri', day: 4, requests: 0, cost: 0 },
    { date: 'Sat', day: 5, requests: 0, cost: 0 },
    { date: 'Sun', day: 6, requests: 0, cost: 0 }
  ];

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'test': return BeakerIcon;
      case 'subscription': return CreditCardIcon;
      case 'favorite': return HeartIcon;
      case 'purchase': return ShoppingCartIcon;
      default: return InformationCircleIcon;
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
        <span className="ml-3 text-dark-text-secondary">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-surface-primary page-content">
      {/* Header */}
      <div className="bg-dark-surface-secondary border-b border-dark-surface-elevated">
        <div className="page-shell py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-text-primary">
                Welcome back! 👋
              </h1>
              <p className="text-dark-text-secondary mt-1">
                Here's what's happening with your AI models today
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="success" size="lg">
                <TrophyIcon className="h-4 w-4 mr-1" />
                {userStats.currentPlan} Plan
              </Badge>
              <Button onClick={() => navigate('/sandbox')}>
                <BeakerIcon className="h-4 w-4 mr-2" />
                Test Models
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-shell py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Total Requests</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {userStats.totalRequests.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-primary-500/100/10 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-primary-400" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Purchased Models</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {purchases.length}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <CpuChipIcon className="h-6 w-6 text-primary-400" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Total Spent</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {earnings.total.toFixed(4)} {currency}
                  </p>
                </div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Success Rate</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {userStats.successRate}%
                  </p>
                  <Badge variant="success" size="sm" className="ml-2">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    Excellent
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <TrophyIcon className="h-6 w-6 text-accent-400" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Usage Chart */}
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary">
                    Usage Analytics
                  </h3>
                  <div className="flex bg-dark-surface-elevated rounded-lg p-1">
                    {['7d', '30d', '90d'].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={clsx(
                          'px-3 py-1 rounded-md text-sm transition-all',
                          selectedTimeframe === timeframe
                            ? 'bg-primary-500/100 text-white'
                            : 'text-dark-text-muted hover:text-dark-text-primary'
                        )}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-64">
                  <LineChart
                    data={usageData}
                    xKey="day"
                    lines={[
                      { key: 'requests', label: 'Requests', color: '#10B981' },
                      { key: 'cost', label: 'Cost ($)', color: '#F59E0B' }
                    ]}
                    height={256}
                  />
                </div>


              </div>
            </Card>

            {/* Active Subscriptions */}
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary flex items-center">
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Active Subscriptions
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/marketplace/models')}>
                    Browse More
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {purchases.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCartIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
                      <p className="text-dark-text-muted">No purchases yet</p>
                      <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate('/marketplace')}>
                        Browse Marketplace
                      </Button>
                    </div>
                  ) : (
                    purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between p-4 bg-dark-surface-primary rounded-lg border border-dark-surface-elevated"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-primary-500/100/10 rounded-lg">
                            <CpuChipIcon className="h-5 w-5 text-primary-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-dark-text-primary">
                              {purchase.modelName}
                            </h4>
                            <p className="text-sm text-dark-text-muted">
                              {new Date(purchase.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-dark-text-primary">
                            {purchase.price} {purchase.currency}
                          </p>
                          <Badge variant={purchase.status === 'completed' ? 'success' : 'warning'} size="sm">
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {purchases.length > 0 && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-dark-text-primary">Total Spent</h4>
                        <p className="text-sm text-dark-text-muted">All purchases</p>
                      </div>
                      <p className="text-2xl font-bold text-primary-400">
                        {earnings.total} {currency}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>


          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/sandbox')}
                  >
                    <BeakerIcon className="h-4 w-4 mr-3" />
                    Test a Model
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/marketplace/models')}
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-3" />
                    Browse Marketplace
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/wallet')}
                  >
                    <WalletIcon className="h-4 w-4 mr-3" />
                    Manage Wallet
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/settings')}
                  >
                    <AdjustmentsHorizontalIcon className="h-4 w-4 mr-3" />
                    Account Settings
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-dark-text-primary">
                    Recent Activity
                  </h3>
                  <Button variant="ghost" size="sm">
                    <ArrowPathIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {activity.length === 0 ? (
                    <div className="text-center py-8">
                      <ClockIcon className="h-10 w-10 text-dark-text-muted mx-auto mb-3" />
                      <p className="text-sm text-dark-text-muted">No recent activity</p>
                    </div>
                  ) : (
                    activity.slice(0, 5).map((activityItem) => {
                      const IconComponent = getActivityIcon(activityItem.type);
                      return (
                        <div key={activityItem.id} className="flex items-start space-x-3">
                          <div className={clsx(
                            'p-2 rounded-lg mt-0.5',
                            activityItem.type === 'test' && 'bg-blue-500/10',
                            activityItem.type === 'subscription' && 'bg-green-500/10',
                            activityItem.type === 'favorite' && 'bg-red-500/10',
                            activityItem.type === 'purchase' && 'bg-purple-500/10'
                          )}>
                            <IconComponent className={clsx(
                              'h-4 w-4',
                              activityItem.type === 'test' && 'text-blue-400',
                              activityItem.type === 'subscription' && 'text-green-400',
                              activityItem.type === 'favorite' && 'text-red-400',
                              activityItem.type === 'purchase' && 'text-purple-400'
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-dark-text-primary">
                              {activityItem.title}
                            </p>
                            <p className="text-xs text-dark-text-muted mt-0.5">
                              {activityItem.description}
                            </p>
                            <p className="text-xs text-dark-text-muted mt-1">
                              {formatRelativeTime(activityItem.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/notifications')}
                >
                  View All Activity
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Account Status */}
            <Card variant="elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                  Account Status
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-secondary">Plan</span>
                    <Badge variant="success">{userStats.currentPlan}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-secondary">Member Since</span>
                    <span className="text-sm text-dark-text-primary">
                      {new Date(userStats.memberSince).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-secondary">Verification</span>
                    <Badge variant="success" size="sm">
                      <ShieldCheckIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  
                </div>


              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;