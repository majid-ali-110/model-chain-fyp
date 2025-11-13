import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [filter, setFilter] = useState('all');

  const stats = [
    {
      title: 'Models Validated',
      value: '127',
      change: '+12 this week',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '3 urgent',
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      title: 'Earnings',
      value: '2.4 ETH',
      change: '+0.3 ETH this week',
      icon: CurrencyDollarIcon,
      color: 'blue'
    },
    {
      title: 'Accuracy Score',
      value: '98.5%',
      change: '+0.2% improvement',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ];

  const pendingModels = [
    {
      id: 1,
      name: 'Advanced NLP Model',
      developer: 'alice.eth',
      category: 'Language',
      submittedAt: '2024-01-15',
      priority: 'high',
      complexity: 'complex'
    },
    {
      id: 2,
      name: 'Image Recognition v2',
      developer: 'bob.eth',
      category: 'Computer Vision',
      submittedAt: '2024-01-14',
      priority: 'medium',
      complexity: 'standard'
    },
    {
      id: 3,
      name: 'Audio Classifier',
      developer: 'charlie.eth',
      category: 'Audio',
      submittedAt: '2024-01-13',
      priority: 'low',
      complexity: 'simple'
    }
  ];

  const recentValidations = [
    {
      id: 1,
      name: 'GPT-4 Clone',
      status: 'approved',
      completedAt: '2024-01-12',
      earnings: '0.05 ETH'
    },
    {
      id: 2,
      name: 'Image Classifier Pro',
      status: 'rejected',
      completedAt: '2024-01-11',
      earnings: '0 ETH'
    },
    {
      id: 3,
      name: 'Text Summarizer',
      status: 'approved',
      completedAt: '2024-01-10',
      earnings: '0.03 ETH'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Validator Dashboard</h1>
          <p className="text-secondary-600">Review and validate AI models for the marketplace</p>
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
                    <p className="text-sm text-secondary-500">{stat.change}</p>
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
        {/* Pending Models */}
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <Card.Title>Pending Validations</Card.Title>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={filter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button 
                  size="sm" 
                  variant={filter === 'urgent' ? 'primary' : 'outline'}
                  onClick={() => setFilter('urgent')}
                >
                  Urgent
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {pendingModels.map(model => (
                <div key={model.id} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-secondary-900">{model.name}</h4>
                      <p className="text-sm text-secondary-600">by {model.developer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={getPriorityColor(model.priority)} size="sm">
                        {model.priority}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {model.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-secondary-600">
                      Submitted: {new Date(model.submittedAt).toLocaleDateString()}
                    </div>
                    <Button size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Recent Validations */}
        <Card>
          <Card.Header>
            <Card.Title>Recent Validations</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {recentValidations.map(validation => (
                <div key={validation.id} className="flex items-center justify-between py-3 border-b border-secondary-100 last:border-0">
                  <div className="flex items-center gap-3">
                    {validation.status === 'approved' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-secondary-900">{validation.name}</p>
                      <p className="text-sm text-secondary-600">
                        {new Date(validation.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(validation.status)} size="sm">
                      {validation.status}
                    </Badge>
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      {validation.earnings}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Validation Progress */}
      <Card>
        <Card.Header>
          <Card.Title>Validation Progress</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Weekly Goals</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Models Reviewed</span>
                    <span>12/15</span>
                  </div>
                  <Progress value={80} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quality Score</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Category Distribution</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Language Models</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Computer Vision</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Other</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-secondary-900 mb-4">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy Rate</span>
                    <span>98.5%</span>
                  </div>
                  <Progress value={98.5} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} />
                </div>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Dashboard;