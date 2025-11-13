import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
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
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { dummyModels } from '../../data/dummyModels';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myModels, setMyModels] = useState([]);
  const [favoriteModels, setFavoriteModels] = useState([]);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // User statistics
      setUserStats({
        totalModels: 8,
        totalDownloads: 12547,
        totalRevenue: 247.83,
        totalSpent: 89.45,
        activeTests: 156,
        avgRating: 4.7,
        memberSince: 'March 2024',
        planType: 'Pro'
      });

      // Wallet balance
      setWalletBalance({
        eth: 12.5,
        usd: 23450.75,
        pending: 2.3,
        available: 10.2
      });

      // My uploaded models
      setMyModels([
        {
          id: 'my-model-1',
          name: 'My Custom LLM',
          category: 'Language',
          price: 2.5,
          currency: 'ETH',
          downloads: 1523,
          revenue: 156.8,
          rating: 4.8,
          status: 'active',
          thumbnail: 'https://picsum.photos/seed/my-model-1/400/300'
        },
        {
          id: 'my-model-2',
          name: 'Vision Classifier Pro',
          category: 'Computer Vision',
          price: 1.8,
          currency: 'ETH',
          downloads: 892,
          revenue: 89.4,
          rating: 4.6,
          status: 'active',
          thumbnail: 'https://picsum.photos/seed/my-model-2/400/300'
        },
        {
          id: 'my-model-3',
          name: 'Audio Analyzer',
          category: 'Audio',
          price: 0,
          currency: 'ETH',
          downloads: 3421,
          revenue: 0,
          rating: 4.5,
          status: 'active',
          thumbnail: 'https://picsum.photos/seed/my-model-3/400/300'
        }
      ]);

      // Favorite models from dummyModels
      setFavoriteModels(dummyModels.slice(0, 4));

      // Recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'test',
          title: 'Tested GPT-4 Vision Pro',
          time: '5 minutes ago',
          status: 'success'
        },
        {
          id: 2,
          type: 'download',
          title: 'Model downloaded by user_0x123',
          time: '2 hours ago',
          status: 'success',
          earnings: '+1.8 ETH'
        },
        {
          id: 3,
          type: 'upload',
          title: 'Uploaded new model version',
          time: '1 day ago',
          status: 'success'
        },
        {
          id: 4,
          type: 'purchase',
          title: 'Purchased Audio Synthesizer X',
          time: '2 days ago',
          status: 'success',
          cost: '-0.8 ETH'
        },
        {
          id: 5,
          type: 'revenue',
          title: 'Revenue milestone reached',
          time: '3 days ago',
          status: 'success',
          earnings: '+50 ETH'
        }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'test': return BeakerIcon;
      case 'download': return ArrowDownTrayIcon;
      case 'upload': return CloudArrowUpIcon;
      case 'purchase': return ShoppingCartIcon;
      case 'revenue': return CurrencyDollarIcon;
      default: return CheckCircleIcon;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0c10' }}>
        <Loading variant="spinner" size="lg" />
        <span className="ml-3" style={{ color: '#8b949e' }}>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0c10' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #21262d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#f0f6fc' }}>
                Dashboard 👋
              </h1>
              <p style={{ color: '#8b949e', marginTop: '0.25rem' }}>
                Welcome back! Here's your ModelChain overview
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link to="/developer/upload">
                <Button style={{ backgroundColor: '#238636', color: '#ffffff' }}>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Upload Model
                </Button>
              </Link>
              <Link to="/sandbox">
                <Button variant="outline">
                  <BeakerIcon className="h-5 w-5 mr-2" />
                  Test Models
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Models */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Models</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalModels}
                  </p>
                  <p style={{ color: '#58a6ff', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                    Active & Published
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#1f6feb20', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <CpuChipIcon className="h-8 w-8" style={{ color: '#58a6ff' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Total Downloads */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Downloads</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalDownloads.toLocaleString()}
                  </p>
                  <p style={{ color: '#3fb950', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                    +18% this month
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#23863620', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <ArrowDownTrayIcon className="h-8 w-8" style={{ color: '#3fb950' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Total Revenue */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Revenue</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalRevenue} ETH
                  </p>
                  <p style={{ color: '#f7df1e', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                    +12% this week
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#f7df1e20', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <CurrencyDollarIcon className="h-8 w-8" style={{ color: '#f7df1e' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Average Rating */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Avg Rating</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.avgRating}
                  </p>
                  <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className="h-4 w-4"
                        style={{ color: star <= Math.floor(userStats.avgRating) ? '#f7df1e' : '#30363d' }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f7df1e20', 
                  padding: '0.75rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <TrophyIcon className="h-8 w-8" style={{ color: '#f7df1e' }} />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Balance */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title style={{ color: '#f0f6fc' }}>
                    <WalletIcon className="h-5 w-5 inline mr-2" />
                    Wallet Balance
                  </Card.Title>
                  <Link to="/wallet">
                    <Button size="sm" variant="outline">
                      Manage
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Balance</p>
                    <p className="text-2xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                      {walletBalance.eth} ETH
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      ≈ ${walletBalance.usd.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Available</p>
                    <p className="text-2xl font-bold mt-2" style={{ color: '#3fb950' }}>
                      {walletBalance.available} ETH
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Ready to withdraw
                    </p>
                  </div>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Pending</p>
                    <p className="text-2xl font-bold mt-2" style={{ color: '#f7df1e' }}>
                      {walletBalance.pending} ETH
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      Processing
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* My Models */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title style={{ color: '#f0f6fc' }}>
                    <RocketLaunchIcon className="h-5 w-5 inline mr-2" />
                    My Models
                  </Card.Title>
                  <Link to="/developer/my-models">
                    <Button size="sm" variant="outline">
                      View All
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {myModels.map((model) => (
                    <div
                      key={model.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#161b22',
                        borderRadius: '0.75rem',
                        border: '1px solid #21262d'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-16 h-16 rounded-lg object-cover"
                          style={{ border: '1px solid #21262d' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold" style={{ color: '#f0f6fc' }}>
                              {model.name}
                            </h4>
                            <Badge variant="success" size="sm">
                              {model.status}
                            </Badge>
                          </div>
                          <p style={{ color: '#8b949e', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {model.category}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>
                              <ArrowDownTrayIcon className="h-4 w-4 inline mr-1" />
                              {model.downloads.toLocaleString()}
                            </span>
                            <span style={{ color: '#3fb950', fontSize: '0.875rem', fontWeight: '600' }}>
                              <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                              {model.revenue} ETH earned
                            </span>
                            <span style={{ color: '#f7df1e', fontSize: '0.875rem' }}>
                              <StarSolidIcon className="h-4 w-4 inline mr-1" />
                              {model.rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/sandbox?model=${model.id}`)}>
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Test
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/marketplace/models/${model.id}`)}>
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Favorite Models */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title style={{ color: '#f0f6fc' }}>
                    <HeartIcon className="h-5 w-5 inline mr-2" />
                    Favorite Models
                  </Card.Title>
                  <Link to="/marketplace/models">
                    <Button size="sm" variant="outline">
                      Browse More
                      <ChevronRightIcon className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteModels.map((model) => (
                    <div
                      key={model.id}
                      style={{
                        padding: '1rem',
                        backgroundColor: '#161b22',
                        borderRadius: '0.75rem',
                        border: '1px solid #21262d',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/marketplace/models/${model.id}`)}
                      className="hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          style={{ border: '1px solid #21262d' }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm" style={{ color: '#f0f6fc' }}>
                            {model.name}
                          </h4>
                          <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            {model.category}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span style={{ color: '#58a6ff', fontSize: '0.875rem', fontWeight: '600' }}>
                              {model.price === 0 ? 'Free' : `${model.price} ${model.currency}`}
                            </span>
                            <span style={{ color: '#f7df1e', fontSize: '0.75rem' }}>
                              <StarSolidIcon className="h-3 w-3 inline mr-1" />
                              {model.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <Card.Title style={{ color: '#f0f6fc' }}>
                  <BoltIcon className="h-5 w-5 inline mr-2" />
                  Quick Actions
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate('/developer/upload')}
                  >
                    <CloudArrowUpIcon className="h-5 w-5 mr-3" />
                    Upload New Model
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate('/sandbox')}
                  >
                    <BeakerIcon className="h-5 w-5 mr-3" />
                    Test Models
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate('/marketplace/models')}
                  >
                    <ShoppingCartIcon className="h-5 w-5 mr-3" />
                    Browse Marketplace
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate('/developer/analytics')}
                  >
                    <DocumentChartBarIcon className="h-5 w-5 mr-3" />
                    View Analytics
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => navigate('/profile/settings')}
                  >
                    <Cog6ToothIcon className="h-5 w-5 mr-3" />
                    Settings
                  </Button>
                </div>
              </Card.Content>
            </Card>

            {/* Account Info */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <Card.Title style={{ color: '#f0f6fc' }}>
                  <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
                  Account Info
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>Plan Type</span>
                    <Badge variant="success">
                      <TrophyIcon className="h-3 w-3 mr-1" />
                      {userStats.planType}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>Member Since</span>
                    <span style={{ color: '#f0f6fc', fontSize: '0.875rem' }}>
                      {userStats.memberSince}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Spent</span>
                    <span style={{ color: '#f0f6fc', fontSize: '0.875rem', fontWeight: '600' }}>
                      {userStats.totalSpent} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: '#8b949e', fontSize: '0.875rem' }}>Tests Run</span>
                    <span style={{ color: '#f0f6fc', fontSize: '0.875rem', fontWeight: '600' }}>
                      {userStats.activeTests}
                    </span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Cog6ToothIcon className="h-4 w-4 mr-2" />
                  Manage Account
                </Button>
              </Card.Content>
            </Card>

            {/* Recent Activity */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <Card.Title style={{ color: '#f0f6fc' }}>
                  <ClockIcon className="h-5 w-5 inline mr-2" />
                  Recent Activity
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {recentActivity.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div
                        key={activity.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#161b22',
                          borderRadius: '0.5rem',
                          border: '1px solid #21262d'
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: '#0d1117',
                            borderRadius: '0.5rem',
                            border: '1px solid #21262d'
                          }}>
                            <Icon className="h-4 w-4" style={{ color: '#58a6ff' }} />
                          </div>
                          <div className="flex-1">
                            <p style={{ color: '#f0f6fc', fontSize: '0.875rem' }}>
                              {activity.title}
                            </p>
                            <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                              {activity.time}
                            </p>
                            {activity.earnings && (
                              <p style={{ color: '#3fb950', fontSize: '0.875rem', fontWeight: '600', marginTop: '0.25rem' }}>
                                {activity.earnings}
                              </p>
                            )}
                            {activity.cost && (
                              <p style={{ color: '#f85149', fontSize: '0.875rem', fontWeight: '600', marginTop: '0.25rem' }}>
                                {activity.cost}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm">
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </Card.Content>
            </Card>

            {/* Trending Models */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <Card.Title style={{ color: '#f0f6fc' }}>
                  <FireIcon className="h-5 w-5 inline mr-2" />
                  Trending Now
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {dummyModels.filter(m => m.featured).slice(0, 3).map((model) => (
                    <div
                      key={model.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#161b22',
                        borderRadius: '0.5rem',
                        border: '1px solid #21262d',
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/marketplace/models/${model.id}`)}
                      className="hover:border-primary-500 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-10 h-10 rounded object-cover"
                          style={{ border: '1px solid #21262d' }}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm" style={{ color: '#f0f6fc' }}>
                            {model.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-1">
                            <span style={{ color: '#f7df1e', fontSize: '0.75rem' }}>
                              <StarSolidIcon className="h-3 w-3 inline mr-1" />
                              {model.rating}
                            </span>
                            <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                              {model.downloads.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
