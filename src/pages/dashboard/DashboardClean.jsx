import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  ArrowDownTrayIcon,
  CpuChipIcon,
  ChevronRightIcon,
  FireIcon,
  TrophyIcon,
  CalendarIcon,
  CheckCircleIcon,
  BeakerIcon,
  HeartIcon,
  WalletIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  Cog6ToothIcon,
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

// Color palette - GitHub Dark Theme
const colors = {
  bg: {
    primary: '#0a0c10',
    secondary: '#0d1117',
    tertiary: '#161b22',
    elevated: '#21262d'
  },
  text: {
    primary: '#f0f6fc',
    secondary: '#c9d1d9',
    muted: '#8b949e',
    link: '#58a6ff'
  },
  border: {
    default: '#21262d',
    muted: '#30363d'
  },
  accent: {
    green: '#3fb950',
    blue: '#58a6ff',
    yellow: '#f7df1e',
    red: '#f85149',
    purple: '#a371f7'
  }
};

const DashboardClean = () => {
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

    setWalletBalance({
      eth: 12.5,
      usd: 23450.75,
      pending: 2.3,
      available: 10.2,
      transactions: [
        { id: 1, type: 'deposit', amount: 5.0, date: 'Nov 1, 2024', status: 'completed' },
        { id: 2, type: 'earning', amount: 2.5, date: 'Oct 30, 2024', status: 'completed' },
        { id: 3, type: 'withdrawal', amount: -3.0, date: 'Oct 28, 2024', status: 'pending' }
      ]
    });

    setMyModels([
      {
        id: '1',
        name: 'GPT-4 Vision Clone',
        category: 'Computer Vision',
        price: 0.005,
        downloads: 3247,
        revenue: 16.24,
        rating: 4.8,
        ratingsCount: 128,
        status: 'active',
        verified: true,
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
        downloadsChange: '+15%',
        revenueChange: '+22%'
      },
      {
        id: '2',
        name: 'Audio Transcription AI',
        category: 'Audio Processing',
        price: 0.003,
        downloads: 5120,
        revenue: 15.36,
        rating: 4.9,
        ratingsCount: 201,
        status: 'active',
        verified: true,
        thumbnail: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=200&h=200&fit=crop',
        downloadsChange: '+28%',
        revenueChange: '+31%'
      }
    ]);

    setFavoriteModels(dummyModels.slice(0, 4));

    setRecentActivity([
      { id: 1, type: 'download', title: 'Model downloaded by user', time: '5 minutes ago', user: 'alice_ai', modelName: 'GPT-4 Vision Clone', earnings: '+0.005 ETH' },
      { id: 2, type: 'rating', title: 'New 5-star rating received', time: '1 hour ago', modelName: 'Audio Transcription AI' },
      { id: 3, type: 'withdrawal', title: 'Withdrawal processed', time: '3 hours ago', earnings: '-3.0 ETH' },
      { id: 4, type: 'test', title: 'Sandbox test completed', time: '5 hours ago', modelName: 'Llama 3 405B', cost: '-0.002 ETH' },
      { id: 5, type: 'upload', title: 'New model uploaded for review', time: '1 day ago', modelName: 'Sentiment Analyzer v2' }
    ]);

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
      }
    ]);

    setIsLoading(false);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const removeFavorite = (modelId) => {
    setFavoriteModels(prev => prev.filter(m => m.id !== modelId));
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.bg.primary }}>
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.bg.primary }}>
      {/* Header Section */}
      <div style={{ backgroundColor: colors.bg.secondary, borderBottom: `1px solid ${colors.border.default}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link to="/" style={{ color: colors.text.muted }} className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ChevronRightIcon className="h-4 w-4" style={{ color: colors.text.muted }} />
            <span style={{ color: colors.text.primary }} className="font-medium">Dashboard</span>
          </div>

          {/* Welcome Header - Clean and simple */}
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: colors.text.primary }}>
              Welcome back, Demo User! 👋
            </h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: colors.text.muted }}>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <div className="mb-6 space-y-3">
            {notifications.filter(n => !n.read).map((notification) => {
              const Icon = notification.type === 'success' ? CheckCircleIcon : 
                          notification.type === 'warning' ? ExclamationTriangleIcon : InformationCircleIcon;
              const iconColor = notification.type === 'success' ? colors.accent.green : 
                               notification.type === 'warning' ? colors.accent.yellow : colors.accent.blue;
              const bgColor = `${iconColor}15`;
              
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
                      <h4 className="font-semibold" style={{ color: colors.text.primary }}>{notification.title}</h4>
                      <p className="text-sm mt-1" style={{ color: colors.text.muted }}>{notification.message}</p>
                      <p className="text-xs mt-2" style={{ color: colors.text.muted }}>{notification.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissNotification(notification.id)}
                    style={{ color: colors.text.muted }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Models */}
          <div 
            style={{ 
              backgroundColor: colors.bg.secondary, 
              borderColor: colors.border.default,
              borderWidth: '1px',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              transition: 'border-color 0.2s'
            }}
            className="hover:border-blue-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p style={{ color: colors.text.muted, fontSize: '0.875rem' }}>Total Models</p>
                <p className="text-4xl font-bold mt-2" style={{ color: colors.text.primary }}>
                  {userStats.totalModels}
                </p>
                <div className="mt-3">
                  <Badge variant="primary" size="sm">All Active</Badge>
                </div>
              </div>
              <div style={{ backgroundColor: `${colors.accent.blue}20`, padding: '1rem', borderRadius: '0.75rem' }}>
                <CpuChipIcon className="h-10 w-10" style={{ color: colors.accent.blue }} />
              </div>
            </div>
          </div>

          {/* Total Downloads */}
          <div 
            style={{ 
              backgroundColor: colors.bg.secondary, 
              borderColor: colors.border.default,
              borderWidth: '1px',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}
            className="hover:border-green-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p style={{ color: colors.text.muted, fontSize: '0.875rem' }}>Total Downloads</p>
                <p className="text-4xl font-bold mt-2" style={{ color: colors.text.primary }}>
                  {userStats.totalDownloads.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <ArrowTrendingUpIcon className="h-4 w-4" style={{ color: colors.accent.green }} />
                  <span className="text-sm font-medium" style={{ color: colors.accent.green }}>
                    {userStats.downloadsChange}
                  </span>
                  <span className="text-sm" style={{ color: colors.text.muted }}>this month</span>
                </div>
              </div>
              <div style={{ backgroundColor: `${colors.accent.green}20`, padding: '1rem', borderRadius: '0.75rem' }}>
                <ArrowDownTrayIcon className="h-10 w-10" style={{ color: colors.accent.green }} />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div 
            style={{ 
              backgroundColor: colors.bg.secondary, 
              borderColor: colors.border.default,
              borderWidth: '1px',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}
            className="hover:border-purple-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p style={{ color: colors.text.muted, fontSize: '0.875rem' }}>Total Revenue</p>
                <p className="text-4xl font-bold mt-2" style={{ color: colors.text.primary }}>
                  {userStats.totalRevenue} <span className="text-2xl">ETH</span>
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <ArrowTrendingUpIcon className="h-4 w-4" style={{ color: colors.accent.green }} />
                  <span className="text-sm font-medium" style={{ color: colors.accent.green }}>
                    {userStats.revenueChange}
                  </span>
                  <span className="text-sm" style={{ color: colors.text.muted }}>this week</span>
                </div>
              </div>
              <div style={{ backgroundColor: `${colors.accent.purple}20`, padding: '1rem', borderRadius: '0.75rem' }}>
                <CurrencyDollarIcon className="h-10 w-10" style={{ color: colors.accent.purple }} />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div 
            style={{ 
              backgroundColor: colors.bg.secondary, 
              borderColor: colors.border.default,
              borderWidth: '1px',
              borderRadius: '0.75rem',
              padding: '1.5rem'
            }}
            className="hover:border-yellow-500 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p style={{ color: colors.text.muted, fontSize: '0.875rem' }}>Average Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-4xl font-bold" style={{ color: colors.text.primary }}>
                    {userStats.avgRating}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarSolidIcon 
                        key={i} 
                        className="h-5 w-5" 
                        style={{ color: i < Math.floor(userStats.avgRating) ? colors.accent.yellow : colors.border.muted }} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-3" style={{ color: colors.text.muted }}>
                  {userStats.ratingsCount} total reviews
                </p>
              </div>
              <div style={{ backgroundColor: `${colors.accent.yellow}20`, padding: '1rem', borderRadius: '0.75rem' }}>
                <TrophyIcon className="h-10 w-10" style={{ color: colors.accent.yellow }} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Balance */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    <WalletIcon className="h-6 w-6 inline mr-2" />
                    Wallet Balance
                  </h3>
                  <Link to="/wallet">
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div style={{ backgroundColor: colors.bg.tertiary, borderRadius: '0.5rem', padding: '1rem' }}>
                    <p className="text-sm mb-1" style={{ color: colors.text.muted }}>Total Balance</p>
                    <p className="text-2xl font-bold" style={{ color: colors.text.primary }}>
                      {walletBalance.eth} ETH
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
                      ≈ ${walletBalance.usd.toLocaleString()}
                    </p>
                  </div>
                  <div style={{ backgroundColor: colors.bg.tertiary, borderRadius: '0.5rem', padding: '1rem' }}>
                    <p className="text-sm mb-1" style={{ color: colors.text.muted }}>Available</p>
                    <p className="text-2xl font-bold" style={{ color: colors.accent.green }}>
                      {walletBalance.available} ETH
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.text.muted }}>Ready to withdraw</p>
                  </div>
                  <div style={{ backgroundColor: colors.bg.tertiary, borderRadius: '0.5rem', padding: '1rem' }}>
                    <p className="text-sm mb-1" style={{ color: colors.text.muted }}>Pending</p>
                    <p className="text-2xl font-bold" style={{ color: colors.accent.yellow }}>
                      {walletBalance.pending} ETH
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.text.muted }}>Processing</p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: colors.text.primary }}>
                    Recent Transactions
                  </h4>
                  <div className="space-y-2">
                    {walletBalance.transactions.map(tx => (
                      <div 
                        key={tx.id}
                        style={{ 
                          backgroundColor: colors.bg.tertiary, 
                          borderRadius: '0.5rem', 
                          padding: '0.75rem' 
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div style={{ 
                            backgroundColor: tx.type === 'earning' ? `${colors.accent.green}20` : 
                                           tx.type === 'deposit' ? `${colors.accent.blue}20` : `${colors.accent.red}20`,
                            padding: '0.5rem',
                            borderRadius: '0.375rem'
                          }}>
                            <WalletIcon className="h-5 w-5" style={{ 
                              color: tx.type === 'earning' ? colors.accent.green : 
                                     tx.type === 'deposit' ? colors.accent.blue : colors.accent.red 
                            }} />
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize" style={{ color: colors.text.primary }}>
                              {tx.type}
                            </p>
                            <p className="text-xs" style={{ color: colors.text.muted }}>{tx.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold" style={{ 
                            color: tx.amount > 0 ? colors.accent.green : colors.accent.red 
                          }}>
                            {tx.amount > 0 ? '+' : ''}{tx.amount} ETH
                          </p>
                          <Badge variant={tx.status === 'completed' ? 'success' : 'warning'} size="sm">
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* My Models */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    <CpuChipIcon className="h-6 w-6 inline mr-2" />
                    My Models
                  </h3>
                  <Link to="/developer/mymodels" style={{ color: colors.text.link }}>
                    View All →
                  </Link>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {myModels.map(model => (
                    <div 
                      key={model.id}
                      style={{ 
                        backgroundColor: colors.bg.tertiary, 
                        borderRadius: '0.75rem', 
                        padding: '1rem',
                        border: `1px solid ${colors.border.default}`
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={model.thumbnail}
                          alt={model.name}
                          style={{ width: '64px', height: '64px', borderRadius: '0.5rem' }}
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold" style={{ color: colors.text.primary }}>
                                  {model.name}
                                </h4>
                                {model.verified && (
                                  <CheckCircleIcon className="h-5 w-5" style={{ color: colors.accent.blue }} />
                                )}
                              </div>
                              <p className="text-sm mt-1" style={{ color: colors.text.muted }}>
                                {model.category}
                              </p>
                            </div>
                            <Badge variant="success" size="sm">{model.status}</Badge>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-4 gap-4 mt-4">
                            <div>
                              <p className="text-xs" style={{ color: colors.text.muted }}>Downloads</p>
                              <p className="text-lg font-bold" style={{ color: colors.text.primary }}>
                                {model.downloads.toLocaleString()}
                              </p>
                              <span className="text-xs" style={{ color: colors.accent.green }}>
                                {model.downloadsChange}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: colors.text.muted }}>Revenue</p>
                              <p className="text-lg font-bold" style={{ color: colors.text.primary }}>
                                {model.revenue} ETH
                              </p>
                              <span className="text-xs" style={{ color: colors.accent.green }}>
                                {model.revenueChange}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: colors.text.muted }}>Rating</p>
                              <div className="flex items-center gap-1">
                                <StarSolidIcon className="h-4 w-4" style={{ color: colors.accent.yellow }} />
                                <p className="text-lg font-bold" style={{ color: colors.text.primary }}>
                                  {model.rating}
                                </p>
                              </div>
                              <p className="text-xs" style={{ color: colors.text.muted }}>
                                ({model.ratingsCount})
                              </p>
                            </div>
                            <div>
                              <p className="text-xs" style={{ color: colors.text.muted }}>Price</p>
                              <p className="text-lg font-bold" style={{ color: colors.text.primary }}>
                                {model.price} ETH
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => navigate(`/marketplace/models/${model.id}`)}
                            >
                              <EyeIcon className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <PencilIcon className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Cog6ToothIcon className="h-4 w-4 mr-1" />
                              Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Favorite Models */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  <HeartIcon className="h-6 w-6 inline mr-2" />
                  Favorite Models
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteModels.map(model => (
                    <div 
                      key={model.id}
                      style={{ 
                        backgroundColor: colors.bg.tertiary, 
                        borderRadius: '0.75rem',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: `1px solid ${colors.border.default}`
                      }}
                      className="hover:border-blue-500 transition-colors"
                      onClick={() => navigate(`/marketplace/models/${model.id}`)}
                    >
                      <div className="relative">
                        <img 
                          src={model.thumbnail || (() => {
                            const images = [
                              'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
                              'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
                              'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=400&h=200&fit=crop',
                              'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=200&fit=crop'
                            ];
                            const hash = (model.id || '').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            return images[hash % images.length];
                          })()}
                          alt={model.name}
                          style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFavorite(model.id);
                          }}
                          className="absolute top-2 right-2"
                          style={{
                            backgroundColor: colors.bg.secondary,
                            borderRadius: '50%',
                            padding: '0.5rem'
                          }}
                        >
                          <HeartSolidIcon className="h-5 w-5" style={{ color: colors.accent.red }} />
                        </button>
                      </div>
                      <div style={{ padding: '1rem' }}>
                        <h4 className="font-semibold mb-1" style={{ color: colors.text.primary }}>
                          {model.name}
                        </h4>
                        <p className="text-sm mb-2" style={{ color: colors.text.muted }}>
                          {model.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <StarSolidIcon className="h-4 w-4" style={{ color: colors.accent.yellow }} />
                            <span className="text-sm font-medium" style={{ color: colors.text.primary }}>
                              {model.rating}
                            </span>
                          </div>
                          <Badge variant="primary" size="sm">
                            {model.price} {model.currency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Activity Feed */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                    Recent Activity
                  </h3>
                  <button onClick={() => loadDashboardData()} style={{ color: colors.text.muted }}>
                    <ArrowPathIcon className="h-5 w-5" />
                  </button>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {recentActivity.map(activity => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div 
                        key={activity.id}
                        style={{ 
                          backgroundColor: colors.bg.tertiary, 
                          borderRadius: '0.5rem', 
                          padding: '0.75rem' 
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div style={{ 
                            backgroundColor: colors.bg.elevated, 
                            padding: '0.5rem', 
                            borderRadius: '0.375rem' 
                          }}>
                            <Icon className="h-5 w-5" style={{ color: colors.accent.blue }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: colors.text.primary }}>
                              {activity.title}
                            </p>
                            {activity.user && (
                              <p className="text-xs mt-0.5" style={{ color: colors.text.muted }}>
                                by {activity.user}
                              </p>
                            )}
                            {activity.modelName && (
                              <p className="text-xs mt-0.5" style={{ color: colors.text.link }}>
                                {activity.modelName}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs" style={{ color: colors.text.muted }}>
                                {activity.time}
                              </p>
                              {activity.earnings && (
                                <span className="text-xs font-semibold" style={{ 
                                  color: activity.earnings.includes('-') ? colors.accent.red : colors.accent.green 
                                }}>
                                  {activity.earnings}
                                </span>
                              )}
                              {activity.cost && (
                                <span className="text-xs font-semibold" style={{ color: colors.accent.red }}>
                                  {activity.cost}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>

            {/* Trending Models */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  <FireIcon className="h-6 w-6 inline mr-2" />
                  Trending Models
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {dummyModels.slice(0, 4).map((model, index) => (
                    <div 
                      key={model.id}
                      style={{ 
                        backgroundColor: colors.bg.tertiary, 
                        borderRadius: '0.5rem', 
                        padding: '0.75rem',
                        cursor: 'pointer'
                      }}
                      className="hover:opacity-80 transition-opacity"
                      onClick={() => navigate(`/marketplace/models/${model.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          style={{ 
                            background: `linear-gradient(135deg, ${colors.accent.blue}, ${colors.accent.purple})`,
                            color: colors.text.primary,
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                          }}
                        >
                          {index + 1}
                        </div>
                        <img 
                          src={model.thumbnail || (() => {
                            const images = [
                              'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop',
                              'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop',
                              'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=100&h=100&fit=crop',
                              'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=100&h=100&fit=crop'
                            ];
                            const hash = (model.id || '').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                            return images[hash % images.length];
                          })()}
                          alt={model.name}
                          style={{ width: '40px', height: '40px', borderRadius: '0.375rem' }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                            {model.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <StarSolidIcon className="h-3 w-3" style={{ color: colors.accent.yellow }} />
                              <span className="text-xs" style={{ color: colors.text.muted }}>
                                {model.rating}
                              </span>
                            </div>
                            <span className="text-xs" style={{ color: colors.text.muted }}>
                              • {model.downloads}+ uses
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/marketplace/models">
                    <Button variant="outline" className="w-full">
                      Explore Marketplace
                    </Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>

            {/* Quick Stats */}
            <Card style={{ backgroundColor: colors.bg.secondary, borderColor: colors.border.default }}>
              <Card.Header>
                <h3 className="text-xl font-bold" style={{ color: colors.text.primary }}>
                  Quick Stats
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: colors.text.muted }}>Active Tests</span>
                      <span className="font-bold" style={{ color: colors.text.primary }}>
                        {userStats.activeTests}
                      </span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ backgroundColor: colors.bg.tertiary }}>
                      <div 
                        style={{ 
                          width: '65%', 
                          backgroundColor: colors.accent.blue,
                          height: '100%',
                          borderRadius: '9999px'
                        }} 
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: colors.text.muted }}>Response Rate</span>
                      <Badge variant="success" size="sm">{userStats.responseRate}</Badge>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: colors.text.muted }}>Total Spent</span>
                      <span className="font-bold" style={{ color: colors.text.primary }}>
                        {userStats.totalSpent} ETH
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm" style={{ color: colors.text.muted }}>Plan Status</span>
                      <Badge variant="primary" size="sm">{userStats.planType}</Badge>
                    </div>
                  </div>
                  <div className="pt-4" style={{ borderTop: `1px solid ${colors.border.default}` }}>
                    <Link to="/profile/settings">
                      <Button variant="outline" className="w-full">
                        Account Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClean;
