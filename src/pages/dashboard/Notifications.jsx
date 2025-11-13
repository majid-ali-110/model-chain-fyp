import React, { useState } from 'react';
import { 
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Model Approved',
      message: 'Your AI model "GPT-Vision-Plus" has been successfully approved and is now live on the marketplace!',
      time: '5 minutes ago',
      date: new Date(Date.now() - 5 * 60 * 1000),
      unread: true,
      type: 'success',
      category: 'Models',
      actionUrl: '/developer/models'
    },
    {
      id: 2,
      title: 'Governance Proposal Active',
      message: 'New proposal "Reduce Platform Fees from 3% to 2%" is now live for voting. Your vote matters!',
      time: '1 hour ago',
      date: new Date(Date.now() - 60 * 60 * 1000),
      unread: true,
      type: 'info',
      category: 'Governance',
      actionUrl: '/governance'
    },
    {
      id: 3,
      title: 'Transaction Completed',
      message: 'You received 2.5 ETH from model downloads this week. Payment has been processed successfully.',
      time: '3 hours ago',
      date: new Date(Date.now() - 3 * 60 * 60 * 1000),
      unread: false,
      type: 'success',
      category: 'Payments',
      actionUrl: '/wallet'
    },
    {
      id: 4,
      title: 'Model Update Available',
      message: 'An important update is available for "Audio Synthesizer X". Update to version 2.1 for improved performance.',
      time: '6 hours ago',
      date: new Date(Date.now() - 6 * 60 * 60 * 1000),
      unread: false,
      type: 'info',
      category: 'Updates',
      actionUrl: '/developer/models'
    },
    {
      id: 5,
      title: 'New Follower',
      message: 'Sarah Chen (@sarahdev) started following you. Check out her AI models!',
      time: '12 hours ago',
      date: new Date(Date.now() - 12 * 60 * 60 * 1000),
      unread: false,
      type: 'info',
      category: 'Social',
      actionUrl: '/profile'
    },
    {
      id: 6,
      title: 'Model Review Received',
      message: 'Your model "NLP Sentiment Analyzer" received a 5-star review from Marcus Rodriguez.',
      time: '1 day ago',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      type: 'success',
      category: 'Reviews',
      actionUrl: '/developer/models'
    },
    {
      id: 7,
      title: 'Security Alert',
      message: 'New login detected from Chrome on Windows. If this wasn\'t you, please secure your account immediately.',
      time: '2 days ago',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      unread: false,
      type: 'warning',
      category: 'Security',
      actionUrl: '/settings'
    },
    {
      id: 8,
      title: 'Staking Rewards',
      message: 'You earned 0.5 MCT tokens from staking rewards this month. Keep staking to earn more!',
      time: '3 days ago',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unread: false,
      type: 'success',
      category: 'Rewards',
      actionUrl: '/wallet'
    },
    {
      id: 9,
      title: 'Model Download Milestone',
      message: 'Congratulations! Your model "GPT-Vision-Plus" reached 10,000 downloads. You\'ve earned a "Popular Creator" badge!',
      time: '1 week ago',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      unread: false,
      type: 'success',
      category: 'Achievements',
      actionUrl: '/profile'
    },
    {
      id: 10,
      title: 'Platform Maintenance',
      message: 'Scheduled maintenance on November 10th from 2:00 AM to 4:00 AM UTC. Services may be temporarily unavailable.',
      time: '1 week ago',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      unread: false,
      type: 'warning',
      category: 'System',
      actionUrl: null
    }
  ]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'read') return !n.unread;
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return CheckCircleIcon;
      case 'warning':
        return ExclamationCircleIcon;
      case 'info':
      default:
        return InformationCircleIcon;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/20 rounded-xl border-2 border-cyan-500/30">
                <BellIcon className="h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-gray-400 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <CheckIcon className="h-4 w-4" />
                Mark All as Read
              </Button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex items-center gap-2"
            >
              <FunnelIcon className="h-4 w-4" />
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Read ({notifications.length - unreadCount})
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center">
              <BellIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No notifications found</p>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => {
              const TypeIcon = getTypeIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={clsx(
                    'p-6 transition-all duration-300 hover-lift',
                    notification.unread && 'bg-cyan-500/5 border-cyan-500/30'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={clsx(
                      'flex-shrink-0 rounded-xl p-3 border-2',
                      getTypeColor(notification.type)
                    )}>
                      <TypeIcon className="h-6 w-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-white">
                            {notification.title}
                          </h3>
                          {notification.unread && (
                            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </div>
                        <Badge variant="outline" size="sm">
                          {notification.category}
                        </Badge>
                      </div>

                      <p className="text-gray-400 mb-3">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {notification.time}
                        </span>

                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.location.href = notification.actionUrl}
                            >
                              View Details
                            </Button>
                          )}
                          {notification.unread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-cyan-400 hover:text-cyan-300"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
