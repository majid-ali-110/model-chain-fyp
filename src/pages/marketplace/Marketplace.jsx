import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ViewColumnsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ChevronDownIcon,
  XMarkIcon,
  StarIcon,
  ClockIcon,
  TrendingUpIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserGroupIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  FireIcon,
  LightBulbIcon,
  CpuChipIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import ModelCard from '../../components/models/ModelCard';

const Marketplace = () => {
  // State management
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    priceRange: '',
    rating: '',
    sortBy: 'popular',
    modelTypes: [],
    providers: [],
    features: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreModels, setHasMoreModels] = useState(true);
  const [totalModels, setTotalModels] = useState(0);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);

  // Mock data for filters
  const filterOptions = {
    categories: [
      { id: 'text', name: 'Text Generation', icon: DocumentTextIcon, count: 248 },
      { id: 'image', name: 'Image Generation', icon: PhotoIcon, count: 156 },
      { id: 'audio', name: 'Audio Processing', icon: SpeakerWaveIcon, count: 89 },
      { id: 'video', name: 'Video Generation', icon: VideoCameraIcon, count: 45 },
      { id: 'analysis', name: 'Data Analysis', icon: ChartBarIcon, count: 127 },
      { id: 'translation', name: 'Translation', icon: DocumentTextIcon, count: 78 }
    ],
    modelTypes: [
      { id: 'transformer', name: 'Transformer', count: 180 },
      { id: 'diffusion', name: 'Diffusion', count: 120 },
      { id: 'gan', name: 'GAN', count: 95 },
      { id: 'cnn', name: 'CNN', count: 110 },
      { id: 'rnn', name: 'RNN', count: 85 }
    ],
    providers: [
      { id: 'openai', name: 'OpenAI', count: 25 },
      { id: 'anthropic', name: 'Anthropic', count: 18 },
      { id: 'huggingface', name: 'Hugging Face', count: 342 },
      { id: 'stability', name: 'Stability AI', count: 45 },
      { id: 'community', name: 'Community', count: 156 }
    ],
    features: [
      { id: 'fine-tunable', name: 'Fine-tunable', count: 234 },
      { id: 'real-time', name: 'Real-time', count: 145 },
      { id: 'batch-processing', name: 'Batch Processing', count: 189 },
      { id: 'api-access', name: 'API Access', count: 456 },
      { id: 'custom-training', name: 'Custom Training', count: 98 }
    ],
    priceRanges: [
      { id: 'free', name: 'Free', min: 0, max: 0 },
      { id: 'low', name: '$0.01 - $0.10', min: 0.01, max: 0.10 },
      { id: 'medium', name: '$0.11 - $1.00', min: 0.11, max: 1.00 },
      { id: 'high', name: '$1.01 - $10.00', min: 1.01, max: 10.00 },
      { id: 'premium', name: '$10.00+', min: 10.00, max: null }
    ],
    sortOptions: [
      { id: 'popular', name: 'Most Popular', icon: TrendingUpIcon },
      { id: 'newest', name: 'Newest First', icon: ClockIcon },
      { id: 'rating', name: 'Highest Rated', icon: StarIcon },
      { id: 'price-low', name: 'Price: Low to High', icon: CurrencyDollarIcon },
      { id: 'price-high', name: 'Price: High to Low', icon: CurrencyDollarIcon },
      { id: 'name', name: 'Name (A-Z)', icon: TagIcon }
    ]
  };

  // Generate mock models
  const generateMockModels = useCallback((page = 1, limit = 12) => {
    const modelTemplates = [
      {
        name: 'GPT-4 Turbo',
        description: 'Latest GPT-4 model with improved reasoning and multimodal capabilities',
        category: 'text',
        modelType: 'transformer',
        provider: 'openai',
        price: 0.03,
        rating: 4.9,
        reviews: 1250,
        downloads: 89000,
        features: ['fine-tunable', 'real-time', 'api-access'],
        isHot: true,
        isNew: false
      },
      {
        name: 'DALL-E 3',
        description: 'Advanced image generation with enhanced prompt understanding',
        category: 'image',
        modelType: 'diffusion',
        provider: 'openai',
        price: 0.08,
        rating: 4.8,
        reviews: 890,
        downloads: 67000,
        features: ['real-time', 'api-access'],
        isHot: true,
        isNew: false
      },
      {
        name: 'Claude 3 Opus',
        description: 'Most capable model for complex reasoning and analysis',
        category: 'text',
        modelType: 'transformer',
        provider: 'anthropic',
        price: 0.05,
        rating: 4.8,
        reviews: 756,
        downloads: 54000,
        features: ['fine-tunable', 'api-access', 'custom-training'],
        isHot: false,
        isNew: true
      },
      {
        name: 'Stable Diffusion XL',
        description: 'High-resolution image generation with artistic control',
        category: 'image',
        modelType: 'diffusion',
        provider: 'stability',
        price: 0.02,
        rating: 4.7,
        reviews: 2100,
        downloads: 156000,
        features: ['fine-tunable', 'batch-processing', 'custom-training'],
        isHot: false,
        isNew: false
      },
      {
        name: 'Whisper Large V3',
        description: 'State-of-the-art speech recognition and transcription',
        category: 'audio',
        modelType: 'transformer',
        provider: 'openai',
        price: 0.006,
        rating: 4.6,
        reviews: 432,
        downloads: 23000,
        features: ['real-time', 'batch-processing', 'api-access'],
        isHot: false,
        isNew: true
      },
      {
        name: 'LLaMA 2 70B',
        description: 'Open-source large language model for various tasks',
        category: 'text',
        modelType: 'transformer',
        provider: 'community',
        price: 0.0,
        rating: 4.5,
        reviews: 1890,
        downloads: 234000,
        features: ['fine-tunable', 'custom-training', 'batch-processing'],
        isHot: false,
        isNew: false
      }
    ];

    const models = [];
    const startIndex = (page - 1) * limit;
    
    for (let i = 0; i < limit; i++) {
      const template = modelTemplates[i % modelTemplates.length];
      const modelIndex = startIndex + i;
      
      models.push({
        id: `model-${modelIndex}`,
        ...template,
        name: `${template.name} ${Math.floor(modelIndex / 6) > 0 ? `v${Math.floor(modelIndex / 6) + 1}` : ''}`,
        price: template.price + (Math.random() * 0.01),
        rating: Math.max(3.5, template.rating - (Math.random() * 0.3)),
        reviews: template.reviews + Math.floor(Math.random() * 100),
        downloads: template.downloads + Math.floor(Math.random() * 1000),
        isNew: modelIndex < 6 && Math.random() > 0.7,
        isHot: Math.random() > 0.8
      });
    }
    
    return models;
  }, []);

  // Load initial models
  useEffect(() => {
    const loadInitialModels = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const initialModels = generateMockModels(1, 12);
      setModels(initialModels);
      setFilteredModels(initialModels);
      setTotalModels(156); // Mock total
      setIsLoading(false);
    };

    loadInitialModels();
  }, [generateMockModels]);

  // Infinite scroll setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreModels && !isLoadingMore) {
          loadMoreModels();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMoreModels, isLoadingMore, loadMoreModels]);

  // Load more models
  const loadMoreModels = useCallback(async () => {
    if (isLoadingMore || !hasMoreModels) return;

    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const nextPage = currentPage + 1;
    const newModels = generateMockModels(nextPage, 12);
    
    setModels(prev => [...prev, ...newModels]);
    setCurrentPage(nextPage);
    
    // Simulate reaching end of results
    if (models.length + newModels.length >= 156) {
      setHasMoreModels(false);
    }
    
    setIsLoadingMore(false);
  }, [isLoadingMore, hasMoreModels, currentPage, generateMockModels, models.length]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...models];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter(model =>
        selectedFilters.categories.includes(model.category)
      );
    }

    // Apply model type filter
    if (selectedFilters.modelTypes.length > 0) {
      filtered = filtered.filter(model =>
        selectedFilters.modelTypes.includes(model.modelType)
      );
    }

    // Apply provider filter
    if (selectedFilters.providers.length > 0) {
      filtered = filtered.filter(model =>
        selectedFilters.providers.includes(model.provider)
      );
    }

    // Apply features filter
    if (selectedFilters.features.length > 0) {
      filtered = filtered.filter(model =>
        selectedFilters.features.some(feature => model.features.includes(feature))
      );
    }

    // Apply price range filter
    if (selectedFilters.priceRange) {
      const priceRanges = [
        { id: 'free', name: 'Free', min: 0, max: 0 },
        { id: 'low', name: '$0.01 - $0.10', min: 0.01, max: 0.10 },
        { id: 'medium', name: '$0.11 - $1.00', min: 0.11, max: 1.00 },
        { id: 'high', name: '$1.01 - $10.00', min: 1.01, max: 10.00 },
        { id: 'premium', name: '$10.00+', min: 10.00, max: null }
      ];
      const priceRange = priceRanges.find(r => r.id === selectedFilters.priceRange);
      if (priceRange) {
        filtered = filtered.filter(model => {
          if (priceRange.max === null) {
            return model.price >= priceRange.min;
          }
          return model.price >= priceRange.min && model.price <= priceRange.max;
        });
      }
    }

    // Apply rating filter
    if (selectedFilters.rating) {
      const minRating = parseFloat(selectedFilters.rating);
      filtered = filtered.filter(model => model.rating >= minRating);
    }

    // Apply sorting
    switch (selectedFilters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.isNew - a.isNew);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popular
        filtered.sort((a, b) => b.downloads - a.downloads);
    }

    setFilteredModels(filtered);
  }, [models, searchQuery, selectedFilters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      if (filterType === 'categories' || filterType === 'modelTypes' || filterType === 'providers' || filterType === 'features') {
        const currentValues = prev[filterType];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [filterType]: newValues };
      }
      return { ...prev, [filterType]: value };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      categories: [],
      priceRange: '',
      rating: '',
      sortBy: 'popular',
      modelTypes: [],
      providers: [],
      features: []
    });
    setSearchQuery('');
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    return selectedFilters.categories.length +
           selectedFilters.modelTypes.length +
           selectedFilters.providers.length +
           selectedFilters.features.length +
           (selectedFilters.priceRange ? 1 : 0) +
           (selectedFilters.rating ? 1 : 0);
  };

  return (
    <div className="min-h-screen bg-dark-surface-primary">
      {/* Header */}
      <div className="bg-dark-surface-secondary border-b border-dark-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-dark-text-primary flex items-center">
                <SparklesIcon className="h-8 w-8 text-primary-400 mr-3" />
                AI Model Marketplace
              </h1>
              <p className="text-dark-text-secondary mt-1">
                Discover and deploy cutting-edge AI models
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="accent" size="lg">
                <TrendingUpIcon className="h-4 w-4 mr-1" />
                {totalModels.toLocaleString()} Models
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={clsx(
            'lg:w-80 flex-shrink-0',
            showFilters ? 'block' : 'hidden lg:block'
          )}>
            <Card variant="elevated" className="sticky top-4">
              <div className="p-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-dark-text-primary flex items-center">
                    <FunnelIcon className="h-5 w-5 mr-2" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    {getActiveFilterCount() > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-dark-text-muted hover:text-dark-text-primary"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Categories
                    </h3>
                    <div className="space-y-2">
                      {filterOptions.categories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <label
                            key={category.id}
                            className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters.categories.includes(category.id)}
                              onChange={() => handleFilterChange('categories', category.id)}
                              className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                            />
                            <IconComponent className="h-4 w-4 text-dark-text-muted ml-3 mr-2" />
                            <span className="text-sm text-dark-text-secondary flex-1">
                              {category.name}
                            </span>
                            <span className="text-xs text-dark-text-muted">
                              {category.count}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Price Range
                    </h3>
                    <div className="space-y-2">
                      {filterOptions.priceRanges.map((range) => (
                        <label
                          key={range.id}
                          className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="priceRange"
                            checked={selectedFilters.priceRange === range.id}
                            onChange={() => handleFilterChange('priceRange', range.id)}
                            className="border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-dark-text-secondary ml-3">
                            {range.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Minimum Rating
                    </h3>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="rating"
                            checked={selectedFilters.rating === rating.toString()}
                            onChange={() => handleFilterChange('rating', rating.toString())}
                            className="border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                          />
                          <div className="flex items-center ml-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={clsx(
                                    'h-4 w-4',
                                    i < rating ? 'text-yellow-400' : 'text-dark-surface-elevated'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-dark-text-secondary ml-2">
                              {rating}+ Stars
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Model Types */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Model Types
                    </h3>
                    <div className="space-y-2">
                      {filterOptions.modelTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.modelTypes.includes(type.id)}
                            onChange={() => handleFilterChange('modelTypes', type.id)}
                            className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                          />
                          <CpuChipIcon className="h-4 w-4 text-dark-text-muted ml-3 mr-2" />
                          <span className="text-sm text-dark-text-secondary flex-1">
                            {type.name}
                          </span>
                          <span className="text-xs text-dark-text-muted">
                            {type.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Providers */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Providers
                    </h3>
                    <div className="space-y-2">
                      {filterOptions.providers.map((provider) => (
                        <label
                          key={provider.id}
                          className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.providers.includes(provider.id)}
                            onChange={() => handleFilterChange('providers', provider.id)}
                            className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                          />
                          <UserGroupIcon className="h-4 w-4 text-dark-text-muted ml-3 mr-2" />
                          <span className="text-sm text-dark-text-secondary flex-1">
                            {provider.name}
                          </span>
                          <span className="text-xs text-dark-text-muted">
                            {provider.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-sm font-medium text-dark-text-primary mb-3">
                      Features
                    </h3>
                    <div className="space-y-2">
                      {filterOptions.features.map((feature) => (
                        <label
                          key={feature.id}
                          className="flex items-center p-2 rounded-lg hover:bg-dark-surface-hover cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilters.features.includes(feature.id)}
                            onChange={() => handleFilterChange('features', feature.id)}
                            className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                          />
                          <LightBulbIcon className="h-4 w-4 text-dark-text-muted ml-3 mr-2" />
                          <span className="text-sm text-dark-text-secondary flex-1">
                            {feature.name}
                          </span>
                          <span className="text-xs text-dark-text-muted">
                            {feature.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Search and Controls */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search models, providers, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={MagnifyingGlassIcon}
                    className="w-full"
                  />
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="primary" size="sm" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {/* Sort Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedFilters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className="appearance-none bg-dark-surface-elevated border border-dark-surface-elevated rounded-lg px-4 py-2 pr-8 text-sm text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {filterOptions.sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-text-muted pointer-events-none" />
                  </div>

                  {/* Results Count */}
                  <span className="text-sm text-dark-text-secondary">
                    {filteredModels.length.toLocaleString()} results
                  </span>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <div className="flex bg-dark-surface-elevated rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={clsx(
                        'p-2 rounded-md transition-all duration-200',
                        viewMode === 'grid'
                          ? 'bg-primary-500 text-white'
                          : 'text-dark-text-muted hover:text-dark-text-primary'
                      )}
                    >
                      <Squares2X2Icon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={clsx(
                        'p-2 rounded-md transition-all duration-200',
                        viewMode === 'list'
                          ? 'bg-primary-500 text-white'
                          : 'text-dark-text-muted hover:text-dark-text-primary'
                      )}
                    >
                      <ListBulletIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedFilters.categories.map((categoryId) => {
                    const category = filterOptions.categories.find(c => c.id === categoryId);
                    return (
                      <Badge
                        key={categoryId}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-500/20"
                        onClick={() => handleFilterChange('categories', categoryId)}
                      >
                        {category?.name}
                        <XMarkIcon className="h-3 w-3 ml-1" />
                      </Badge>
                    );
                  })}
                  {selectedFilters.priceRange && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-500/20"
                      onClick={() => handleFilterChange('priceRange', '')}
                    >
                      {filterOptions.priceRanges.find(r => r.id === selectedFilters.priceRange)?.name}
                      <XMarkIcon className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {selectedFilters.rating && (
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-500/20"
                      onClick={() => handleFilterChange('rating', '')}
                    >
                      {selectedFilters.rating}+ Stars
                      <XMarkIcon className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {/* Add other active filters... */}
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loading variant="spinner" size="lg" />
                <span className="ml-3 text-dark-text-secondary">
                  Loading models...
                </span>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredModels.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-surface-elevated rounded-full mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-dark-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  No models found
                </h3>
                <p className="text-dark-text-secondary mb-6 max-w-md mx-auto">
                  {searchQuery || getActiveFilterCount() > 0
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "We couldn't find any models at the moment. Please try again later."
                  }
                </p>
                {(searchQuery || getActiveFilterCount() > 0) && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="inline-flex items-center"
                  >
                    <ArrowPathIcon className="h-4 w-4 mr-2" />
                    Clear all filters
                  </Button>
                )}
              </div>
            )}

            {/* Models Grid/List */}
            {!isLoading && filteredModels.length > 0 && (
              <>
                <div className={clsx(
                  'gap-6',
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                    : 'space-y-4'
                )}>
                  {filteredModels.map((model) => (
                    <ModelCard
                      key={model.id}
                      model={model}
                      variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                      showBadges={true}
                      showStats={true}
                    />
                  ))}
                </div>

                {/* Load More / Infinite Scroll Trigger */}
                {hasMoreModels && (
                  <div
                    ref={loadingRef}
                    className="flex items-center justify-center py-8"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center">
                        <Loading variant="spinner" size="md" />
                        <span className="ml-3 text-dark-text-secondary">
                          Loading more models...
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={loadMoreModels}
                        className="inline-flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Load More Models
                      </Button>
                    )}
                  </div>
                )}

                {/* End of Results */}
                {!hasMoreModels && filteredModels.length > 12 && (
                  <div className="text-center py-8">
                    <p className="text-dark-text-muted">
                      You've reached the end of the results
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;