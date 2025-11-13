import React from 'react';
import { clsx } from 'clsx';

const Avatar = ({ 
  src, 
  alt = '',
  name = '',
  size = 'md',
  variant = 'circle',
  fallback,
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-14 w-14 text-xl',
    '2xl': 'h-16 w-16 text-2xl',
  };

  const variants = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name}
          className={clsx('object-cover', variants[variant], sizes[size])}
          {...props}
        />
      );
    }

    if (fallback) {
      return fallback;
    }

    const initials = getInitials(name);
    return (
      <div 
        className={clsx(
          'flex items-center justify-center font-semibold',
          variants[variant],
          sizes[size]
        )}
        style={{
          backgroundColor: '#58a6ff',
          color: '#ffffff',
          border: '2px solid #21262d'
        }}
      >
        {initials || '?'}
      </div>
    );
  };

  return (
    <div className={clsx('flex-shrink-0', className)} style={{ position: 'relative', zIndex: 1 }}>
      {renderContent()}
    </div>
  );
};

export default Avatar;