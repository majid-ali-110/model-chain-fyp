import React, { useState, useEffect } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  StarIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  CpuChipIcon,
  AcademicCapIcon,
  BeakerIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  Bars3Icon,
  Squares2X2Icon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useModel } from '../../contexts/ModelContext';
import { useNotification } from '../../contexts/NotificationContext';

const normalizeModel = (model = {}, index = 0) => {
  const safeStatus = typeof model.status === 'string' && model.status.trim()
    ? model.status
    : 'draft';

  return {
    ...model,
    id: model.id ?? model.tokenId ?? `model-${index}`,
    name: typeof model.name === 'string' && model.name.trim() ? model.name : 'Untitled Model',
    description: typeof model.description === 'string' ? model.description : '',
    category: typeof model.category === 'string' && model.category.trim() ? model.category : 'other',
    status: safeStatus,
    statusLabel: safeStatus.replace(/-/g, ' '),
    tags: Array.isArray(model.tags) ? model.tags : [],
    version: typeof model.version === 'string' && model.version.trim() ? model.version : '1.0.0',
    framework: typeof model.framework === 'string' && model.framework.trim() ? model.framework : 'Unknown',
    downloads: Number.isFinite(Number(model.downloads)) ? Number(model.downloads) : 0,
    revenue: Number.isFinite(Number(model.revenue)) ? Number(model.revenue) : 0,
    rating: Number.isFinite(Number(model.rating)) ? Number(model.rating) : 0,
    reviews: Number.isFinite(Number(model.reviews)) ? Number(model.reviews) : 0,
    price: model.price ?? '0',
    createdAt: model.createdAt || new Date(0).toISOString(),
    updatedAt: model.updatedAt || model.createdAt || new Date(0).toISOString(),
    monthlyStats: {
      growth: Number.isFinite(Number(model?.monthlyStats?.growth)) ? Number(model.monthlyStats.growth) : 0,
      revenue: Number.isFinite(Number(model?.monthlyStats?.revenue)) ? Number(model.monthlyStats.revenue) : 0,
    },
  };
};

const MyModels = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { isAuthenticated } = useAuth();
  const { userModels: contextUserModels, earnings } = useUser();
  const { delistModel, listModelForSale, patchModelLabels, getModelById } = useModel();
  const { showSuccess, showError, showWarning } = useNotification();
  
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('table'); // table or grid
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModels, setSelectedModels] = useState([]);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // Labels edit modal
  const [labelsModal, setLabelsModal] = useState({ open: false, model: null });
  const [labelsForm, setLabelsForm] = useState({ classLabels: '', featureNames: '' });

  // Stats computed from context
  const stats = {
    totalModels: contextUserModels?.length || 0,
    totalDownloads: contextUserModels?.reduce((sum, m) => sum + (m.downloads || 0), 0) || 0,
    totalRevenue: earnings?.total || 0,
    avgRating: contextUserModels?.length > 0 
      ? (contextUserModels.reduce((sum, m) => sum + (m.rating || 0), 0) / contextUserModels.length).toFixed(1)
      : 0,
    monthlyGrowth: {
      models: 0,
      downloads: 0,
      revenue: 0,
      rating: 0
    }
  };

  // Load models data from context
  useEffect(() => {
    if (!connected || !isAuthenticated) {
      navigate('/connect-wallet');
      return;
    }
    
    const loadModels = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Use models from context (empty if none)
      const userModels = (contextUserModels || []).map((model, index) => normalizeModel(model, index));
      setModels(userModels);
      setFilteredModels(userModels);
      setIsLoading(false);
    };

    loadModels();
  }, [connected, isAuthenticated, navigate, contextUserModels]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...models];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(model =>
        (model.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (model.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(model => model.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(model => model.status === selectedStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'downloads':
          aValue = a.downloads;
          bValue = b.downloads;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updated':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredModels(filtered);
  }, [models, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: CpuChipIcon },
    { value: 'text', label: 'Text & NLP', icon: DocumentTextIcon },
    { value: 'image', label: 'Computer Vision', icon: PhotoIcon },
    { value: 'audio', label: 'Audio Processing', icon: SpeakerWaveIcon },
    { value: 'video', label: 'Video Analysis', icon: VideoCameraIcon },
    { value: 'recommendation', label: 'Recommendation', icon: ChartBarIcon }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'archived', label: 'Archived' }
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'updated', label: 'Last Updated' },
    { value: 'name', label: 'Name' },
    { value: 'downloads', label: 'Downloads' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'rating', label: 'Rating' }
  ];

  // Helper functions
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'text': return DocumentTextIcon;
      case 'image': return PhotoIcon;
      case 'audio': return SpeakerWaveIcon;
      case 'video': return VideoCameraIcon;
      case 'recommendation': return ChartBarIcon;
      default: return CpuChipIcon;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      case 'under-review': return 'warning';
      case 'rejected': return 'danger';
      case 'archived': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Actions
  const handleModelAction = async (action, modelId) => {
    setActionMenuOpen(null);
    const model = models.find((m) => m.id === modelId);

    if (!model) {
      showError('Model not found.', { title: 'Action Failed' });
      return;
    }

    try {
      switch (action) {
        case 'view':
          navigate(`/marketplace/models/${modelId}`);
          break;
        case 'edit':
          navigate(`/developer/upload?edit=${modelId}`);
          break;
        case 'edit-labels': {
          // Get full model (with metadataHash / classLabels) from ModelContext
          const fullModel = getModelById(modelId) || model;
          setLabelsForm({
            classLabels: fullModel.classLabels || '',
            featureNames: fullModel.featureNames || '',
          });
          setLabelsModal({ open: true, model: fullModel });
          break;
        }
        case 'share': {
          const shareUrl = `${window.location.origin}/marketplace/models/${modelId}`;
          await navigator.clipboard.writeText(shareUrl);
          showSuccess('Model link copied to clipboard.', { title: 'Link Copied' });
          break;
        }
        case 'pause': {
          const result = await delistModel(modelId);
          if (!result.success) throw new Error(result.error || 'Failed to pause sales');
          showSuccess('Sales paused (listing removed).', { title: 'Model Updated' });
          break;
        }
        case 'publish': {
          const result = await listModelForSale(modelId, parseFloat(model.price || '0.001'), 300, 1000);
          if (!result.success) throw new Error(result.error || 'Failed to publish model');
          showSuccess('Model listed for sale.', { title: 'Model Published' });
          break;
        }
        case 'delete': {
          const result = await delistModel(modelId);
          if (!result.success) throw new Error(result.error || 'Failed to delist model');
          setModels((prev) => prev.filter((m) => m.id !== modelId));
          showSuccess('Model removed from your dashboard listing.', { title: 'Model Removed' });
          break;
        }
        default:
          break;
      }
    } catch (error) {
      showError(error.message || 'Action failed. Please try again.', { title: 'Action Failed' });
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedModels.length === 0) return;

    if (action === 'archive') {
      showWarning('Archive is currently a local-only marker and not yet on-chain.', { title: 'Not Fully Available' });
      setSelectedModels([]);
      return;
    }

    try {
      if (action === 'publish') {
        for (const id of selectedModels) {
          const model = models.find((m) => m.id === id);
          await listModelForSale(id, parseFloat(model?.price || '0.001'), 300, 1000);
        }
        showSuccess(`Published ${selectedModels.length} model(s).`, { title: 'Bulk Publish Complete' });
      }

      if (action === 'delete') {
        for (const id of selectedModels) {
          await delistModel(id);
        }
        setModels((prev) => prev.filter((m) => !selectedModels.includes(m.id)));
        showSuccess(`Removed ${selectedModels.length} model(s).`, { title: 'Bulk Delete Complete' });
      }
    } catch (error) {
      showError(error.message || 'Bulk action failed.', { title: 'Bulk Action Failed' });
    }

    setSelectedModels([]);
  };

  const toggleModelSelection = (modelId) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const selectAllModels = () => {
    setSelectedModels(filteredModels.map(model => model.id));
  };

  const clearSelection = () => {
    setSelectedModels([]);
  };

  const handleSaveLabels = () => {
    if (!labelsModal.model) return;
    const result = patchModelLabels(
      labelsModal.model.id,
      labelsForm.classLabels.trim(),
      labelsForm.featureNames.trim()
    );
    if (result.success) {
      // Also update local display models list
      setModels(prev =>
        prev.map(m =>
          m.id === labelsModal.model.id
            ? { ...m, classLabels: labelsForm.classLabels.trim(), featureNames: labelsForm.featureNames.trim() }
            : m
        )
      );
      showSuccess('Class labels saved. They will appear in sandbox results immediately.', { title: 'Labels Updated' });
    } else {
      showError(result.error || 'Failed to save labels.', { title: 'Save Failed' });
    }
    setLabelsModal({ open: false, model: null });
  };

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-muted">Total Models</p>
            <p className="text-2xl font-bold text-white">{stats.totalModels}</p>
          </div>
          <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <CpuChipIcon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-muted">Total Downloads</p>
            <p className="text-2xl font-bold text-white">{formatNumber(stats.totalDownloads)}</p>
          </div>
          <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <ArrowDownTrayIcon className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-muted">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-muted">Avg Rating</p>
            <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
          </div>
          <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <StarIcon className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </Card>
    </div>
  );

  // Filters Component
  const Filters = () => (
    <Card className={clsx('mb-6 transition-all duration-200', showFilters ? 'p-6' : 'p-0 h-0 overflow-hidden')}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-2">Sort By</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-dark-text-secondary hover:text-white transition-colors"
            >
              {sortOrder === 'asc' ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Table View Component
  const TableView = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-surface-elevated">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedModels.length === filteredModels.length && filteredModels.length > 0}
                  onChange={() => selectedModels.length === filteredModels.length ? clearSelection() : selectAllModels()}
                  className="rounded border-dark-border-light bg-dark-border text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-dark-text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {filteredModels.map((model) => {
              const CategoryIcon = getCategoryIcon(model.category);
              return (
                <tr
                  key={model.id}
                  className={clsx(
                    'hover:bg-dark-surface-elevated transition-colors',
                    selectedModels.includes(model.id) && 'bg-blue-500/10'
                  )}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModelSelection(model.id)}
                      className="rounded border-dark-border-light bg-dark-border text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 bg-dark-border rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-dark-text-muted" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/marketplace/models/${model.id}`}
                          className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {model.name}
                        </Link>
                        <p className="text-sm text-dark-text-muted truncate max-w-xs">
                          {model.description}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" size="sm" className="mr-2">
                            v{model.version}
                          </Badge>
                          <span className="text-xs text-dark-text-muted">{model.framework}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(model.status)}>
                      {model.statusLabel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{formatNumber(model.downloads)}</div>
                    <div className="text-xs text-dark-text-muted">
                      {model.monthlyStats?.growth > 0 ? '+' : ''}{model.monthlyStats?.growth || 0}% this month
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{formatCurrency(model.revenue || 0)}</div>
                    <div className="text-xs text-dark-text-muted">
                      {formatCurrency(model.monthlyStats?.revenue || 0)} this month
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-white">{model.rating || 'N/A'}</span>
                      {model.reviews > 0 && (
                        <span className="text-xs text-dark-text-muted ml-1">({model.reviews})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-text-muted">
                    {formatDate(model.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === model.id ? null : model.id)}
                        className="text-dark-text-muted hover:text-white transition-colors"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      
                      {actionMenuOpen === model.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-dark-surface rounded-lg shadow-xl border border-dark-border z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleModelAction('view', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleModelAction('edit', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit Model
                            </button>
                            <button
                              onClick={() => handleModelAction('edit-labels', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                            >
                              <TagIcon className="h-4 w-4 mr-2" />
                              Edit Labels
                            </button>
                            <button
                              onClick={() => handleModelAction('share', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                            >
                              <ShareIcon className="h-4 w-4 mr-2" />
                              Share
                            </button>
                            <div className="border-t border-dark-border my-1"></div>
                            {model.status === 'published' && (
                              <button
                                onClick={() => handleModelAction('pause', model.id)}
                                className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-dark-border flex items-center"
                              >
                                <PauseIcon className="h-4 w-4 mr-2" />
                                Pause Sales
                              </button>
                            )}
                            {model.status === 'draft' && (
                              <button
                                onClick={() => handleModelAction('publish', model.id)}
                                className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-dark-border flex items-center"
                              >
                                <PlayIcon className="h-4 w-4 mr-2" />
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleModelAction('delete', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-dark-border hover:text-red-300 flex items-center"
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredModels.map((model) => {
        const CategoryIcon = getCategoryIcon(model.category);
        return (
          <Card key={model.id} className="p-6 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-dark-border rounded-lg flex items-center justify-center mr-3">
                  <CategoryIcon className="h-6 w-6 text-dark-text-muted" />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => toggleModelSelection(model.id)}
                    className="rounded border-dark-border-light bg-dark-border text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActionMenuOpen(actionMenuOpen === model.id ? null : model.id)}
                  className="text-dark-text-muted hover:text-white transition-colors"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
                
                {actionMenuOpen === model.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-surface rounded-lg shadow-xl border border-dark-border z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleModelAction('view', model.id)}
                        className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleModelAction('edit', model.id)}
                        className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Model
                      </button>
                      <button
                        onClick={() => handleModelAction('edit-labels', model.id)}
                        className="w-full text-left px-4 py-2 text-sm text-dark-text-secondary hover:bg-dark-border hover:text-white flex items-center"
                      >
                        <TagIcon className="h-4 w-4 mr-2" />
                        Edit Labels
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <Link
                to={`/marketplace/models/${model.id}`}
                className="text-lg font-semibold text-white hover:text-blue-400 transition-colors"
              >
                {model.name}
              </Link>
              <p className="text-dark-text-muted text-sm mt-1 line-clamp-2">
                {model.description}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge variant={getStatusColor(model.status)}>
                {model.statusLabel}
              </Badge>
              <Badge variant="outline" size="sm">
                v{model.version}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-dark-text-muted">Downloads</p>
                <p className="text-sm font-medium text-white">{formatNumber(model.downloads)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-text-muted">Revenue</p>
                <p className="text-sm font-medium text-white">{formatCurrency(model.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-text-muted">Rating</p>
                <div className="flex items-center">
                  <StarSolidIcon className="h-3 w-3 text-yellow-400 mr-1" />
                  <p className="text-sm font-medium text-white">{model.rating || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-dark-text-muted">Updated</p>
                <p className="text-sm font-medium text-white">{formatDate(model.updatedAt)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {(model.tags || []).slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
                {(model.tags || []).length > 2 && (
                  <Badge variant="secondary" size="sm">
                    +{(model.tags || []).length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleModelAction('view', model.id)}
                  className="text-dark-text-muted hover:text-white transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleModelAction('edit', model.id)}
                  className="text-dark-text-muted hover:text-white transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Models</h1>
          <p className="text-dark-text-muted">Manage your published AI models and track performance</p>
        </div>
        <Link to="/developer/upload">
          <Button>
            <PlusIcon className="h-5 w-5 mr-2" />
            Upload New Model
          </Button>
        </Link>
      </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Bulk Actions */}
            {selectedModels.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm text-dark-text-muted">{selectedModels.length} selected</span>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}>
                  Publish
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('archive')}>
                  Archive
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleBulkAction('delete')}>
                  Delete
                </Button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex bg-dark-surface rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-dark-text-muted hover:text-white'
                )}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-dark-text-muted hover:text-white'
                )}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Filters />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-dark-text-muted">
            Showing {filteredModels.length} of {models.length} models
          </p>
        </div>

        {/* Content */}
        {filteredModels.length === 0 ? (
          <Card className="p-12 text-center">
            <CpuChipIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No models found</h3>
            <p className="text-dark-text-muted mb-6">
              {models.length === 0 
                ? "You haven't uploaded any models yet. Get started by uploading your first model."
                : "No models match your current filters. Try adjusting your search criteria."
              }
            </p>
            {models.length === 0 && (
              <Link to="/developer/upload">
                <Button>
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Upload Your First Model
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <>
            {viewMode === 'table' ? <TableView /> : <GridView />}
          </>
        )}
        {/* Edit Labels Modal */}
        {labelsModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-surface border border-dark-border rounded-2xl shadow-2xl w-full max-w-lg mx-4">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-dark-border">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-5 w-5 text-primary-400" />
                  <h2 className="text-lg font-semibold text-white">Edit Class Labels</h2>
                </div>
                <button
                  onClick={() => setLabelsModal({ open: false, model: null })}
                  className="text-dark-text-muted hover:text-white transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="px-6 py-5 space-y-5">
                <p className="text-sm text-dark-text-muted">
                  These labels replace raw class numbers (class_0, class_1 …) in sandbox output so buyers see
                  human-readable results like <span className="text-white font-medium">Has Mask</span> or{' '}
                  <span className="text-white font-medium">Female</span>.
                </p>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Class Labels
                    <span className="text-dark-text-muted font-normal ml-2">(comma-separated, in class order)</span>
                  </label>
                  <input
                    type="text"
                    value={labelsForm.classLabels}
                    onChange={e => setLabelsForm(f => ({ ...f, classLabels: e.target.value }))}
                    placeholder="e.g. no_mask, has_mask   or   male, female   or   cat, dog, bird"
                    className="w-full bg-dark-bg-primary border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                  {labelsForm.classLabels && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {labelsForm.classLabels.split(',').map((l, i) => l.trim() && (
                        <span key={i} className="px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 text-xs font-medium border border-primary-500/30">
                          {i}: {l.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                    Feature Names
                    <span className="text-dark-text-muted font-normal ml-2">(optional, for tabular models)</span>
                  </label>
                  <input
                    type="text"
                    value={labelsForm.featureNames}
                    onChange={e => setLabelsForm(f => ({ ...f, featureNames: e.target.value }))}
                    placeholder="e.g. age, income, credit_score"
                    className="w-full bg-dark-bg-primary border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-dark-border">
                <Button variant="outline" onClick={() => setLabelsModal({ open: false, model: null })}>
                  Cancel
                </Button>
                <Button onClick={handleSaveLabels}>
                  Save Labels
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default MyModels;