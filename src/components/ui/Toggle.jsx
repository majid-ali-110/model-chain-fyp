import React, { useState } from 'react';
import { clsx } from 'clsx';

const Toggle = React.forwardRef(({ 
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (!disabled) {
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
    }
  };

  const sizes = {
    sm: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: isChecked ? 'translate-x-4' : 'translate-x-0',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: isChecked ? 'translate-x-5' : 'translate-x-0',
    },
    lg: {
      switch: 'h-7 w-12',
      thumb: 'h-6 w-6',
      translate: isChecked ? 'translate-x-5' : 'translate-x-0',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <div className={clsx('flex items-center', className)}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={disabled}
        className={clsx(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
          sizeConfig.switch,
          isChecked ? 'bg-primary-600' : 'bg-secondary-200',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        {...props}
      >
        <span className="sr-only">{label}</span>
        <span
          className={clsx(
            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
            sizeConfig.thumb,
            sizeConfig.translate
          )}
        />
      </button>
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <span className={clsx(
              'text-sm font-medium text-secondary-900',
              disabled && 'opacity-50'
            )}>
              {label}
            </span>
          )}
          {description && (
            <p className={clsx(
              'text-sm text-secondary-500',
              disabled && 'opacity-50'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;