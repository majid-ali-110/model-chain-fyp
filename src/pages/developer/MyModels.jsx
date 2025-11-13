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
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';

const MyModels = () => {
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

  // Mock stats data
  const [stats] = useState({
    totalModels: 15,
    totalDownloads: 125430,
    totalRevenue: 2485.67,
    avgRating: 4.6,
    monthlyGrowth: {
      models: 12.5,
      downloads: 24.8,
      revenue: 18.3,
      rating: 0.2
    }
  });

  // Load models data
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockModels = [
        {
          id: 1,
          name: 'GPT-4 Fine-tuned Classifier',
          description: 'Advanced text classification model fine-tuned on domain-specific data',
          category: 'text',
          status: 'published',
          version: '2.1.0',
          downloads: 15420,
          revenue: 892.50,
          rating: 4.8,
          reviews: 156,
          likes: 89,
          createdAt: '2024-08-15T10:30:00Z',
          updatedAt: '2024-09-22T14:45:00Z',
          price: 25.00,
          pricingModel: 'one-time',
          framework: 'Hugging Face',
          size: '2.1 GB',
          license: 'MIT',
          tags: ['nlp', 'classification', 'transformer'],
          performance: { accuracy: '94.2%', speed: '12ms' },
          monthlyStats: {
            downloads: 1240,
            revenue: 156.75,
            growth: 15.2
          }
        },
        {
          id: 2,
          name: 'Custom Object Detection',
          description: 'YOLOv8-based object detection model for retail environments',
          category: 'image',
          status: 'published',
          version: '1.0.3',
          downloads: 8930,
          revenue: 445.20,
          rating: 4.5,
          reviews: 82,
          likes: 67,
          createdAt: '2024-07-10T16:20:00Z',
          updatedAt: '2024-09-15T11:30:00Z',
          price: 0,
          pricingModel: 'free',
          framework: 'PyTorch',
          size: '156 MB',
          license: 'Apache 2.0',
          tags: ['computer-vision', 'object-detection', 'yolo'],
          performance: { accuracy: '91.8%', speed: '45ms' },
          monthlyStats: {
            downloads: 920,
            revenue: 0,
            growth: -2.1
          }
        },
        {
          id: 3,
          name: 'Speech Recognition API',
          description: 'Real-time speech-to-text model optimized for multiple languages',
          category: 'audio',
          status: 'published',
          version: '3.2.1',
          downloads: 12350,
          revenue: 678.90,
          rating: 4.7,
          reviews: 124,
          likes: 98,
          createdAt: '2024-06-20T09:15:00Z',
          updatedAt: '2024-09-28T16:20:00Z',
          price: 0.05,
          pricingModel: 'usage-based',
          framework: 'TensorFlow',
          size: '890 MB',
          license: 'Commercial',
          tags: ['speech', 'asr', 'multilingual'],
          performance: { accuracy: '96.1%', speed: '250ms' },
          monthlyStats: {
            downloads: 1850,
            revenue: 298.45,
            growth: 28.7
          }
        },
        {
          id: 4,
          name: 'Video Content Analyzer',
          description: 'Multi-modal video analysis for content moderation and insights',
          category: 'video',
          status: 'draft',
          version: '0.9.0',
          downloads: 0,
          revenue: 0,
          rating: 0,
          reviews: 0,
          likes: 0,
          createdAt: '2024-09-30T14:00:00Z',
          updatedAt: '2024-10-02T10:30:00Z',
          price: 45.00,
          pricingModel: 'subscription',
          framework: 'PyTorch',
          size: '3.2 GB',
          license: 'Proprietary',
          tags: ['video-analysis', 'content-moderation', 'multimodal'],
          performance: { accuracy: '89.5%', speed: '2.1s' },
          monthlyStats: {
            downloads: 0,
            revenue: 0,
            growth: 0
          }
        },
        {
          id: 5,
          name: 'Sentiment Analysis Pro',
          description: 'Enterprise-grade sentiment analysis with emotion detection',
          category: 'text',
          status: 'published',
          version: '1.5.2',
          downloads: 22100,
          revenue: 1284.30,
          rating: 4.9,
          reviews: 203,
          likes: 145,
          createdAt: '2024-05-12T08:45:00Z',
          updatedAt: '2024-09-20T13:15:00Z',
          price: 15.99,
          pricingModel: 'subscription',
          framework: 'Scikit-learn',
          size: '45 MB',
          license: 'MIT',
          tags: ['sentiment', 'emotion', 'text-analysis'],
          performance: { accuracy: '97.3%', speed: '5ms' },
          monthlyStats: {
            downloads: 2890,
            revenue: 445.67,
            growth: 19.8
          }
        },
        {
          id: 6,
          name: 'Recommendation Engine',
          description: 'Collaborative filtering recommendation system',
          category: 'recommendation',
          status: 'under-review',
          version: '2.0.0',
          downloads: 0,
          revenue: 0,
          rating: 0,
          reviews: 0,
          likes: 0,
          createdAt: '2024-09-25T11:20:00Z',
          updatedAt: '2024-10-01T09:45:00Z',
          price: 89.99,
          pricingModel: 'one-time',
          framework: 'TensorFlow',
          size: '1.8 GB',
          license: 'Commercial',
          tags: ['recommendation', 'collaborative-filtering', 'ml'],
          performance: { accuracy: '92.7%', speed: '150ms' },
          monthlyStats: {
            downloads: 0,
            revenue: 0,
            growth: 0
          }
        }
      ];

      setModels(mockModels);
      setFilteredModels(mockModels);
      setIsLoading(false);
    };

    loadModels();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...models];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
          bValue = b.updatedAt;
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
    return new Date(dateString).toLocaleDateString('en-US', {
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
  const handleModelAction = (action, modelId) => {
    console.log(`Action: ${action} for model: ${modelId}`);
    setActionMenuOpen(null);
    // Implement action logic here
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for models:`, selectedModels);
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

  // Stats Cards Component
  const StatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Models</p>
            <p className="text-2xl font-bold text-white">{stats.totalModels}</p>
          </div>
          <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <CpuChipIcon className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{stats.monthlyGrowth.models}%</span>
          <span className="text-sm text-gray-400 ml-1">vs last month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Downloads</p>
            <p className="text-2xl font-bold text-white">{formatNumber(stats.totalDownloads)}</p>
          </div>
          <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <ArrowDownTrayIcon className="h-6 w-6 text-green-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{stats.monthlyGrowth.downloads}%</span>
          <span className="text-sm text-gray-400 ml-1">vs last month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <CurrencyDollarIcon className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{stats.monthlyGrowth.revenue}%</span>
          <span className="text-sm text-gray-400 ml-1">vs last month</span>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Avg Rating</p>
            <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
          </div>
          <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <StarIcon className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <ArrowTrendingUpIcon className="h-4 w-4 text-green-400 mr-1" />
          <span className="text-sm text-green-400">+{stats.monthlyGrowth.rating}%</span>
          <span className="text-sm text-gray-400 ml-1">vs last month</span>
        </div>
      </Card>
    </div>
  );

  // Filters Component
  const Filters = () => (
    <Card className={clsx('mb-6 transition-all duration-200', showFilters ? 'p-6' : 'p-0 h-0 overflow-hidden')}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
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
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedModels.length === filteredModels.length && filteredModels.length > 0}
                  onChange={() => selectedModels.length === filteredModels.length ? clearSelection() : selectAllModels()}
                  className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Downloads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredModels.map((model) => {
              const CategoryIcon = getCategoryIcon(model.category);
              return (
                <tr
                  key={model.id}
                  className={clsx(
                    'hover:bg-gray-800/50 transition-colors',
                    selectedModels.includes(model.id) && 'bg-blue-500/10'
                  )}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModelSelection(model.id)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link
                          to={`/marketplace/model/${model.id}`}
                          className="text-sm font-medium text-white hover:text-blue-400 transition-colors"
                        >
                          {model.name}
                        </Link>
                        <p className="text-sm text-gray-400 truncate max-w-xs">
                          {model.description}
                        </p>
                        <div className="flex items-center mt-1">
                          <Badge variant="outline" size="sm" className="mr-2">
                            v{model.version}
                          </Badge>
                          <span className="text-xs text-gray-500">{model.framework}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusColor(model.status)}>
                      {model.status.replace('-', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{formatNumber(model.downloads)}</div>
                    <div className="text-xs text-gray-400">
                      {model.monthlyStats.growth > 0 ? '+' : ''}{model.monthlyStats.growth}% this month
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{formatCurrency(model.revenue)}</div>
                    <div className="text-xs text-gray-400">
                      {formatCurrency(model.monthlyStats.revenue)} this month
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-white">{model.rating || 'N/A'}</span>
                      {model.reviews > 0 && (
                        <span className="text-xs text-gray-400 ml-1">({model.reviews})</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {formatDate(model.updatedAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuOpen(actionMenuOpen === model.id ? null : model.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                      
                      {actionMenuOpen === model.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleModelAction('view', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                              <EyeIcon className="h-4 w-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleModelAction('edit', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Edit Model
                            </button>
                            <button
                              onClick={() => handleModelAction('analytics', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                              <ChartBarIcon className="h-4 w-4 mr-2" />
                              Analytics
                            </button>
                            <button
                              onClick={() => handleModelAction('share', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                            >
                              <ShareIcon className="h-4 w-4 mr-2" />
                              Share
                            </button>
                            <div className="border-t border-gray-700 my-1"></div>
                            {model.status === 'published' && (
                              <button
                                onClick={() => handleModelAction('pause', model.id)}
                                className="w-full text-left px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 flex items-center"
                              >
                                <PauseIcon className="h-4 w-4 mr-2" />
                                Pause Sales
                              </button>
                            )}
                            {model.status === 'draft' && (
                              <button
                                onClick={() => handleModelAction('publish', model.id)}
                                className="w-full text-left px-4 py-2 text-sm text-green-400 hover:bg-gray-700 flex items-center"
                              >
                                <PlayIcon className="h-4 w-4 mr-2" />
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleModelAction('delete', model.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
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
                <div className="h-12 w-12 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <CategoryIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => toggleModelSelection(model.id)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setActionMenuOpen(actionMenuOpen === model.id ? null : model.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <EllipsisHorizontalIcon className="h-5 w-5" />
                </button>
                
                {actionMenuOpen === model.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => handleModelAction('view', model.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleModelAction('edit', model.id)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Model
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <Link
                to={`/marketplace/model/${model.id}`}
                className="text-lg font-semibold text-white hover:text-blue-400 transition-colors"
              >
                {model.name}
              </Link>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                {model.description}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Badge variant={getStatusColor(model.status)}>
                {model.status.replace('-', ' ')}
              </Badge>
              <Badge variant="outline" size="sm">
                v{model.version}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Downloads</p>
                <p className="text-sm font-medium text-white">{formatNumber(model.downloads)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Revenue</p>
                <p className="text-sm font-medium text-white">{formatCurrency(model.revenue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Rating</p>
                <div className="flex items-center">
                  <StarSolidIcon className="h-3 w-3 text-yellow-400 mr-1" />
                  <p className="text-sm font-medium text-white">{model.rating || 'N/A'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Updated</p>
                <p className="text-sm font-medium text-white">{formatDate(model.updatedAt)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {model.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
                {model.tags.length > 2 && (
                  <Badge variant="secondary" size="sm">
                    +{model.tags.length - 2}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleModelAction('view', model.id)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleModelAction('edit', model.id)}
                  className="text-gray-400 hover:text-white transition-colors"
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
          <p className="text-gray-400">Manage your published AI models and track performance</p>
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
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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
                <span className="text-sm text-gray-400">{selectedModels.length} selected</span>
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
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                )}
              >
                <Bars3Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={clsx(
                  'p-2 rounded transition-colors',
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
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
          <p className="text-gray-400">
            Showing {filteredModels.length} of {models.length} models
          </p>
        </div>

        {/* Content */}
        {filteredModels.length === 0 ? (
          <Card className="p-12 text-center">
            <CpuChipIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No models found</h3>
            <p className="text-gray-400 mb-6">
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
    </div>
  );
};

export default MyModels;