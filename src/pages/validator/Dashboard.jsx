import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import { useWallet } from '../../contexts/WalletContext';
import { useModel } from '../../contexts/ModelContext';
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const { chainId } = useWallet();
  const { models, loading, loadModels } = useModel();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001', '31337'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);

  const validationRecords = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('validator_validation_records') || '[]');
    } catch {
      return [];
    }
  }, [models]);

  const pendingModels = useMemo(() => {
    const pending = (models || []).filter((m) => m.status === 'pending');
    return pending.map((m) => ({
      id: m.id,
      name: m.name,
      developer: m.owner ? `${m.owner.slice(0, 6)}...${m.owner.slice(-4)}` : 'Unknown',
      priority: (m.downloads || 0) > 100 ? 'high' : (m.downloads || 0) > 20 ? 'medium' : 'low',
      category: m.category,
      submittedAt: m.updatedAt || m.createdAt,
    }));
  }, [models]);

  const filteredPendingModels = useMemo(() => {
    if (filter !== 'urgent') return pendingModels;
    return pendingModels.filter((m) => m.priority === 'high');
  }, [pendingModels, filter]);

  const recentValidations = useMemo(() => {
    return [...validationRecords]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 8)
      .map((v) => ({
        id: v.id,
        name: v.modelName,
        status: v.decision === 'approve' ? 'approved' : 'rejected',
        completedAt: v.completedAt,
        earnings: `0 ${currency}`,
      }));
  }, [validationRecords, currency]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  const stats = [
    {
      title: 'Models Validated',
      value: validationRecords.length.toString(),
      change: '--',
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      title: 'Pending Reviews',
      value: pendingModels.length.toString(),
      change: '--',
      icon: ClockIcon,
      color: 'yellow'
    },
    {
      title: 'Earnings',
      value: `0 ${currency}`,
      change: '--',
      icon: CurrencyDollarIcon,
      color: 'blue'
    },
    {
      title: 'Accuracy Score',
      value: validationRecords.length > 0
        ? `${Math.round((validationRecords.filter((v) => v.decision === 'approve').length / validationRecords.length) * 100)}%`
        : '--',
      change: '--',
      icon: ChartBarIcon,
      color: 'purple'
    }
  ];

  // Compute real stats for progress card
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  weekStart.setHours(0, 0, 0, 0);
  const weeklyReviewed = validationRecords.filter(v => new Date(v.completedAt) >= weekStart).length;
  const totalValidated = validationRecords.length;
  const approvedCount = validationRecords.filter(v => v.decision === 'approve').length;
  const approvalRate = totalValidated > 0 ? Math.round((approvedCount / totalValidated) * 100) : 0;

  // Category distribution from reviewed models
  const categoryMap = validationRecords.reduce((acc, v) => {
    const cat = v.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const categoryEntries = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => ({
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
      pct: totalValidated > 0 ? Math.round((count / totalValidated) * 100) : 0
    }));

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
        <ShieldCheckIcon className="h-8 w-8 text-primary-400" />
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary">Validator Dashboard</h1>
          <p className="text-dark-text-tertiary">Review and validate AI models for the marketplace</p>
        </div>
      </div>

      <Card>
        <Card.Content className="py-3">
          <p className="text-sm text-dark-text-tertiary">
            Queue/review actions are functional. Weekly goals, category distribution, and performance percentages below are sample placeholders.
          </p>
        </Card.Content>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          const iconBgMap = { green: 'bg-green-500/10', yellow: 'bg-yellow-500/10', blue: 'bg-blue-500/10', purple: 'bg-purple-500/10' };
          const iconTextMap = { green: 'text-green-400', yellow: 'text-yellow-400', blue: 'text-blue-400', purple: 'text-purple-400' };
          return (
            <Card key={index}>
              <Card.Content className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-dark-text-tertiary">{stat.title}</p>
                    <p className="text-2xl font-bold text-dark-text-primary">{stat.value}</p>
                    <p className="text-sm text-dark-text-muted">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${iconBgMap[stat.color] || 'bg-primary-500/10'}`}>
                    <IconComponent className={`h-6 w-6 ${iconTextMap[stat.color] || 'text-primary-400'}`} />
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
              {loading && (
                <p className="text-dark-text-tertiary">Loading queue...</p>
              )}
              {!loading && filteredPendingModels.length === 0 && (
                <p className="text-dark-text-tertiary">No pending models in queue.</p>
              )}
              {filteredPendingModels.map(model => (
                <div key={model.id} className="border border-dark-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-dark-text-primary">{model.name}</h4>
                      <p className="text-sm text-dark-text-tertiary">by {model.developer}</p>
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
                    <div className="text-sm text-dark-text-tertiary">
                      Submitted: {new Date(model.submittedAt).toLocaleDateString()}
                    </div>
                    <Button size="sm" onClick={() => navigate(`/validator/review/${model.id}`)}>
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
              {recentValidations.length === 0 && (
                <p className="text-dark-text-tertiary">No completed validations yet.</p>
              )}
              {recentValidations.map(validation => (
                <div key={validation.id} className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
                  <div className="flex items-center gap-3">
                    {validation.status === 'approved' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-dark-text-primary">{validation.name}</p>
                      <p className="text-sm text-dark-text-tertiary">
                        {new Date(validation.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusColor(validation.status)} size="sm">
                      {validation.status}
                    </Badge>
                    <p className="text-sm font-medium text-primary-400 mt-1">
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
              <h4 className="font-medium text-dark-text-primary mb-4">This Week</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Models Reviewed</span>
                    <span>{weeklyReviewed}</span>
                  </div>
                  <Progress value={Math.min(weeklyReviewed * 10, 100)} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Approval Rate</span>
                    <span>{approvalRate}%</span>
                  </div>
                  <Progress value={approvalRate} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-dark-text-primary mb-4">Category Distribution</h4>
              <div className="space-y-3">
                {categoryEntries.length === 0 ? (
                  <p className="text-dark-text-tertiary text-sm">No validations yet.</p>
                ) : categoryEntries.map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-dark-text-primary mb-4">Performance Metrics</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Approved</span>
                    <span>{approvedCount}</span>
                  </div>
                  <Progress value={approvalRate} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Rejected</span>
                    <span>{totalValidated - approvedCount}</span>
                  </div>
                  <Progress value={totalValidated > 0 ? 100 - approvalRate : 0} />
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