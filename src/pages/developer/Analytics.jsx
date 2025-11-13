import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import Progress from '../../components/ui/Progress';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  EyeIcon,
  StarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedModel, setSelectedModel] = useState('all');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const models = [
    { value: 'all', label: 'All Models' },
    { value: '1', label: 'GPT-4 Clone' },
    { value: '2', label: 'Image Classifier Pro' },
    { value: '3', label: 'Audio Processor' }
  ];

  const stats = [
    {
      title: 'Total Downloads',
      value: '1,247',
      change: '+15.3%',
      icon: ArrowDownTrayIcon,
      color: 'blue'
    },
    {
      title: 'Total Earnings',
      value: '12.5 ETH',
      change: '+22.1%',
      icon: CurrencyDollarIcon,
      color: 'green'
    },
    {
      title: 'Page Views',
      value: '8,432',
      change: '+8.7%',
      icon: EyeIcon,
      color: 'purple'
    },
    {
      title: 'Avg Rating',
      value: '4.6',
      change: '+0.2',
      icon: StarIcon,
      color: 'yellow'
    }
  ];

  const topModels = [
    {
      name: 'GPT-4 Clone',
      downloads: 756,
      earnings: '8.2 ETH',
      rating: 4.8,
      growth: 15.3
    },
    {
      name: 'Image Classifier Pro',
      downloads: 321,
      earnings: '3.1 ETH',
      rating: 4.6,
      growth: 8.7
    },
    {
      name: 'Audio Processor',
      downloads: 170,
      earnings: '1.2 ETH',
      rating: 4.2,
      growth: -2.1
    }
  ];

  const recentActivity = [
    {
      type: 'download',
      model: 'GPT-4 Clone',
      user: 'alice.eth',
      amount: '0.05 ETH',
      time: '2 hours ago'
    },
    {
      type: 'review',
      model: 'Image Classifier Pro',
      user: 'bob.eth',
      rating: 5,
      time: '4 hours ago'
    },
    {
      type: 'download',
      model: 'Audio Processor',
      user: 'charlie.eth',
      amount: '0.03 ETH',
      time: '6 hours ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600">Track your model performance and earnings</p>
        </div>
        
        <div className="flex gap-2">
          <Dropdown
            trigger={(
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4" />
                {timeRanges.find(r => r.value === timeRange)?.label}
              </Button>
            )}
            items={timeRanges.map(range => ({
              label: range.label,
              onClick: () => setTimeRange(range.value)
            }))}
          />
          
          <Dropdown
            trigger={(
              <Button variant="outline">
                {models.find(m => m.value === selectedModel)?.label}
              </Button>
            )}
            items={models.map(model => ({
              label: model.label,
              onClick: () => setSelectedModel(model.value)
            }))}
          />
        </div>
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
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Models */}
        <Card>
          <Card.Header>
            <Card.Title>Top Performing Models</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {topModels.map((model, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-secondary-100 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-secondary-900">{model.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-secondary-600 mt-1">
                      <span>{model.downloads} downloads</span>
                      <span>{model.earnings}</span>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3 text-yellow-400" />
                        {model.rating}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    model.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {model.growth >= 0 ? '+' : ''}{model.growth}%
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <Card.Title>Recent Activity</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 py-3 border-b border-secondary-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'download' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.type === 'download' ? 'Download' : 'Review'} on {activity.model}
                    </p>
                    <p className="text-xs text-secondary-600">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    {activity.amount || `${activity.rating}★`}
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <Card.Header>
          <Card.Title>Performance Metrics</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Download Growth</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>This Month</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Last Month</span>
                    <span>72%</span>
                  </div>
                  <Progress value={72} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">User Engagement</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Return Users</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Page Views</span>
                    <span>89%</span>
                  </div>
                  <Progress value={89} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Revenue Growth</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>This Month</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Analytics;