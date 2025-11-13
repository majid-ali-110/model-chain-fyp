import React from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import {
  UsersIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Overview = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '12,456',
      change: '+8.2%',
      icon: UsersIcon,
      color: 'blue'
    },
    {
      title: 'Active Models',
      value: '1,847',
      change: '+15.3%',
      icon: CubeIcon,
      color: 'green'
    },
    {
      title: 'Total Volume',
      value: '245.7 ETH',
      change: '+22.1%',
      icon: CurrencyDollarIcon,
      color: 'purple'
    },
    {
      title: 'Platform Health',
      value: '99.2%',
      change: '+0.1%',
      icon: ChartBarIcon,
      color: 'green'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'High server load detected on validation nodes',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'info',
      message: 'New model category "Quantum ML" added',
      time: '2 hours ago'
    },
    {
      id: 3,
      type: 'error',
      message: 'Fraudulent model detected and removed',
      time: '4 hours ago'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Model Approved',
      target: 'GPT-5 Advanced',
      user: 'alice.eth',
      time: '10 minutes ago'
    },
    {
      id: 2,
      action: 'User Suspended',
      target: 'suspicious.eth',
      user: 'Admin',
      time: '1 hour ago'
    },
    {
      id: 3,
      action: 'Validator Added',
      target: 'bob.eth',
      user: 'Admin',
      time: '3 hours ago'
    }
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: 95, unit: 'ms' },
    { name: 'Database Performance', value: 87, unit: '%' },
    { name: 'Storage Usage', value: 68, unit: '%' },
    { name: 'Network Bandwidth', value: 45, unit: '%' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info': return <ShieldCheckIcon className="h-5 w-5 text-blue-500" />;
      default: return <ShieldCheckIcon className="h-5 w-5 text-secondary-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Admin Overview</h1>
          <p className="text-secondary-600">Monitor and manage the ModelChain platform</p>
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
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                    </div>
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
        {/* System Alerts */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>System Alerts</Card.Title>
              <Badge variant="warning">3 Active</Badge>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 border border-secondary-200 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{alert.message}</p>
                    <p className="text-xs text-secondary-600">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
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
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.action}: {activity.target}
                    </p>
                    <p className="text-xs text-secondary-600">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <Card.Header>
          <Card.Title>System Performance</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-secondary-900">{metric.name}</span>
                  <span className="text-secondary-600">{metric.value}{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className={metric.value > 80 ? 'bg-red-200' : metric.value > 60 ? 'bg-yellow-200' : 'bg-green-200'}
                />
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card>
        <Card.Header>
          <Card.Title>Quick Actions</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <UsersIcon className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <CubeIcon className="h-6 w-6" />
              <span>Review Models</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ChartBarIcon className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <ShieldCheckIcon className="h-6 w-6" />
              <span>Security Audit</span>
            </Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Overview;