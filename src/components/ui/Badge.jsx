import React from 'react';
import { clsx } from 'clsx';
import { 
  CheckBadgeIcon, 
  CubeIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  StarIcon,
  BoltIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon as CheckBadgeIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon: CustomIcon,
  iconPosition = 'left',
  glow = false,
  pulse = false,
  outlined = false,
  className = '', 
  ...props 
}) => {
  const baseClasses = clsx(
    'inline-flex items-center font-medium rounded-full transition-all duration-300',
    'animate-fade-in-scale hover-scale',
    pulse && 'animate-pulse',
    glow && 'shadow-lg animate-border-glow',
    'transform-gpu'
  );
  
  const variants = {
    // Status Variants
    default: outlined 
      ? 'border border-dark-border text-dark-text-secondary bg-transparent' 
      : 'bg-dark-surface-elevated text-dark-text-secondary border border-dark-border/50',
    
    // Verification Status
    verified: outlined
      ? 'border border-accent-500 text-accent-400 bg-transparent'
      : 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    
    // Blockchain Status
    blockchain: outlined
      ? 'border border-primary-500 text-primary-400 bg-transparent'
      : 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    
    // Category Badges
    category: outlined
      ? 'border border-secondary-500 text-secondary-400 bg-transparent'
      : 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    
    // Price Tags
    price: outlined
      ? 'border border-yellow-500 text-yellow-400 bg-transparent'
      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    
    // Standard Status Colors
    primary: outlined
      ? 'border border-primary-500 text-primary-400 bg-transparent'
      : 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    
    secondary: outlined
      ? 'border border-secondary-500 text-secondary-400 bg-transparent'
      : 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
    
    success: outlined
      ? 'border border-accent-500 text-accent-400 bg-transparent'
      : 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    
    warning: outlined
      ? 'border border-yellow-500 text-yellow-400 bg-transparent'
      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    
    error: outlined
      ? 'border border-red-500 text-red-400 bg-transparent'
      : 'bg-red-500/20 text-red-400 border border-red-500/30',
    
    destructive: outlined
      ? 'border border-red-500 text-red-400 bg-transparent'
      : 'bg-red-500/20 text-red-400 border border-red-500/30',
    
    info: outlined
      ? 'border border-blue-500 text-blue-400 bg-transparent'
      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    
    // Special Variants
    trending: outlined
      ? 'border border-orange-500 text-orange-400 bg-transparent'
      : 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    
    featured: outlined
      ? 'border border-purple-500 text-purple-400 bg-transparent'
      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    
    premium: outlined
      ? 'border-2 border-gradient-to-r from-yellow-400 to-orange-400 text-yellow-400 bg-transparent'
      : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs h-5',
    sm: 'px-2 py-0.5 text-xs h-6',
    md: 'px-2.5 py-1 text-sm h-7',
    lg: 'px-3 py-1 text-sm h-8',
    xl: 'px-4 py-1.5 text-base h-9'
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-4 w-4',
    xl: 'h-5 w-5'
  };

  const glowEffects = {
    verified: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    blockchain: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    category: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    price: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    primary: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    secondary: 'shadow-[0_0_10px_rgba(168,85,247,0.3)]',
    success: 'shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    error: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    trending: 'shadow-[0_0_10px_rgba(249,115,22,0.3)]',
    featured: 'shadow-[0_0_10px_rgba(147,51,234,0.3)]',
    premium: 'shadow-[0_0_10px_rgba(245,158,11,0.4)]'
  };

  // Get default icon based on variant
  const getDefaultIcon = () => {
    switch (variant) {
      case 'verified':
        return CheckBadgeIconSolid;
      case 'blockchain':
        return CubeIcon;
      case 'price':
        return CurrencyDollarIcon;
      case 'success':
        return ShieldCheckIconSolid;
      case 'warning':
        return ExclamationTriangleIcon;
      case 'error':
      case 'destructive':
        return XCircleIcon;
      case 'trending':
        return FireIcon;
      case 'featured':
        return StarIconSolid;
      case 'premium':
        return BoltIcon;
      default:
        return null;
    }
  };

  const IconComponent = CustomIcon || getDefaultIcon();

  const renderIcon = () => {
    if (!IconComponent) return null;
    
    return (
      <IconComponent 
        className={clsx(
          iconSizes[size],
          iconPosition === 'left' ? (children ? 'mr-1' : '') : (children ? 'ml-1' : '')
        )} 
      />
    );
  };

  return (
    <span
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        glow && glowEffects[variant],
        className
      )}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </span>
  );
};

// Preset Badge Components for common use cases
const VerifiedBadge = ({ children = 'Verified', ...props }) => (
  <Badge variant="verified" icon={CheckBadgeIconSolid} glow {...props}>
    {children}
  </Badge>
);

const BlockchainBadge = ({ children = 'On-Chain', ...props }) => (
  <Badge variant="blockchain" icon={CubeIcon} {...props}>
    {children}
  </Badge>
);

const PriceBadge = ({ children, glow = true, ...props }) => (
  <Badge variant="price" icon={CurrencyDollarIcon} glow={glow} {...props}>
    {children}
  </Badge>
);

const CategoryBadge = ({ children, ...props }) => (
  <Badge variant="category" {...props}>
    {children}
  </Badge>
);

const TrendingBadge = ({ children = 'Trending', ...props }) => (
  <Badge variant="trending" icon={FireIcon} pulse glow {...props}>
    {children}
  </Badge>
);

const FeaturedBadge = ({ children = 'Featured', ...props }) => (
  <Badge variant="featured" icon={StarIconSolid} glow {...props}>
    {children}
  </Badge>
);

const PremiumBadge = ({ children = 'Premium', ...props }) => (
  <Badge variant="premium" icon={BoltIcon} glow {...props}>
    {children}
  </Badge>
);

const StatusBadge = ({ status, ...props }) => {
  const statusConfig = {
    active: { variant: 'success', children: 'Active', icon: CheckBadgeIcon },
    pending: { variant: 'warning', children: 'Pending', icon: ClockIcon },
    rejected: { variant: 'error', children: 'Rejected', icon: XCircleIcon },
    draft: { variant: 'default', children: 'Draft', icon: null }
  };

  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} icon={config.icon} {...props}>
      {config.children}
    </Badge>
  );
};

// Attach preset components to main Badge
Badge.Verified = VerifiedBadge;
Badge.Blockchain = BlockchainBadge;
Badge.Price = PriceBadge;
Badge.Category = CategoryBadge;
Badge.Trending = TrendingBadge;
Badge.Featured = FeaturedBadge;
Badge.Premium = PremiumBadge;
Badge.Status = StatusBadge;

export default Badge;