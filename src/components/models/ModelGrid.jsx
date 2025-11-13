import React, { useState, useMemo } from 'react';
import {
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import ModelCard from './ModelCard';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import Loading from '../ui/Loading';

const ModelGrid = ({
  models = [],
  loading = false,
  error = null,
  className = '',
  onLoadMore,
  hasMore = false,
  searchQuery = '',
  onSearchChange,
  filters = {},
  onFilterChange,
  sortBy = 'popular',
  onSortChange,
  viewMode = 'grid', // 'grid' | 'list'
  onViewModeChange,
  showSearch = true,
  showFilters = true,
  showSort = true,
  showViewToggle = true,
  emptyState,
  loadingCount = 12,
  ...modelCardProps
}) => {
  const [localViewMode, setLocalViewMode] = useState(viewMode);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const currentViewMode = onViewModeChange ? viewMode : localViewMode;

  const handleViewModeChange = (mode) => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setLocalViewMode(mode);
    }
  };

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: '🔥' },
    { value: 'newest', label: 'Newest', icon: '🆕' },
    { value: 'rating', label: 'Highest Rated', icon: '⭐' },
    { value: 'downloads', label: 'Most Downloaded', icon: '📥' },
    { value: 'price-low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price-high', label: 'Price: High to Low', icon: '💎' },
    { value: 'updated', label: 'Recently Updated', icon: '🔄' },
    { value: 'name', label: 'Name A-Z', icon: '🔤' }
  ];

  const filterOptions = {
    category: {
      label: 'Category',
      options: [
        'Computer Vision',
        'Natural Language Processing',
        'Audio Processing',
        'Reinforcement Learning',
        'Generative AI',
        'Time Series',
        'Recommendation Systems'
      ]
    },
    price: {
      label: 'Price',
      options: [
        { value: 'free', label: 'Free' },
        { value: '0-1', label: '0 - 1 ETH' },
        { value: '1-5', label: '1 - 5 ETH' },
        { value: '5+', label: '5+ ETH' }
      ]
    },
    framework: {
      label: 'Framework',
      options: ['PyTorch', 'TensorFlow', 'JAX', 'Scikit-learn', 'Hugging Face', 'ONNX']
    },
    license: {
      label: 'License',
      options: ['MIT', 'Apache 2.0', 'GPL', 'Commercial', 'Custom']
    }
  };

  // Grid configurations
  const gridConfigs = {
    grid: {
      container: 'grid gap-6',
      responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
      card: 'w-full'
    },
    list: {
      container: 'flex flex-col space-y-4',
      responsive: '',
      card: 'w-full'
    }
  };

  const config = gridConfigs[currentViewMode];

  // Loading skeleton cards
  const renderLoadingCards = () => {
    return Array.from({ length: loadingCount }, (_, index) => (
      <div
        key={`loading-${index}`}
        className={clsx(
          'bg-dark-surface-elevated rounded-xl border border-dark-surface-elevated animate-pulse',
          currentViewMode === 'grid' ? 'aspect-[3/4]' : 'h-32'
        )}
      >
        <div className="p-4 space-y-3">
          {/* Thumbnail skeleton */}
          <div className={clsx(
            'bg-dark-surface-primary rounded-lg',
            currentViewMode === 'grid' ? 'aspect-video' : 'h-16 w-24'
          )} />
          
          {/* Content skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-dark-surface-primary rounded w-3/4" />
            <div className="h-3 bg-dark-surface-primary rounded w-1/2" />
            {currentViewMode === 'grid' && (
              <>
                <div className="h-3 bg-dark-surface-primary rounded w-full" />
                <div className="h-3 bg-dark-surface-primary rounded w-2/3" />
              </>
            )}
          </div>
        </div>
      </div>
    ));
  };

  // Empty state
  const renderEmptyState = () => {
    if (emptyState) return emptyState;
    
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-dark-surface-elevated rounded-full flex items-center justify-center mb-6">
          <MagnifyingGlassIcon className="h-12 w-12 text-dark-text-muted" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text-primary mb-2">
          No models found
        </h3>
        <p className="text-dark-text-muted max-w-md">
          {searchQuery || Object.keys(filters).length > 0
            ? "Try adjusting your search criteria or filters to find what you're looking for."
            : "There are no models available at the moment. Check back later for new additions."}
        </p>
        {(searchQuery || Object.keys(filters).length > 0) && (
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => {
              onSearchChange?.('');
              onFilterChange?.({});
            }}
          >
            Clear filters
          </Button>
        )}
      </div>
    );
  };

  // Filter badge
  const renderFilterBadge = (key, value) => (
    <span
      key={`${key}-${value}`}
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20"
    >
      {value}
      <button
        onClick={() => {
          const newFilters = { ...filters };
          if (Array.isArray(newFilters[key])) {
            newFilters[key] = newFilters[key].filter(v => v !== value);
            if (newFilters[key].length === 0) delete newFilters[key];
          } else {
            delete newFilters[key];
          }
          onFilterChange?.(newFilters);
        }}
        className="ml-2 hover:text-primary-300"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
    </span>
  );

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      return count + (filter ? 1 : 0);
    }, 0);
  }, [filters]);

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header Controls */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        {/* Search */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              icon={MagnifyingGlassIcon}
              className="w-full"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Results count */}
          {!loading && models.length > 0 && (
            <span className="text-sm text-dark-text-muted whitespace-nowrap">
              {models.length} model{models.length !== 1 ? 's' : ''}
            </span>
          )}

          {/* Sort */}
          {showSort && (
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  <ArrowsUpDownIcon className="h-4 w-4 mr-2" />
                  {sortOptions.find(opt => opt.value === sortBy)?.label || 'Sort'}
                  <ChevronDownIcon className="h-4 w-4 ml-2" />
                </Button>
              }
              align="right"
            >
              {sortOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  onClick={() => onSortChange?.(option.value)}
                  className={sortBy === option.value ? 'bg-primary-500/10' : ''}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown>
          )}

          {/* Filters (Desktop) */}
          {showFilters && (
            <Dropdown
              trigger={
                <Button variant="ghost" size="sm" className="hidden sm:flex relative">
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              }
              align="right"
              className="w-64"
            >
              <div className="p-4 space-y-4">
                {Object.entries(filterOptions).map(([key, config]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-dark-text-primary mb-2 block">
                      {config.label}
                    </label>
                    <div className="space-y-1">
                      {config.options.map((option) => {
                        const value = typeof option === 'string' ? option : option.value;
                        const label = typeof option === 'string' ? option : option.label;
                        const isSelected = Array.isArray(filters[key]) 
                          ? filters[key].includes(value)
                          : filters[key] === value;
                        
                        return (
                          <label key={value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                const newFilters = { ...filters };
                                if (e.target.checked) {
                                  if (Array.isArray(newFilters[key])) {
                                    newFilters[key] = [...newFilters[key], value];
                                  } else {
                                    newFilters[key] = [value];
                                  }
                                } else {
                                  if (Array.isArray(newFilters[key])) {
                                    newFilters[key] = newFilters[key].filter(v => v !== value);
                                    if (newFilters[key].length === 0) delete newFilters[key];
                                  } else {
                                    delete newFilters[key];
                                  }
                                }
                                onFilterChange?.(newFilters);
                              }}
                              className="mr-2 rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500"
                            />
                            <span className="text-sm text-dark-text-muted">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Dropdown>
          )}

          {/* Mobile Filters Button */}
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileFilters(true)}
              className="sm:hidden relative"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          )}

          {/* View Toggle */}
          {showViewToggle && (
            <div className="flex items-center border border-dark-surface-elevated rounded-lg p-1">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={clsx(
                  'p-2 rounded-md transition-colors',
                  currentViewMode === 'grid'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-elevated'
                )}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={clsx(
                  'p-2 rounded-md transition-colors',
                  currentViewMode === 'list'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-elevated'
                )}
              >
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-dark-text-muted">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            if (Array.isArray(value)) {
              return value.map(v => renderFilterBadge(key, v));
            } else if (value) {
              return renderFilterBadge(key, value);
            }
            return null;
          })}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onFilterChange?.({})}
            className="text-primary-400 hover:text-primary-300"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="col-span-full bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to load models
          </h3>
          <p className="text-red-300 mb-4">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {/* Grid/List Container */}
      <div className={clsx(config.container, config.responsive)}>
        {loading ? (
          renderLoadingCards()
        ) : models.length === 0 ? (
          renderEmptyState()
        ) : (
          models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              variant={currentViewMode === 'list' ? 'compact' : 'default'}
              className={config.card}
              {...modelCardProps}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {!loading && hasMore && models.length > 0 && (
        <div className="flex justify-center pt-8">
          <Button
            variant="secondary"
            onClick={onLoadMore}
            className="min-w-32"
          >
            Load More Models
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && models.length > 0 && (
        <div className="flex justify-center py-8">
          <Loading variant="dots" text="Loading more models..." />
        </div>
      )}

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-dark-bg-primary/80 backdrop-blur-sm" />
          <div className="absolute bottom-0 left-0 right-0 bg-dark-surface-elevated rounded-t-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-dark-surface-elevated">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark-text-primary">
                  Filters
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 text-dark-text-muted hover:text-dark-text-primary"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-6">
              {Object.entries(filterOptions).map(([key, config]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-dark-text-primary mb-3 block">
                    {config.label}
                  </label>
                  <div className="space-y-3">
                    {config.options.map((option) => {
                      const value = typeof option === 'string' ? option : option.value;
                      const label = typeof option === 'string' ? option : option.label;
                      const isSelected = Array.isArray(filters[key]) 
                        ? filters[key].includes(value)
                        : filters[key] === value;
                      
                      return (
                        <label key={value} className="flex items-center py-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newFilters = { ...filters };
                              if (e.target.checked) {
                                if (Array.isArray(newFilters[key])) {
                                  newFilters[key] = [...newFilters[key], value];
                                } else {
                                  newFilters[key] = [value];
                                }
                              } else {
                                if (Array.isArray(newFilters[key])) {
                                  newFilters[key] = newFilters[key].filter(v => v !== value);
                                  if (newFilters[key].length === 0) delete newFilters[key];
                                } else {
                                  delete newFilters[key];
                                }
                              }
                              onFilterChange?.(newFilters);
                            }}
                            className="mr-3 rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-dark-text-primary">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-dark-surface-elevated">
              <Button
                variant="primary"
                onClick={() => setShowMobileFilters(false)}
                className="w-full"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelGrid;