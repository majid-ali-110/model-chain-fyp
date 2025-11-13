import React, { useState, useEffect } from 'react';
import {
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CurrencyDollarIcon,
  TagIcon,
  GlobeAltIcon,
  ArrowsUpDownIcon,
  CheckIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';

const ModelFilters = ({
  filters = {},
  onFiltersChange,
  onClearFilters,
  className = '',
  isOpen = true,
  onToggle,
  showMobileToggle = false,
  totalCount = 0,
  filteredCount = 0
}) => {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    networks: true,
    frameworks: true,
    sort: true,
    attributes: false
  });
  
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchCategories, setSearchCategories] = useState('');

  // Update price range when filters change
  useEffect(() => {
    if (filters.priceRange) {
      setPriceRange(filters.priceRange);
    }
  }, [filters.priceRange]);

  const categories = [
    { id: 'computer-vision', name: 'Computer Vision', count: 1247, icon: '👁️' },
    { id: 'nlp', name: 'Natural Language Processing', count: 892, icon: '📝' },
    { id: 'audio', name: 'Audio Processing', count: 456, icon: '🎵' },
    { id: 'generative', name: 'Generative AI', count: 678, icon: '🎨' },
    { id: 'reinforcement', name: 'Reinforcement Learning', count: 234, icon: '🎮' },
    { id: 'recommendation', name: 'Recommendation Systems', count: 345, icon: '🎯' },
    { id: 'time-series', name: 'Time Series', count: 167, icon: '📊' },
    { id: 'anomaly', name: 'Anomaly Detection', count: 123, icon: '🔍' },
    { id: 'robotics', name: 'Robotics', count: 89, icon: '🤖' },
    { id: 'medical', name: 'Medical AI', count: 156, icon: '🏥' }
  ];

  const priceRanges = [
    { id: 'free', label: 'Free', min: 0, max: 0, count: 1234 },
    { id: 'low', label: '0.01 - 1 ETH', min: 0.01, max: 1, count: 856 },
    { id: 'medium', label: '1 - 5 ETH', min: 1, max: 5, count: 423 },
    { id: 'high', label: '5 - 10 ETH', min: 5, max: 10, count: 167 },
    { id: 'premium', label: '10+ ETH', min: 10, max: 999, count: 89 }
  ];

  const blockchainNetworks = [
    { id: 'ethereum', name: 'Ethereum', count: 2134, icon: '⟠', color: 'text-blue-400' },
    { id: 'polygon', name: 'Polygon', count: 1567, icon: '🔷', color: 'text-purple-400' },
    { id: 'bsc', name: 'BNB Chain', count: 892, icon: '🟡', color: 'text-yellow-400' },
    { id: 'arbitrum', name: 'Arbitrum', count: 456, icon: '🔵', color: 'text-blue-300' },
    { id: 'optimism', name: 'Optimism', count: 234, icon: '🔴', color: 'text-red-400' },
    { id: 'avalanche', name: 'Avalanche', count: 178, icon: '🔺', color: 'text-red-500' }
  ];

  const frameworks = [
    { id: 'pytorch', name: 'PyTorch', count: 1456, icon: '🔥' },
    { id: 'tensorflow', name: 'TensorFlow', count: 1234, icon: '🟠' },
    { id: 'huggingface', name: 'Hugging Face', count: 892, icon: '🤗' },
    { id: 'onnx', name: 'ONNX', count: 567, icon: '⚡' },
    { id: 'jax', name: 'JAX', count: 345, icon: '🎯' },
    { id: 'scikit', name: 'Scikit-learn', count: 234, icon: '🔬' },
    { id: 'keras', name: 'Keras', count: 198, icon: '🧠' }
  ];

  const sortOptions = [
    { id: 'popular', label: 'Most Popular', icon: FireIcon, count: 'Default' },
    { id: 'newest', label: 'Newest First', icon: ClockIcon, count: 'Recent' },
    { id: 'rating', label: 'Highest Rated', icon: StarIcon, count: '4.5+' },
    { id: 'trending', label: 'Trending', icon: ArrowTrendingUpIcon, count: 'Hot' },
    { id: 'price-low', label: 'Price: Low to High', icon: CurrencyDollarIcon, count: 'Asc' },
    { id: 'price-high', label: 'Price: High to Low', icon: CurrencyDollarIcon, count: 'Desc' },
    { id: 'downloads', label: 'Most Downloaded', icon: ArrowsUpDownIcon, count: 'Popular' },
    { id: 'updated', label: 'Recently Updated', icon: ClockIcon, count: 'Fresh' }
  ];

  const modelAttributes = [
    { id: 'verified', label: 'Verified Models', count: 1456, icon: '✅' },
    { id: 'featured', label: 'Featured', count: 234, icon: '⭐' },
    { id: 'trending', label: 'Trending', count: 456, icon: '🔥' },
    { id: 'open-source', label: 'Open Source', count: 892, icon: '🔓' },
    { id: 'commercial', label: 'Commercial License', count: 567, icon: '💼' },
    { id: 'mobile-optimized', label: 'Mobile Optimized', count: 345, icon: '📱' },
    { id: 'gpu-accelerated', label: 'GPU Accelerated', count: 678, icon: '⚡' },
    { id: 'real-time', label: 'Real-time Inference', count: 234, icon: '⏱️' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key, value, isArray = false) => {
    const newFilters = { ...filters };
    
    if (isArray) {
      if (!newFilters[key]) newFilters[key] = [];
      const currentValues = [...newFilters[key]];
      const index = currentValues.indexOf(value);
      
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }
      
      if (currentValues.length === 0) {
        delete newFilters[key];
      } else {
        newFilters[key] = currentValues;
      }
    } else {
      if (newFilters[key] === value) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
    }
    
    onFiltersChange?.(newFilters);
  };

  const updatePriceRange = (newRange) => {
    setPriceRange(newRange);
    const newFilters = { ...filters };
    newFilters.priceRange = newRange;
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    setPriceRange([0, 100]);
    setSearchCategories('');
    onClearFilters?.();
  };

  const isFilterActive = (key, value) => {
    if (Array.isArray(filters[key])) {
      return filters[key].includes(value);
    }
    return filters[key] === value;
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      return count + (filter ? 1 : 0);
    }, 0);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchCategories.toLowerCase())
  );

  const FilterSection = ({ title, section, children, count }) => (
    <div className="border-b border-dark-surface-elevated/30 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-dark-surface-elevated/30 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="font-medium text-dark-text-primary">{title}</span>
          {count !== undefined && (
            <Badge variant="secondary" size="xs">{count}</Badge>
          )}
        </div>
        {expandedSections[section] ? (
          <ChevronUpIcon className="h-4 w-4 text-dark-text-muted" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 text-dark-text-muted" />
        )}
      </button>
      
      {expandedSections[section] && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxItem = ({ label, count, icon, isChecked, onChange, color }) => (
    <label className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-dark-surface-elevated/20 rounded-lg px-2 -mx-2 transition-colors">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0 focus:ring-offset-dark-surface-elevated"
      />
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {icon && <span className={clsx('text-sm', color)}>{icon}</span>}
        <span className="text-sm text-dark-text-primary truncate">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-dark-text-muted">({count})</span>
        )}
      </div>
    </label>
  );

  const RadioItem = ({ label, count, icon: Icon, isChecked, onChange }) => (
    <label className="flex items-center space-x-3 py-2 cursor-pointer hover:bg-dark-surface-elevated/20 rounded-lg px-2 -mx-2 transition-colors">
      <input
        type="radio"
        checked={isChecked}
        onChange={onChange}
        className="border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0 focus:ring-offset-dark-surface-elevated"
      />
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        {Icon && <Icon className="h-4 w-4 text-primary-400" />}
        <span className="text-sm text-dark-text-primary truncate">{label}</span>
        {count !== undefined && (
          <span className="text-xs text-dark-text-muted">({count})</span>
        )}
      </div>
    </label>
  );

  if (!isOpen && showMobileToggle) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-40 shadow-lg bg-dark-surface-elevated"
      >
        <FunnelIcon className="h-5 w-5 mr-2" />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Badge variant="primary" size="xs" className="ml-2">
            {getActiveFiltersCount()}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className={clsx(
      'bg-dark-surface-elevated border border-dark-surface-elevated rounded-lg',
      'h-fit max-h-[80vh] overflow-hidden flex flex-col',
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-dark-surface-elevated/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FunnelIcon className="h-5 w-5 text-primary-400" />
          <h3 className="font-semibold text-dark-text-primary">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="primary" size="sm">
              {getActiveFiltersCount()} active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearAllFilters}
              className="text-primary-400 hover:text-primary-300"
            >
              Clear all
            </Button>
          )}
          {showMobileToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-dark-text-muted hover:text-dark-text-primary lg:hidden"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {totalCount > 0 && (
        <div className="px-4 py-3 bg-dark-surface-primary/30 border-b border-dark-surface-elevated/30">
          <div className="text-sm text-dark-text-secondary">
            Showing <span className="font-medium text-primary-400">{filteredCount}</span> of{' '}
            <span className="font-medium">{totalCount}</span> models
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <FilterSection
          title="Categories"
          section="categories"
          count={filters.categories?.length}
        >
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchCategories}
              onChange={(e) => setSearchCategories(e.target.value)}
              icon={MagnifyingGlassIcon}
              size="sm"
            />
            
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {filteredCategories.map((category) => (
                <CheckboxItem
                  key={category.id}
                  label={category.name}
                  count={category.count}
                  icon={category.icon}
                  isChecked={isFilterActive('categories', category.id)}
                  onChange={() => updateFilter('categories', category.id, true)}
                />
              ))}
            </div>
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection
          title="Price Range"
          section="price"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <CheckboxItem
                  key={range.id}
                  label={range.label}
                  count={range.count}
                  isChecked={isFilterActive('priceRanges', range.id)}
                  onChange={() => updateFilter('priceRanges', range.id, true)}
                />
              ))}
            </div>
            
            {/* Custom Price Range Slider */}
            <div className="pt-2 border-t border-dark-surface-elevated/30">
              <label className="text-sm text-dark-text-primary mb-2 block">
                Custom Range: {priceRange[0]} - {priceRange[1]} ETH
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => updatePriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-dark-surface-primary rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </FilterSection>

        {/* Blockchain Networks */}
        <FilterSection
          title="Blockchain Networks"
          section="networks"
          count={filters.networks?.length}
        >
          <div className="space-y-1">
            {blockchainNetworks.map((network) => (
              <CheckboxItem
                key={network.id}
                label={network.name}
                count={network.count}
                icon={network.icon}
                color={network.color}
                isChecked={isFilterActive('networks', network.id)}
                onChange={() => updateFilter('networks', network.id, true)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Frameworks */}
        <FilterSection
          title="Frameworks"
          section="frameworks"
          count={filters.frameworks?.length}
        >
          <div className="space-y-1">
            {frameworks.map((framework) => (
              <CheckboxItem
                key={framework.id}
                label={framework.name}
                count={framework.count}
                icon={framework.icon}
                isChecked={isFilterActive('frameworks', framework.id)}
                onChange={() => updateFilter('frameworks', framework.id, true)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Sort Options */}
        <FilterSection
          title="Sort By"
          section="sort"
        >
          <div className="space-y-1">
            {sortOptions.map((option) => (
              <RadioItem
                key={option.id}
                label={option.label}
                count={option.count}
                icon={option.icon}
                isChecked={filters.sortBy === option.id}
                onChange={() => updateFilter('sortBy', option.id)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Model Attributes */}
        <FilterSection
          title="Model Attributes"
          section="attributes"
          count={filters.attributes?.length}
        >
          <div className="space-y-1">
            {modelAttributes.map((attribute) => (
              <CheckboxItem
                key={attribute.id}
                label={attribute.label}
                count={attribute.count}
                icon={attribute.icon}
                isChecked={isFilterActive('attributes', attribute.id)}
                onChange={() => updateFilter('attributes', attribute.id, true)}
              />
            ))}
          </div>
        </FilterSection>
      </div>

      {/* Footer */}
      {getActiveFiltersCount() > 0 && (
        <div className="p-4 border-t border-dark-surface-elevated/30 bg-dark-surface-primary/20">
          <Button
            variant="secondary"
            onClick={clearAllFilters}
            className="w-full"
          >
            <XMarkIcon className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: rgb(59 130 246);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: rgb(59 130 246);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default ModelFilters;