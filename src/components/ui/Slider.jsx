import React, { useState } from 'react';
import { clsx } from 'clsx';

const Slider = React.forwardRef(({ 
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  label,
  showValue = true,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    setSliderValue(newValue);
    onChange?.(newValue);
  };

  const percentage = ((sliderValue - min) / (max - min)) * 100;

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className={clsx(
            'block text-sm font-medium leading-6 text-secondary-900',
            disabled && 'opacity-50'
          )}>
            {label}
          </label>
          {showValue && (
            <span className={clsx(
              'text-sm text-secondary-600',
              disabled && 'opacity-50'
            )}>
              {sliderValue}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          disabled={disabled}
          className={clsx(
            'w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer',
            'slider:bg-primary-600 slider:rounded-lg',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
          {...props}
        />
      </div>
      <div className="flex justify-between text-xs text-secondary-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';

export default Slider;