import React from 'react';
import { clsx } from 'clsx';

const Checkbox = React.forwardRef(({ 
  label, 
  description,
  error,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  return (
    <div className={clsx('relative flex items-start', className)}>
      <div className="flex h-6 items-center">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-600',
            error && 'border-red-300 focus:ring-red-500',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      {(label || description) && (
        <div className="ml-3 text-sm leading-6">
          {label && (
            <label className={clsx(
              'font-medium',
              error ? 'text-red-900' : 'text-secondary-900',
              disabled && 'opacity-50'
            )}>
              {label}
            </label>
          )}
          {description && (
            <p className={clsx(
              error ? 'text-red-600' : 'text-secondary-500',
              disabled && 'opacity-50'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      {error && typeof error === 'string' && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;