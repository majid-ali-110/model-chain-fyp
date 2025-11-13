import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import {
  CurrencyDollarIcon,
  CubeIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

const Overview = () => {
  const stats = [
    {
      title: 'Total Earnings',
      value: '12.5 ETH',
      change: '+15.3%',
      changeType: 'increase',
      icon: CurrencyDollarIcon
    },
    {
      title: 'Active Models',
      value: '8',
      change: '+2',
      changeType: 'increase',
      icon: CubeIcon
    },
    {
      title: 'Total Downloads',
      value: '1,247',
      change: '+89',
      changeType: 'increase',
      icon: ChartBarIcon
    },
    {
      title: 'Followers',
      value: '342',
      change: '-5',
      changeType: 'decrease',
      icon: UserGroupIcon
    }
  ];

  const recentModels = [
    {
      id: 1,
      name: 'GPT-4 Clone',
      status: 'active',
      downloads: 456,
      earnings: '2.3 ETH'
    },
    {
      id: 2,
      name: 'Image Classifier',
      status: 'pending',
      downloads: 123,
      earnings: '0.8 ETH'
    }
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
              {recentModels.map(model => (
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
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>GPT-4 Clone</span>
                  <span>85%</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Image Classifier</span>
                  <span>67%</span>
                </div>
                <Progress value={67} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Audio Processor</span>
                  <span>42%</span>
                </div>
                <Progress value={42} />
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