import React from 'react';
import { clsx } from 'clsx';

const Progress = ({ 
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  label,
  className = '',
  ...props 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
    xl: 'h-4',
  };

  const variants = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-secondary-700">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-secondary-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={clsx('w-full bg-secondary-200 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={clsx('h-full transition-all duration-300 ease-in-out', variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;