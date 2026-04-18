import React from 'react';
import { clsx } from 'clsx';

const Radio = React.forwardRef(({ 
  options = [],
  value,
  onChange,
  name,
  label,
  error,
  disabled = false,
  direction = 'vertical',
  className = '',
  ...props 
}, ref) => {
  const handleChange = (optionValue) => {
    onChange?.(optionValue);
  };

  return (
    <fieldset className={clsx('space-y-3', className)} {...props}>
      {label && (
        <legend className={clsx(
          'text-sm font-medium leading-6',
          error ? 'text-red-400' : 'text-dark-text-primary'
        )}>
          {label}
        </legend>
      )}
      <div className={clsx(
        direction === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3'
      )}>
        {options.map((option, index) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionDisabled = disabled || (typeof option === 'object' && option.disabled);
          
          return (
            <div key={optionValue || index} className="relative flex items-center">
              <input
                ref={index === 0 ? ref : undefined}
                id={`${name}-${index}`}
                name={name}
                type="radio"
                value={optionValue}
                checked={value === optionValue}
                onChange={() => handleChange(optionValue)}
                disabled={optionDisabled}
                className={clsx(
                  'h-4 w-4 border-dark-border-light bg-dark-surface text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg-primary',
                  error && 'border-red-500 focus:ring-red-500',
                  optionDisabled && 'opacity-50 cursor-not-allowed'
                )}
              />
              <label
                htmlFor={`${name}-${index}`}
                className={clsx(
                  'ml-3 block text-sm font-medium leading-6',
                  error ? 'text-red-400' : 'text-dark-text-primary',
                  optionDisabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {optionLabel}
              </label>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </fieldset>
  );
});

Radio.displayName = 'Radio';

export default Radio;