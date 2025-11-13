import React from 'react';
import { clsx } from 'clsx';

const Container = ({ 
  children, 
  size = 'default',
  padding = true,
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-7xl',
    lg: 'max-w-screen-xl',
    xl: 'max-w-screen-2xl',
    full: 'w-full',
  };

  return (
    <div
      className={clsx(
        'w-full mx-auto relative z-10',
        sizes[size],
        padding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default Container;