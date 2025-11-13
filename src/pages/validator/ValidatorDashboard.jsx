import React, { useState, useEffect } from 'react';
import {
  ShieldCheckIcon,
  ClockIcon,
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  DocumentCheckIcon,
  CodeBracketIcon,
  BugAntIcon,
  ShieldExclamationIcon,
  UserGroupIcon,
  CalendarIcon,
  BanknotesIcon,
  CpuChipIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  ScaleIcon,
  SparklesIcon,
  AcademicCapIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon,
  Cog6ToothIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  TrophyIcon as TrophySolidIcon,
  FireIcon as FireSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import LineChart from '../../components/ui/LineChart';

const ValidatorDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Mock validator stats
  const [validatorStats] = useState({
    totalValidated: 342,
    pendingTasks: 8,
    successRate: 94.8,
    totalEarnings: 1547.23,
    stakingAmount: 50000,
    stakingRewards: 892.15,
    rank: 15,
    reputation: 4.9,
    monthlyStats: {
      validated: 45,
      earnings: 234.67,
      growth: 12.8
    },
    weeklyPerformance: [
      { day: 'Mon', validated: 8, accuracy: 96 },
      { day: 'Tue', validated: 12, accuracy: 94 },
      { day: 'Wed', validated: 6, accuracy: 98 },
      { day: 'Thu', validated: 10, accuracy: 92 },
      { day: 'Fri', validated: 9, accuracy: 97 },
      { day: 'Sat', validated: 7, accuracy: 95 },
      { day: 'Sun', validated: 5, accuracy: 99 }
    ]
  });

  // Mock pending validation tasks
  const [pendingTasks] = useState([
    {
      id: 1,
      modelId: 'model_789',
      modelName: 'Advanced Image Classifier',
      developer: 'Sarah Chen',
      category: 'image',
      submittedAt: '2025-10-03T08:30:00Z',
      priority: 'high',
      deadline: '2025-10-04T08:30:00Z',
      estimatedReward: 25.50,
      description: 'Computer vision model for retail product classification',
      requirements: ['accuracy_test', 'security_scan', 'code_review'],
      complexity: 'medium',
      framework: 'PyTorch',
      modelSize: '245 MB'
    },
    {
      id: 2,
      modelId: 'model_790',
      modelName: 'NLP Sentiment Engine',
      developer: 'Alex Rodriguez',
      category: 'text',
      submittedAt: '2025-10-03T09:15:00Z',
      priority: 'medium',
      deadline: '2025-10-05T09:15:00Z',
      estimatedReward: 18.75,
      description: 'Real-time sentiment analysis for customer feedback',
      requirements: ['bias_check', 'performance_test', 'documentation_review'],
      complexity: 'low',
      framework: 'Hugging Face',
      modelSize: '156 MB'
    },
    {
      id: 3,
      modelId: 'model_791',
      modelName: 'Audio Transcription Pro',
      developer: 'Maria Garcia',
      category: 'audio',
      submittedAt: '2025-10-03T10:45:00Z',
      priority: 'low',
      deadline: '2025-10-06T10:45:00Z',
      estimatedReward: 32.00,
      description: 'High-accuracy speech-to-text with noise reduction',
      requirements: ['accuracy_test', 'latency_test', 'security_scan'],
      complexity: 'high',
      framework: 'TensorFlow',
      modelSize: '892 MB'
    },
    {
      id: 4,
      modelId: 'model_792',
      modelName: 'Video Analytics Suite',
      developer: 'David Kim',
      category: 'video',
      submittedAt: '2025-10-03T11:20:00Z',
      priority: 'high',
      deadline: '2025-10-04T11:20:00Z',
      estimatedReward: 45.25,
      description: 'Real-time video content analysis and object tracking',
      requirements: ['performance_test', 'scalability_test', 'code_review', 'security_scan'],
      complexity: 'high',
      framework: 'PyTorch',
      modelSize: '1.2 GB'
    }
  ]);

  // Mock leaderboard data
  const [leaderboard] = useState([
    {
      rank: 1,
      validator: 'AI_Validator_Pro',
      reputation: 4.98,
      totalValidated: 1247,
      successRate: 98.2,
      earnings: 12450.67,
      streak: 45,
      badges: ['top_performer', 'accuracy_master', 'speed_demon']
    },
    {
      rank: 2,
      validator: 'ModelGuardian',
      reputation: 4.95,
      totalValidated: 1156,
      successRate: 97.8,
      earnings: 11230.89,
      streak: 38,
      badges: ['top_performer', 'security_expert']
    },
    {
      rank: 3,
      validator: 'CodeValidatorX',
      reputation: 4.92,
      totalValidated: 1089,
      successRate: 97.1,
      earnings: 10890.34,
      streak: 42,
      badges: ['top_performer', 'code_reviewer']
    },
    {
      rank: 15,
      validator: 'You',
      reputation: 4.9,
      totalValidated: 342,
      successRate: 94.8,
      earnings: 1547.23,
      streak: 12,
      badges: ['rising_star'],
      isCurrentUser: true
    }
  ]);

  // Mock recent activity
  const [recentActivity] = useState([
    {
      id: 1,
      type: 'validation_completed',
      modelName: 'GPT-4 Classifier',
      action: 'Approved',
      timestamp: '2025-10-03T14:30:00Z',
      reward: 22.50,
      accuracy: 96
    },
    {
      id: 2,
      type: 'validation_completed',
      modelName: 'Object Detection Pro',
      action: 'Rejected',
      timestamp: '2025-10-03T12:15:00Z',
      reward: 0,
      reason: 'Security vulnerabilities found'
    },
    {
      id: 3,
      type: 'staking_reward',
      amount: 45.67,
      timestamp: '2025-10-03T09:00:00Z'
    },
    {
      id: 4,
      type: 'validation_completed',
      modelName: 'Speech Recognition',
      action: 'Approved',
      timestamp: '2025-10-02T16:45:00Z',
      reward: 28.75,
      accuracy: 98
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Helper functions
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'text': return DocumentTextIcon;
      case 'image': return PhotoIcon;
      case 'audio': return SpeakerWaveIcon;
      case 'video': return VideoCameraIcon;
      default: return CpuChipIcon;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getComplexityBadge = (complexity) => {
    switch (complexity) {
      case 'high': return { variant: 'danger', label: 'High' };
      case 'medium': return { variant: 'warning', label: 'Medium' };
      case 'low': return { variant: 'success', label: 'Low' };
      default: return { variant: 'secondary', label: 'Unknown' };
    }
  };

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'top_performer': return TrophySolidIcon;
      case 'accuracy_master': return StarSolidIcon;
      case 'speed_demon': return FireSolidIcon;
      case 'security_expert': return ShieldCheckIcon;
      case 'code_reviewer': return CodeBracketIcon;
      case 'rising_star': return SparklesIcon;
      default: return StarIcon;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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

  const getTimeUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffInHours = Math.floor((deadlineDate - now) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Due soon';
    if (diffInHours < 24) return `${diffInHours}h left`;
    return `${Math.floor(diffInHours / 24)}d left`;
  };

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Validated</p>
            <p className="text-2xl font-bold text-white">{validatorStats.totalValidated}</p>
          </div>
          <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{validatorStats.monthlyStats.validated}</span>
          <span className="text-sm text-gray-400 ml-1">this month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Pending Tasks</p>
            <p className="text-2xl font-bold text-white">{validatorStats.pendingTasks}</p>
          </div>
          <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <ClockIcon className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <span className="text-sm text-gray-400">
            {pendingTasks.filter(task => task.priority === 'high').length} high priority
          </span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Success Rate</p>
            <p className="text-2xl font-bold text-white">{validatorStats.successRate}%</p>
          </div>
          <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="h-6 w-6 text-green-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm text-white">{validatorStats.reputation}</span>
          <span className="text-sm text-gray-400 ml-1">reputation</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Earnings</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(validatorStats.totalEarnings)}</p>
          </div>
          <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{formatCurrency(validatorStats.monthlyStats.earnings)}</span>
          <span className="text-sm text-gray-400 ml-1">this month</span>
        </div>
      </Card>
    </div>
  );

  // Pending Tasks Component
  const PendingTasks = () => (
    <Card className="mb-8">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
            Pending Validation Tasks
          </h3>
          <Badge variant="warning">{pendingTasks.length} pending</Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {pendingTasks.map((task) => {
            const CategoryIcon = getCategoryIcon(task.category);
            const complexityBadge = getComplexityBadge(task.complexity);
            
            return (
              <div
                key={task.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <div className="h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center mr-4">
                      <CategoryIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{task.modelName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={complexityBadge.variant} size="sm">
                            {complexityBadge.label}
                          </Badge>
                          <span className={clsx('text-sm font-medium', getPriorityColor(task.priority))}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Developer</p>
                          <p className="text-sm text-white">{task.developer}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Framework</p>
                          <p className="text-sm text-white">{task.framework}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Size</p>
                          <p className="text-sm text-white">{task.modelSize}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-sm">
                            <CurrencyDollarIcon className="h-4 w-4 text-green-400 mr-1" />
                            <span className="text-green-400">{formatCurrency(task.estimatedReward)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <ClockIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-yellow-400">{getTimeUntilDeadline(task.deadline)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm">
                            <PlayIcon className="h-4 w-4 mr-1" />
                            Start Validation
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">Requirements:</p>
                        <div className="flex flex-wrap gap-1">
                          {task.requirements.map((req) => (
                            <Badge key={req} variant="outline" size="sm">
                              {req.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {pendingTasks.length === 0 && (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">All caught up!</h4>
            <p className="text-gray-400">No pending validation tasks at the moment.</p>
          </div>
        )}
      </div>
    </Card>
  );

  // Performance Analytics Component
  const PerformanceAnalytics = () => {
    const chartData = validatorStats.weeklyPerformance.map(day => ({
      name: day.day,
      value: day.validated
    }));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <PresentationChartLineIcon className="h-5 w-5 mr-2" />
            Weekly Validation Activity
          </h3>
          <LineChart data={chartData} color="#3b82f6" height={200} />
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            {validatorStats.weeklyPerformance.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-gray-400">{day.day}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">{day.validated} models</span>
                  <div className="flex items-center">
                    <span className="text-green-400 text-sm">{day.accuracy}%</span>
                    <div className="w-16 bg-gray-700 rounded-full h-2 ml-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${day.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // Staking Info Component
  const StakingInfo = () => (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BanknotesIcon className="h-5 w-5 mr-2" />
        Staking Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Staked Amount</p>
          <p className="text-2xl font-bold text-white">{validatorStats.stakingAmount.toLocaleString()} MCT</p>
          <p className="text-sm text-green-400 mt-1">≈ {formatCurrency(validatorStats.stakingAmount * 0.75)}</p>
        </div>
        
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Staking Rewards</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(validatorStats.stakingRewards)}</p>
          <p className="text-sm text-gray-400 mt-1">12.5% APY</p>
        </div>
        
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Next Reward</p>
          <p className="text-2xl font-bold text-white">2d 14h</p>
          <p className="text-sm text-gray-400 mt-1">Est. {formatCurrency(15.67)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          <p>Minimum stake: 10,000 MCT • Lock period: 30 days</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Increase Stake
          </Button>
          <Button variant="ghost" size="sm">
            <Cog6ToothIcon className="h-4 w-4 mr-1" />
            Manage
          </Button>
        </div>
      </div>
    </Card>
  );

  // Leaderboard Component
  const Leaderboard = () => (
    <Card className="mb-8">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrophyIcon className="h-5 w-5 mr-2" />
          Validator Leaderboard
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {leaderboard.map((validator) => (
            <div
              key={validator.rank}
              className={clsx(
                'p-4 rounded-lg border transition-colors',
                validator.isCurrentUser
                  ? 'bg-blue-500/10 border-blue-500/30'
                  : 'bg-gray-800/50 border-gray-700'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={clsx(
                    'h-8 w-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold',
                    validator.rank === 1 && 'bg-yellow-500 text-yellow-900',
                    validator.rank === 2 && 'bg-gray-400 text-gray-900',
                    validator.rank === 3 && 'bg-orange-500 text-orange-900',
                    validator.rank > 3 && 'bg-gray-700 text-gray-300'
                  )}>
                    {validator.rank}
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <p className={clsx(
                        'font-medium',
                        validator.isCurrentUser ? 'text-blue-400' : 'text-white'
                      )}>
                        {validator.validator}
                      </p>
                      {validator.isCurrentUser && (
                        <Badge variant="primary" size="sm" className="ml-2">You</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center">
                        <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-400">{validator.reputation}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />
                        <span className="text-sm text-gray-400">{validator.successRate}%</span>
                      </div>
                      <div className="flex items-center">
                        <FireIcon className="h-4 w-4 text-orange-400 mr-1" />
                        <span className="text-sm text-gray-400">{validator.streak} streak</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-white font-medium">{formatCurrency(validator.earnings)}</p>
                  <p className="text-sm text-gray-400">{validator.totalValidated} validated</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-1">
                  {validator.badges.map((badge) => {
                    const BadgeIcon = getBadgeIcon(badge);
                    return (
                      <div
                        key={badge}
                        className="h-6 w-6 bg-blue-500/20 rounded flex items-center justify-center"
                        title={badge.replace('_', ' ')}
                      >
                        <BadgeIcon className="h-3 w-3 text-blue-400" />
                      </div>
                    );
                  })}
                </div>
                
                {validator.rank <= 3 && (
                  <div className="flex items-center">
                    <TrophySolidIcon className={clsx(
                      'h-5 w-5 mr-1',
                      validator.rank === 1 && 'text-yellow-400',
                      validator.rank === 2 && 'text-gray-400',
                      validator.rank === 3 && 'text-orange-400'
                    )} />
                    <span className="text-sm text-gray-400">Top {validator.rank}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  // Recent Activity Component
  const RecentActivity = () => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <ClockIcon className="h-5 w-5 mr-2" />
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center">
              <div className={clsx(
                'h-8 w-8 rounded-full flex items-center justify-center mr-3',
                activity.type === 'validation_completed' && activity.action === 'Approved' && 'bg-green-500/20 text-green-400',
                activity.type === 'validation_completed' && activity.action === 'Rejected' && 'bg-red-500/20 text-red-400',
                activity.type === 'staking_reward' && 'bg-blue-500/20 text-blue-400'
              )}>
                {activity.type === 'validation_completed' && activity.action === 'Approved' && <CheckCircleIcon className="h-5 w-5" />}
                {activity.type === 'validation_completed' && activity.action === 'Rejected' && <XCircleIcon className="h-5 w-5" />}
                {activity.type === 'staking_reward' && <BanknotesIcon className="h-5 w-5" />}
              </div>
              
              <div>
                {activity.type === 'validation_completed' ? (
                  <>
                    <p className="text-white text-sm">
                      {activity.action} <span className="text-blue-400">{activity.modelName}</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      {activity.action === 'Approved' ? `${activity.accuracy}% accuracy` : activity.reason}
                    </p>
                  </>
                ) : (
                  <p className="text-white text-sm">
                    Staking reward earned: <span className="text-green-400">{formatCurrency(activity.amount)}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="text-right">
              {activity.reward !== undefined && (
                <p className={clsx(
                  'text-sm font-medium',
                  activity.reward > 0 ? 'text-green-400' : 'text-gray-400'
                )}>
                  {activity.reward > 0 ? `+${formatCurrency(activity.reward)}` : 'No reward'}
                </p>
              )}
              <p className="text-gray-400 text-xs">{formatTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Validator Dashboard</h1>
            <p className="text-gray-400">Monitor your validation performance and earn rewards</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Online</span>
            </div>
            <Badge variant="primary">Rank #{validatorStats.rank}</Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            {/* Pending Tasks */}
            <PendingTasks />
            
            {/* Performance Analytics */}
            <PerformanceAnalytics />
            
            {/* Staking Info */}
            <StakingInfo />
          </div>

          <div className="xl:col-span-1">
            {/* Leaderboard */}
            <Leaderboard />
            
            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorDashboard;