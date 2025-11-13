import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  BoltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
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
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  BellAlertIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { dummyModels } from '../../data/dummyModels';

const DashboardIdeal = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [myModels, setMyModels] = useState([]);
  const [favoriteModels, setFavoriteModels] = useState([]);
  const [walletBalance, setWalletBalance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // User statistics
    setUserStats({
      totalModels: 8,
      totalDownloads: 12547,
      totalRevenue: 247.83,
      totalSpent: 89.45,
      activeTests: 156,
      avgRating: 4.7,
      memberSince: 'March 2024',
      planType: 'Pro',
      revenueChange: '+12.5%',
      downloadsChange: '+18.3%',
      ratingsCount: 342,
      responseRate: '94%'
    });

    // Wallet balance
    setWalletBalance({
      eth: 12.5,
      usd: 23450.75,
      pending: 2.3,
      available: 10.2,
      locked: 0.0,
      transactions: [
        { id: 1, type: 'deposit', amount: 5.0, date: '2024-11-01', status: 'completed' },
        { id: 2, type: 'withdrawal', amount: -2.5, date: '2024-10-28', status: 'completed' },
        { id: 3, type: 'earning', amount: 0.85, date: '2024-10-25', status: 'completed' }
      ]
    });

    // My uploaded models with detailed stats
    setMyModels([
      {
        id: 'my-model-1',
        name: 'Custom GPT-4 Clone',
        category: 'Language',
        price: 2.5,
        currency: 'ETH',
        downloads: 1523,
        revenue: 156.8,
        rating: 4.8,
        ratingsCount: 89,
        status: 'active',
        verified: true,
        thumbnail: 'https://picsum.photos/seed/my-model-1/400/300',
        downloadsChange: '+15%',
        revenueChange: '+22%',
        lastUpdate: '2024-11-01'
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
        ratingsCount: 67,
        status: 'active',
        verified: true,
        thumbnail: 'https://picsum.photos/seed/my-model-2/400/300',
        downloadsChange: '+8%',
        revenueChange: '+12%',
        lastUpdate: '2024-10-28'
      },
      {
        id: 'my-model-3',
        name: 'Audio Transcription AI',
        category: 'Audio',
        price: 0.5,
        currency: 'ETH',
        downloads: 2341,
        revenue: 67.2,
        rating: 4.9,
        ratingsCount: 156,
        status: 'active',
        verified: false,
        thumbnail: 'https://picsum.photos/seed/my-model-3/400/300',
        downloadsChange: '+45%',
        revenueChange: '+38%',
        lastUpdate: '2024-11-02'
      }
    ]);

    // Favorite models
    setFavoriteModels(dummyModels.slice(0, 4).map(model => ({
      ...model,
      addedDate: '2024-10-15'
    })));

    // Recent activity with more details
    setRecentActivity([
      {
        id: 1,
        type: 'download',
        title: 'Model "Custom GPT-4 Clone" was downloaded',
        time: '5 minutes ago',
        earnings: '+2.5 ETH',
        user: '@developer_123'
      },
      {
        id: 2,
        type: 'rating',
        title: 'New 5-star rating received',
        time: '1 hour ago',
        modelName: 'Vision Classifier Pro'
      },
      {
        id: 3,
        type: 'withdrawal',
        title: 'Withdrawal processed successfully',
        time: '3 hours ago',
        amount: '-5.0 ETH',
        status: 'completed'
      },
      {
        id: 4,
        type: 'test',
        title: 'Sandbox test completed',
        time: '5 hours ago',
        cost: '-0.05 ETH',
        modelName: 'Audio Transcription AI'
      },
      {
        id: 5,
        type: 'upload',
        title: 'New model uploaded for review',
        time: '1 day ago',
        modelName: 'Sentiment Analyzer v2'
      }
    ]);

    // Notifications
    setNotifications([
      {
        id: 1,
        type: 'success',
        title: 'Model Verified!',
        message: 'Your model "Audio Transcription AI" has been verified.',
        time: '10 minutes ago',
        read: false
      },
      {
        id: 2,
        type: 'warning',
        title: 'Low Balance Alert',
        message: 'Your wallet balance is running low. Consider adding funds.',
        time: '2 hours ago',
        read: false
      },
      {
        id: 3,
        type: 'info',
        title: 'New Feature Available',
        message: 'Check out our new model analytics dashboard!',
        time: '1 day ago',
        read: true
      }
    ]);

    setIsLoading(false);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'download': return ArrowDownTrayIcon;
      case 'rating': return StarIcon;
      case 'withdrawal': return WalletIcon;
      case 'test': return BeakerIcon;
      case 'upload': return CloudArrowUpIcon;
      default: return CheckCircleIcon;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return CheckCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'info': return InformationCircleIcon;
      default: return BellAlertIcon;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg-primary">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0c10' }}>
      {/* Header Section */}
      <div style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #21262d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link to="/" style={{ color: '#8b949e' }} className="hover:text-primary-400 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4" style={{ color: '#8b949e' }} />
            <span style={{ color: '#f0f6fc' }} className="font-medium">Dashboard</span>
          </div>

          {/* Welcome Header - Clean, no duplicate buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#f0f6fc' }}>
                Welcome back, Demo User! 👋
              </h1>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#8b949e' }}>
                <span className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  {formatDate(currentTime)}
                </span>
                <span className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">{userStats.planType} Plan</Badge>
                  <span>•</span>
                  <span>Member since {userStats.memberSince}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications Banner */}
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.filter(n => !n.read).map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const bgColor = notification.type === 'success' ? '#23863620' : 
                             notification.type === 'warning' ? '#f7df1e20' : '#1f6feb20';
              const iconColor = notification.type === 'success' ? '#3fb950' : 
                               notification.type === 'warning' ? '#f7df1e' : '#58a6ff';
              
              return (
                <div
                  key={notification.id}
                  style={{
                    backgroundColor: bgColor,
                    border: `1px solid ${iconColor}40`,
                    borderRadius: '0.75rem',
                    padding: '1rem'
                  }}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5" style={{ color: iconColor }} />
                    <div>
                      <h4 className="font-semibold text-dark-text-primary">{notification.title}</h4>
                      <p className="text-sm text-dark-text-muted mt-1">{notification.message}</p>
                      <p className="text-xs text-dark-text-muted mt-2">{notification.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    className="text-dark-text-muted hover:text-dark-text-primary transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Models */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }} className="hover:border-primary-500 transition-all cursor-pointer">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Models</p>
                    <InformationCircleIcon className="h-4 w-4 text-dark-text-muted" title="Active & Published Models" />
                  </div>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalModels}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="primary" size="sm">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      All Active
                    </Badge>
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#1f6feb20', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <CpuChipIcon className="h-10 w-10" style={{ color: '#58a6ff' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Total Downloads */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }} className="hover:border-green-500 transition-all cursor-pointer">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Downloads</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalDownloads.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span style={{ color: '#3fb950', fontSize: '0.875rem', fontWeight: '600' }}>
                      <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                      {userStats.downloadsChange}
                    </span>
                    <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                      this month
                    </span>
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#23863620', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <ArrowDownTrayIcon className="h-10 w-10" style={{ color: '#3fb950' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Total Revenue */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }} className="hover:border-yellow-500 transition-all cursor-pointer">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Revenue</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.totalRevenue} ETH
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span style={{ color: '#3fb950', fontSize: '0.875rem', fontWeight: '600' }}>
                      <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                      {userStats.revenueChange}
                    </span>
                    <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                      this week
                    </span>
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f7df1e20', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <CurrencyDollarIcon className="h-10 w-10" style={{ color: '#f7df1e' }} />
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Average Rating */}
          <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }} className="hover:border-yellow-500 transition-all cursor-pointer">
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Avg Rating</p>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                    {userStats.avgRating}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolidIcon
                          key={star}
                          className="h-4 w-4"
                          style={{ color: star <= Math.floor(userStats.avgRating) ? '#f7df1e' : '#30363d' }}
                        />
                      ))}
                    </div>
                    <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                      ({userStats.ratingsCount} reviews)
                    </span>
                  </div>
                </div>
                <div style={{ 
                  backgroundColor: '#f7df1e20', 
                  padding: '1rem', 
                  borderRadius: '0.75rem' 
                }}>
                  <TrophyIcon className="h-10 w-10" style={{ color: '#f7df1e' }} />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Balance - Enhanced */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title style={{ color: '#f0f6fc' }}>
                    <WalletIcon className="h-5 w-5 inline mr-2" />
                    Wallet Balance
                  </Card.Title>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Deposit
                    </Button>
                    <Link to="/wallet">
                      <Button size="sm" variant="outline">
                        Manage
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <div className="flex items-center justify-between mb-2">
                      <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Total Balance</p>
                      <EyeIcon className="h-4 w-4 text-dark-text-muted" />
                    </div>
                    <p className="text-3xl font-bold mt-2" style={{ color: '#f0f6fc' }}>
                      {walletBalance.eth} ETH
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      ≈ ${walletBalance.usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Available</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: '#3fb950' }}>
                      {walletBalance.available} ETH
                    </p>
                    <Button size="sm" variant="primary" className="mt-3 w-full">
                      Withdraw
                    </Button>
                  </div>
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#161b22', 
                    borderRadius: '0.75rem',
                    border: '1px solid #21262d'
                  }}>
                    <p style={{ color: '#8b949e', fontSize: '0.875rem' }}>Pending</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: '#f7df1e' }}>
                      {walletBalance.pending} ETH
                    </p>
                    <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      Processing...
                    </p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="text-sm font-semibold text-dark-text-primary mb-3">Recent Transactions</h4>
                  <div className="space-y-2">
                    {walletBalance.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: '#161b22',
                          borderRadius: '0.5rem',
                          border: '1px solid #21262d'
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: tx.type === 'earning' || tx.type === 'deposit' ? '#23863620' : '#f8514920',
                            borderRadius: '0.5rem'
                          }}>
                            {tx.type === 'earning' || tx.type === 'deposit' ? (
                              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark-text-primary capitalize">{tx.type}</p>
                            <p className="text-xs text-dark-text-muted">{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} ETH
                          </p>
                          <Badge size="sm" variant={tx.status === 'completed' ? 'success' : 'warning'}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* My Models - Enhanced */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <Card.Title style={{ color: '#f0f6fc' }}>
                    <CpuChipIcon className="h-5 w-5 inline mr-2" />
                    My Models
                  </Card.Title>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <FunnelIcon className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                    <Link to="/developer/mymodels">
                      <Button size="sm" variant="outline">
                        View All
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
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
                      className="hover:border-primary-500 transition-all"
                    >
                      <div className="flex gap-4">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-24 h-24 rounded-lg object-cover"
                          style={{ border: '1px solid #21262d' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-dark-text-primary">{model.name}</h4>
                                {model.verified && (
                                  <Badge size="sm" variant="success">
                                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <Badge size="sm" variant={model.status === 'active' ? 'primary' : 'warning'}>
                                  {model.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-dark-text-muted mt-1">{model.category}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => navigate(`/marketplace/models/${model.id}`)}>
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Cog6ToothIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-dark-text-muted">Downloads</p>
                              <p className="text-lg font-bold text-dark-text-primary">{model.downloads.toLocaleString()}</p>
                              <p className="text-xs text-green-500">{model.downloadsChange}</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-text-muted">Revenue</p>
                              <p className="text-lg font-bold text-dark-text-primary">{model.revenue} ETH</p>
                              <p className="text-xs text-green-500">{model.revenueChange}</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-text-muted">Rating</p>
                              <div className="flex items-center gap-1">
                                <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                                <p className="text-lg font-bold text-dark-text-primary">{model.rating}</p>
                              </div>
                              <p className="text-xs text-dark-text-muted">({model.ratingsCount})</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-text-muted">Price</p>
                              <p className="text-lg font-bold text-dark-text-primary">{model.price} {model.currency}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Favorite Models - Enhanced */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="hover:border-primary-500 transition-all"
                    >
                      <div className="relative">
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-full h-32 rounded-lg object-cover mb-3"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Remove from favorites
                          }}
                          className="absolute top-2 right-2 p-2 bg-dark-bg-primary/80 backdrop-blur-sm rounded-full hover:bg-dark-bg-primary transition-colors"
                        >
                          <HeartSolidIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                      <h5 className="font-semibold text-dark-text-primary mb-1">{model.name}</h5>
                      <p className="text-xs text-dark-text-muted mb-2">{model.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-dark-text-primary">{model.rating}</span>
                        </div>
                        <Badge variant="primary" size="sm">{model.price} {model.priceUnit}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-8">
            {/* Activity Feed - Enhanced */}
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
                        className="hover:border-primary-500/50 transition-all cursor-pointer"
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
                            <p style={{ color: '#f0f6fc', fontSize: '0.875rem', lineHeight: '1.4' }}>
                              {activity.title}
                            </p>
                            {activity.modelName && (
                              <p style={{ color: '#58a6ff', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                {activity.modelName}
                              </p>
                            )}
                            {activity.user && (
                              <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                by {activity.user}
                              </p>
                            )}
                            <p style={{ color: '#8b949e', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                              {activity.time}
                            </p>
                            {activity.earnings && (
                              <p style={{ color: '#3fb950', fontSize: '0.875rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                {activity.earnings}
                              </p>
                            )}
                            {activity.cost && (
                              <p style={{ color: '#f85149', fontSize: '0.875rem', fontWeight: '600', marginTop: '0.5rem' }}>
                                {activity.cost}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button className="w-full mt-4" variant="outline" size="sm" onClick={() => setRecentActivity([])}>
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Activity
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
                  {dummyModels.filter(m => m.featured).slice(0, 4).map((model, index) => (
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
                      className="hover:border-primary-500 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white text-sm">
                          {index + 1}
                        </div>
                        <img
                          src={model.thumbnail}
                          alt={model.name}
                          className="w-12 h-12 rounded object-cover"
                          style={{ border: '1px solid #21262d' }}
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-sm" style={{ color: '#f0f6fc' }}>
                            {model.name}
                          </h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span style={{ color: '#f7df1e', fontSize: '0.75rem' }}>
                              <StarSolidIcon className="h-3 w-3 inline mr-1" />
                              {model.rating}
                            </span>
                            <span style={{ color: '#8b949e', fontSize: '0.75rem' }}>
                              <ArrowDownTrayIcon className="h-3 w-3 inline mr-1" />
                              {model.downloads.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/marketplace/models">
                  <Button className="w-full mt-4" variant="primary" size="sm">
                    Explore Marketplace
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <Card style={{ backgroundColor: '#0d1117', borderColor: '#21262d' }}>
              <Card.Header>
                <Card.Title style={{ color: '#f0f6fc' }}>
                  <ChartBarIcon className="h-5 w-5 inline mr-2" />
                  Quick Stats
                </Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-muted">Active Tests</span>
                    <span className="text-lg font-bold text-dark-text-primary">{userStats.activeTests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-muted">Response Rate</span>
                    <Badge variant="success">{userStats.responseRate}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-muted">Total Spent</span>
                    <span className="text-lg font-bold text-dark-text-primary">{userStats.totalSpent} ETH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-text-muted">Plan Status</span>
                    <Badge variant="primary">{userStats.planType}</Badge>
                  </div>
                </div>
                <Link to="/profile/settings">
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Cog6ToothIcon className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIdeal;
