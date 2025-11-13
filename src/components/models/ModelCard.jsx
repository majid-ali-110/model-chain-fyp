import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  StarIcon,
  HeartIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlayIcon,
  ShoppingCartIcon,
  CheckBadgeIcon,
  CubeIcon,
  ClockIcon,
  ChartBarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Avatar from '../ui/Avatar';

const ModelCard = ({
  model,
  variant = 'default',
  className = '',
  onFavorite,
  onPreview,
  onPurchase,
  onAddToCart,
  showActions = true,
  compact = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(model?.isFavorited || false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Default model data if not provided
  const defaultModel = {
    id: 'default-model',
    name: 'Advanced Vision Model',
    description: 'State-of-the-art computer vision model for object detection and classification',
    category: 'Computer Vision',
    subcategory: 'Object Detection',
    price: 0.05,
    currency: 'ETH',
    isPremium: false,
    rating: 4.8,
    reviewCount: 124,
    downloadCount: 1200,
    viewCount: 5400,
    thumbnail: null,
    verified: true,
    featured: false,
    trending: true,
    lastUpdated: '2024-10-01',
    accuracy: 95.2,
    inferenceTime: '45ms',
    modelSize: '125MB',
    developer: {
      id: 'dev-123',
      name: 'AI Research Lab',
      avatar: null,
      verified: true,
      reputation: 4.9,
      modelCount: 23
    },
    tags: ['pytorch', 'yolo', 'real-time', 'mobile-optimized'],
    license: 'Commercial',
    compatibility: ['Python', 'JavaScript', 'REST API']
  };

  const modelData = { ...defaultModel, ...model };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(modelData.id, !isFavorited);
  };

  const handlePreview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPreview?.(modelData);
  };

  const handlePurchase = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPurchase?.(modelData);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(modelData);
  };

  const formatPrice = (price, currency) => {
    if (price === 0) return 'Free';
    return `${price} ${currency}`;
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-4 w-4">
            <StarIcon className="h-4 w-4 text-dark-text-muted absolute" />
            <div className="overflow-hidden w-1/2">
              <StarSolidIcon className="h-4 w-4 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <StarIcon key={i} className="h-4 w-4 text-dark-text-muted" />
        );
      }
    }
    return stars;
  };

  const variants = {
    default: 'rounded-xl',
    featured: 'rounded-xl border-2 border-primary-500/30 shadow-lg shadow-primary-500/20',
    trending: 'rounded-xl border-2 border-accent-500/30 shadow-lg shadow-accent-500/20',
    compact: 'rounded-lg'
  };

  return (
    <div
      className={clsx(
        'group relative bg-dark-surface-elevated border border-dark-surface-elevated transition-all duration-300 overflow-hidden',
        variants[variant],
        isHovered && 'transform scale-[1.02] shadow-2xl',
        modelData.featured && 'ring-2 ring-primary-500/50',
        modelData.trending && 'ring-2 ring-accent-500/50',
        compact ? 'max-w-sm' : 'max-w-sm mx-auto',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Glow Effect */}
      {isHovered && (
        <div className={clsx(
          'absolute inset-0 rounded-xl blur-xl transition-opacity duration-300',
          modelData.featured && 'bg-primary-500/20',
          modelData.trending && 'bg-accent-500/20',
          !modelData.featured && !modelData.trending && 'bg-secondary-500/20'
        )} />
      )}

      {/* Content */}
      <div className="relative">
        {/* Thumbnail Section */}
        <div className="relative aspect-video bg-dark-surface-primary overflow-hidden">
          {modelData.thumbnail ? (
            <>
              <img
                src={modelData.thumbnail}
                alt={modelData.name}
                className={clsx(
                  'w-full h-full object-cover transition-all duration-300',
                  isHovered && 'scale-110',
                  !isImageLoaded && 'opacity-0'
                )}
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  e.target.style.display = 'none';
                  setIsImageLoaded(true);
                }}
              />
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CubeIcon className="h-12 w-12 text-dark-text-muted animate-pulse" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-secondary-500/20">
              <CubeIcon className="h-16 w-16 text-primary-400" />
            </div>
          )}

          {/* Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {modelData.featured && (
              <Badge variant="featured" size="sm">
                <BoltIcon className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {modelData.trending && (
              <Badge variant="trending" size="sm">
                <ChartBarIcon className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            {modelData.isPremium && (
              <Badge variant="premium" size="sm">
                <ShieldCheckIcon className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={clsx(
              'absolute top-3 right-3 p-2 rounded-full transition-all duration-200',
              'bg-dark-bg-primary/80 backdrop-blur-sm',
              'hover:bg-dark-bg-primary hover:scale-110',
              isFavorited && 'text-red-500',
              !isFavorited && 'text-dark-text-muted hover:text-red-400'
            )}
          >
            {isFavorited ? (
              <HeartSolidIcon className="h-5 w-5" />
            ) : (
              <HeartIcon className="h-5 w-5" />
            )}
          </button>

          {/* Quick Preview Button */}
          {showActions && (
            <div className={clsx(
              'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
              'bg-dark-bg-primary/60 backdrop-blur-sm',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePreview}
                glow
              >
                <PlayIcon className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link 
                  to={`/models/${modelData.id}`}
                  className="group-hover:text-primary-400 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-dark-text-primary truncate">
                    {modelData.name}
                  </h3>
                </Link>
                <p className="text-sm text-dark-text-muted mt-1">
                  {modelData.category}
                  {modelData.subcategory && ` • ${modelData.subcategory}`}
                </p>
              </div>
              {modelData.verified && (
                <CheckBadgeIcon className="h-5 w-5 text-accent-400 flex-shrink-0 ml-2" />
              )}
            </div>

            {/* Description */}
            {!compact && (
              <p className="text-sm text-dark-text-secondary line-clamp-2">
                {modelData.description}
              </p>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {renderStars(modelData.rating)}
                </div>
                <span className="text-dark-text-muted">
                  {modelData.rating} ({formatCount(modelData.reviewCount)})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className={clsx(
                'font-semibold',
                modelData.price === 0 ? 'text-accent-400' : 'text-primary-400'
              )}>
                {formatPrice(modelData.price, modelData.currency)}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {!compact && (
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-dark-surface-primary rounded-lg">
                <div className="text-accent-400 font-medium">{modelData.accuracy}%</div>
                <div className="text-dark-text-muted">Accuracy</div>
              </div>
              <div className="text-center p-2 bg-dark-surface-primary rounded-lg">
                <div className="text-primary-400 font-medium">{modelData.inferenceTime}</div>
                <div className="text-dark-text-muted">Speed</div>
              </div>
              <div className="text-center p-2 bg-dark-surface-primary rounded-lg">
                <div className="text-secondary-400 font-medium">{modelData.modelSize}</div>
                <div className="text-dark-text-muted">Size</div>
              </div>
            </div>
          )}

          {/* Developer Info */}
          <div className="flex items-center justify-between">
            <Link 
              to={`/developers/${modelData.developer.id}`}
              className="flex items-center space-x-2 hover:text-primary-400 transition-colors"
            >
              <Avatar
                src={modelData.developer.avatar}
                name={modelData.developer.name}
                size="xs"
              />
              <div className="text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-dark-text-primary font-medium">
                    {modelData.developer.name}
                  </span>
                  {modelData.developer.verified && (
                    <CheckBadgeIcon className="h-3 w-3 text-accent-400" />
                  )}
                </div>
                <div className="text-dark-text-muted text-xs">
                  {modelData.developer.modelCount} models
                </div>
              </div>
            </Link>

            {/* Usage Stats */}
            <div className="flex items-center space-x-3 text-xs text-dark-text-muted">
              <div className="flex items-center space-x-1">
                <ArrowDownTrayIcon className="h-3 w-3" />
                <span>{formatCount(modelData.downloadCount)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeIcon className="h-3 w-3" />
                <span>{formatCount(modelData.viewCount)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              {modelData.price === 0 ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePurchase}
                  className="flex-1"
                  glow
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handlePurchase}
                    className="flex-1"
                    glow
                  >
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    Buy Now
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Tags */}
          {!compact && modelData.tags && modelData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {modelData.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-dark-surface-primary text-dark-text-muted rounded-md"
                >
                  {tag}
                </span>
              ))}
              {modelData.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-dark-text-muted">
                  +{modelData.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Loading Shimmer Effect */}
      <div className={clsx(
        'absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transition-transform duration-1000',
        isHovered ? 'translate-x-full' : '-translate-x-full'
      )} />
    </div>
  );
};

// Preset Model Card Variants
const FeaturedModelCard = (props) => (
  <ModelCard variant="featured" {...props} />
);

const TrendingModelCard = (props) => (
  <ModelCard variant="trending" {...props} />
);

const CompactModelCard = (props) => (
  <ModelCard compact {...props} />
);

// Grid Layout Helper
const ModelGrid = ({ models = [], variant = 'default', className = '', ...props }) => (
  <div className={clsx(
    'grid gap-6',
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    className
  )}>
    {models.map((model) => (
      <ModelCard
        key={model.id}
        model={model}
        variant={variant}
        {...props}
      />
    ))}
  </div>
);

ModelCard.Featured = FeaturedModelCard;
ModelCard.Trending = TrendingModelCard;
ModelCard.Compact = CompactModelCard;
ModelCard.Grid = ModelGrid;

export default ModelCard;