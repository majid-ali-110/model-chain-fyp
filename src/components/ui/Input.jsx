import React, { useState, useId } from 'react';
import { clsx } from 'clsx';
import { ExclamationCircleIcon, CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = React.forwardRef(({ 
  type = 'text', 
  label, 
  error, 
  success,
  helperText,
  placeholder, 
  disabled = false, 
  required = false,
  floating = false,
  icon: Icon,
  iconPosition = 'left',
  glow = false,
  variant = 'default',
  size = 'md',
  showPasswordToggle = false,
  className = '', 
  ...props 
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || false);
  const id = useId();
  const inputId = props.id || id;

  const handleFocus = (e) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const actualType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password') 
    : type;

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variants = {
    default: 'bg-dark-surface border-dark-border text-dark-text-primary',
    filled: 'bg-dark-surface-elevated border-dark-border-light text-dark-text-primary',
    outline: 'bg-transparent border-2 border-dark-border text-dark-text-primary'
  };

  const baseInputClasses = clsx(
    'w-full rounded-lg transition-all duration-500 font-medium',
    'placeholder:text-dark-text-muted',
    'focus:outline-none focus:ring-0',
    'transform-gpu',
    // Dark theme base
    variants[variant],
    // Size
    sizes[size],
    // Icon spacing
    Icon && iconPosition === 'left' && 'pl-10',
    Icon && iconPosition === 'right' && 'pr-10',
    showPasswordToggle && 'pr-10',
    // States
    disabled && 'opacity-50 cursor-not-allowed bg-dark-surface/50',
    error && 'border-red-500/70 focus:border-red-400 animate-shake',
    success && 'border-emerald-500/70 focus:border-emerald-400',
    // Focus glow effects - enhanced
    !error && !success && focused && 'border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.4),0_0_40px_rgba(6,182,212,0.2)] animate-border-glow',
    !error && !success && !focused && 'hover:border-cyan-500/30 hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
    // Floating label spacing
    floating && 'pt-6',
    className
  );

  const floatingLabelClasses = clsx(
    'absolute left-4 transition-all duration-300 pointer-events-none text-dark-text-muted',
    (focused || hasValue) ? 'top-2 text-xs' : `text-sm ${size === 'sm' ? 'top-2' : size === 'lg' ? 'top-3.5' : 'top-2.5'}`,
    (focused || hasValue) && !error && !success && 'text-primary-400',
    error && 'text-red-400',
    success && 'text-accent-400'
  );

  const regularLabelClasses = clsx(
    'block text-sm font-medium mb-2 transition-colors duration-200',
    error ? 'text-red-400' : success ? 'text-accent-400' : 'text-dark-text-secondary'
  );

  const containerClasses = clsx(
    'relative',
    glow && focused && !error && !success && 'before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary-500/20 before:to-secondary-500/20 before:blur-xl before:opacity-30'
  );

  const renderIcon = () => {
    if (!Icon) return null;
    
    return (
      <div className={clsx(
        'absolute top-1/2 transform -translate-y-1/2 pointer-events-none',
        iconPosition === 'left' ? 'left-3' : 'right-3',
        error ? 'text-red-400' : success ? 'text-accent-400' : 'text-dark-text-muted'
      )}>
        <Icon className={iconSizes[size]} />
      </div>
    );
  };

  const renderValidationIcon = () => {
    if (error) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ExclamationCircleIcon className={clsx(iconSizes[size], 'text-red-400')} />
        </div>
      );
    }
    
    if (success) {
      return (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <CheckCircleIcon className={clsx(iconSizes[size], 'text-accent-400')} />
        </div>
      );
    }
    
    return null;
  };

  const renderPasswordToggle = () => {
    if (!showPasswordToggle || type !== 'password') return null;
    
    return (
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-secondary transition-colors duration-200"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeSlashIcon className={iconSizes[size]} />
        ) : (
          <EyeIcon className={iconSizes[size]} />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-1">
      {/* Regular Label */}
      {label && !floating && (
        <label htmlFor={inputId} className={regularLabelClasses}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className={containerClasses}>
        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          type={actualType}
          placeholder={floating ? '' : placeholder}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />

        {/* Floating Label */}
        {floating && label && (
          <label htmlFor={inputId} className={floatingLabelClasses}>
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}

        {/* Icons */}
        {renderIcon()}
        {!showPasswordToggle && renderValidationIcon()}
        {renderPasswordToggle()}

        {/* Glow Effect Overlay */}
        {glow && focused && !error && !success && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/10 to-secondary-500/10 pointer-events-none" />
        )}
      </div>

      {/* Helper Text / Error / Success Message */}
      {(error || success || helperText) && (
        <div className="flex items-start gap-1">
          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <ExclamationCircleIcon className="h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-accent-400 flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
              {success}
            </p>
          )}
          {helperText && !error && !success && (
            <p className="text-sm text-dark-text-muted">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;