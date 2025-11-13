import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TrendingUpIcon,
  ArrowTopRightOnSquareIcon,
  PlayIcon,
  PlusIcon,
  StarIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  ChevronRightIcon,
  FireIcon,
  SparklesIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  BeakerIcon,
  HeartIcon,
  WalletIcon,
  ShieldCheckIcon,
  CloudArrowUpIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  // Mock user data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // User stats
      setUserStats({
        totalRequests: 12547,
        totalTokens: 8934521,
        totalSpent: 247.83,
        activeSubscriptions: 3,
        favoriteModels: 12,
        testsRun: 156,
        avgResponseTime: 1.2,
        successRate: 98.7,
        memberSince: '2024-03-15',
        currentPlan: 'Pro'
      });

      // Recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'test',
          action: 'Ran test with GPT-4 Turbo',
          model: 'GPT-4 Turbo',
          timestamp: '2024-10-03T10:30:00Z',
          status: 'completed',
          tokens: 156,
          cost: 0.47
        },
        {
          id: 2,
          type: 'subscription',
          action: 'Subscribed to Claude 3 Opus',
          model: 'Claude 3 Opus',
          timestamp: '2024-10-03T09:15:00Z',
          status: 'active',
          cost: 49.00
        },
        {
          id: 3,
          type: 'favorite',
          action: 'Added DALL-E 3 to favorites',
          model: 'DALL-E 3',
          timestamp: '2024-10-02T16:45:00Z',
          status: 'completed'
        },
        {
          id: 4,
          type: 'test',
          action: 'Generated image with Stable Diffusion',
          model: 'Stable Diffusion XL',
          timestamp: '2024-10-02T14:20:00Z',
          status: 'completed',
          tokens: null,
          cost: 0.02
        },
        {
          id: 5,
          type: 'purchase',
          action: 'Purchased API access for Whisper',
          model: 'Whisper Large V3',
          timestamp: '2024-10-01T11:30:00Z',
          status: 'completed',
          cost: 15.00
        }
      ]);

      // Active subscriptions
      setSubscriptions([
        {
          id: 1,
          modelId: 'gpt-4-turbo',
          modelName: 'GPT-4 Turbo',
          provider: 'OpenAI',
          plan: 'Pro Monthly',
          cost: 49.00,
          nextBilling: '2024-11-03',
          usage: { used: 8432, limit: 50000, unit: 'tokens' },
          status: 'active'
        },
        {
          id: 2,
          modelId: 'claude-3-opus',
          modelName: 'Claude 3 Opus',
          provider: 'Anthropic',
          plan: 'Enterprise',
          cost: 99.00,
          nextBilling: '2024-11-15',
          usage: { used: 15678, limit: 100000, unit: 'tokens' },
          status: 'active'
        },
        {
          id: 3,
          modelId: 'dall-e-3',
          modelName: 'DALL-E 3',
          provider: 'OpenAI',
          plan: 'Pay Per Use',
          cost: 23.40,
          nextBilling: null,
          usage: { used: 47, limit: null, unit: 'images' },
          status: 'active'
        }
      ]);

      // Personalized recommendations
      setRecommendations([
        {
          id: 'llama-2-70b',
          name: 'LLaMA 2 70B',
          provider: 'Meta',
          category: 'text',
          description: 'Open-source alternative to GPT models',
          pricing: { type: 'free', price: 0 },
          rating: 4.6,
          downloads: 234000,
          reason: 'Free alternative to your current subscriptions',
          tags: ['free', 'open-source', 'text-generation']
        },
        {
          id: 'mistral-7b',
          name: 'Mistral 7B',
          provider: 'Mistral AI',
          category: 'text',
          description: 'Efficient language model for coding tasks',
          pricing: { type: 'token', price: 0.002 },
          rating: 4.7,
          downloads: 145000,
          reason: 'Perfect for code generation based on your usage',
          tags: ['coding', 'efficient', 'multilingual']
        },
        {
          id: 'flux-dev',
          name: 'FLUX.1 Dev',
          provider: 'Black Forest Labs',
          category: 'image',
          description: 'State-of-the-art image generation model',
          pricing: { type: 'image', price: 0.05 },
          rating: 4.8,
          downloads: 89000,
          reason: 'Trending image model with better quality',
          tags: ['image-generation', 'high-quality', 'trending']
        }
      ]);

      // Usage data for chart
      setUsageData([
        { date: '2024-09-27', requests: 45, tokens: 12400, cost: 3.72 },
        { date: '2024-09-28', requests: 52, tokens: 14800, cost: 4.44 },
        { date: '2024-09-29', requests: 38, tokens: 10200, cost: 3.06 },
        { date: '2024-09-30', requests: 67, tokens: 18900, cost: 5.67 },
        { date: '2024-10-01', requests: 74, tokens: 21300, cost: 6.39 },
        { date: '2024-10-02', requests: 61, tokens: 16700, cost: 5.01 },
        { date: '2024-10-03', requests: 43, tokens: 11800, cost: 3.54 }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

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

  // Get model category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'text': return DocumentTextIcon;
      case 'image': return PhotoIcon;
      case 'audio': return SpeakerWaveIcon;
      case 'video': return VideoCameraIcon;
      default: return CpuChipIcon;
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
    <div className="min-h-screen bg-dark-surface-primary">
      {/* Header */}
      <div className="bg-dark-surface-secondary border-b border-dark-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  <Badge variant="success" size="sm" className="ml-2">
                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-primary-400" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Tokens Used</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    {(userStats.totalTokens / 1000000).toFixed(1)}M
                  </p>
                  <Badge variant="success" size="sm" className="ml-2">
                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                    +8%
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-secondary-500/10 rounded-lg">
                <BoltSolidIcon className="h-6 w-6 text-secondary-400" />
              </div>
            </div>
          </Card>

          <Card variant="elevated" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-dark-text-muted">Total Spent</p>
                <div className="flex items-baseline mt-2">
                  <p className="text-2xl font-bold text-dark-text-primary">
                    ${userStats.totalSpent.toFixed(2)}
                  </p>
                  <Badge variant="warning" size="sm" className="ml-2">
                    <TrendingUpIcon className="h-3 w-3 mr-1" />
                    +15%
                  </Badge>
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
                            ? 'bg-primary-500 text-white'
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
                    xKey="date"
                    yKeys={[
                      { key: 'requests', name: 'Requests', color: '#10B981' },
                      { key: 'cost', name: 'Cost ($)', color: '#F59E0B' }
                    ]}
                    height={256}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-surface-elevated">
                  <div className="text-center">
                    <p className="text-sm text-dark-text-muted">Avg Daily Requests</p>
                    <p className="text-xl font-bold text-dark-text-primary mt-1">
                      {Math.round(usageData.reduce((sum, day) => sum + day.requests, 0) / usageData.length)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-dark-text-muted">Avg Response Time</p>
                    <p className="text-xl font-bold text-dark-text-primary mt-1">
                      {userStats.avgResponseTime}s
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-dark-text-muted">Total Models</p>
                    <p className="text-xl font-bold text-dark-text-primary mt-1">
                      {userStats.favoriteModels}
                    </p>
                  </div>
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
                  <Button variant="outline" size="sm" onClick={() => navigate('/subscriptions')}>
                    Manage All
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {subscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="flex items-center justify-between p-4 bg-dark-surface-primary rounded-lg border border-dark-surface-elevated"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-500/10 rounded-lg">
                          <CpuChipIcon className="h-5 w-5 text-primary-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-dark-text-primary">
                            {subscription.modelName}
                          </h4>
                          <p className="text-sm text-dark-text-muted">
                            {subscription.provider} • {subscription.plan}
                          </p>
                          {subscription.usage.limit && (
                            <div className="flex items-center mt-1">
                              <div className="w-24 bg-dark-surface-elevated rounded-full h-1.5 mr-2">
                                <div
                                  className="bg-primary-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.min((subscription.usage.used / subscription.usage.limit) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs text-dark-text-muted">
                                {subscription.usage.used.toLocaleString()} / {subscription.usage.limit.toLocaleString()} {subscription.usage.unit}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-dark-text-primary">
                          ${subscription.cost}/mo
                        </p>
                        {subscription.nextBilling && (
                          <p className="text-sm text-dark-text-muted">
                            Next: {new Date(subscription.nextBilling).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-dark-text-primary">Monthly Total</h4>
                      <p className="text-sm text-dark-text-muted">All active subscriptions</p>
                    </div>
                    <p className="text-2xl font-bold text-primary-400">
                      ${subscriptions.reduce((sum, sub) => sum + sub.cost, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Personalized Recommendations */}
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Recommended for You
                  </h3>
                  <Button variant="outline" size="sm" onClick={() => navigate('/marketplace/models')}>
                    Browse All
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((model) => {
                    const IconComponent = getCategoryIcon(model.category);
                    return (
                      <div
                        key={model.id}
                        className="p-4 bg-dark-surface-primary rounded-lg border border-dark-surface-elevated hover:border-primary-500/30 transition-all cursor-pointer group"
                        onClick={() => navigate(`/marketplace/model/${model.id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-primary-500/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary-400" />
                          </div>
                          <Badge variant="accent" size="sm">
                            <LightBulbIcon className="h-3 w-3 mr-1" />
                            Recommended
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-dark-text-primary mb-1 group-hover:text-primary-400 transition-colors">
                          {model.name}
                        </h4>
                        <p className="text-sm text-dark-text-secondary mb-2">
                          {model.description}
                        </p>
                        <p className="text-xs text-primary-400 mb-3 font-medium">
                          {model.reason}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex items-center mr-3">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={clsx(
                                    'h-3 w-3',
                                    i < Math.floor(model.rating)
                                      ? 'text-yellow-400'
                                      : 'text-dark-surface-elevated'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-dark-text-muted">
                              {model.downloads.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-dark-text-primary">
                            {model.pricing.type === 'free' 
                              ? 'Free' 
                              : `$${model.pricing.price}`
                            }
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-3">
                          {model.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
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
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={clsx(
                          'p-2 rounded-lg mt-0.5',
                          activity.type === 'test' && 'bg-blue-500/10',
                          activity.type === 'subscription' && 'bg-green-500/10',
                          activity.type === 'favorite' && 'bg-red-500/10',
                          activity.type === 'purchase' && 'bg-purple-500/10'
                        )}>
                          <IconComponent className={clsx(
                            'h-4 w-4',
                            activity.type === 'test' && 'text-blue-400',
                            activity.type === 'subscription' && 'text-green-400',
                            activity.type === 'favorite' && 'text-red-400',
                            activity.type === 'purchase' && 'text-purple-400'
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-dark-text-primary">
                            {activity.action}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-dark-text-muted">
                              {formatRelativeTime(activity.timestamp)}
                            </p>
                            {activity.cost && (
                              <Badge
                                variant={activity.cost > 10 ? 'warning' : 'secondary'}
                                size="sm"
                              >
                                ${activity.cost.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => navigate('/activity')}
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
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-secondary">Tests Run</span>
                    <span className="text-sm text-dark-text-primary">
                      {userStats.testsRun}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-dark-text-primary">Upgrade Available</h4>
                      <p className="text-xs text-dark-text-muted">Get unlimited access</p>
                    </div>
                    <Button size="sm" onClick={() => navigate('/pricing')}>
                      <RocketLaunchIcon className="h-4 w-4 mr-1" />
                      Upgrade
                    </Button>
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