import React from 'react';
import { clsx } from 'clsx';

const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  glow, // eslint-disable-line no-unused-vars -- Accept but don't use, prevents passing to DOM
  className = '', 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-white';
  
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:ring-cyan-500 border border-cyan-400/30 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl',
    secondary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:ring-purple-500 border border-purple-400/30 shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl',
    wallet: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500 border border-emerald-400/30 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl',
    outline: 'border-2 border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 focus:ring-cyan-500 bg-transparent backdrop-blur-sm hover:shadow-cyan-500/30 hover:shadow-lg',
    ghost: 'hover:bg-gray-700/50 focus:ring-cyan-500 bg-transparent hover:shadow-lg',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 focus:ring-red-500 border border-red-400/30 shadow-lg hover:shadow-red-500/50 hover:shadow-2xl',
    success: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-500 border border-emerald-400/30 shadow-lg hover:shadow-emerald-500/50 hover:shadow-2xl',
    destructive: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 focus:ring-red-500 border border-red-400/30 shadow-lg hover:shadow-red-500/50 hover:shadow-2xl'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm h-8 min-w-[2rem]',
    md: 'px-4 py-2 text-sm h-10 min-w-[2.5rem]',
    lg: 'px-6 py-3 text-base h-12 min-w-[3rem]',
    xl: 'px-8 py-4 text-lg h-14 min-w-[3.5rem]',
  };

  const glowEffects = {
    primary: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.6),0_0_60px_rgba(6,182,212,0.3)]',
    secondary: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(168,85,247,0.3)]',
    wallet: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.3)]',
    success: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.3)]',
    danger: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.6),0_0_60px_rgba(239,68,68,0.3)]',
    destructive: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.6),0_0_60px_rgba(239,68,68,0.3)]',
    outline: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.5),0_0_50px_rgba(6,182,212,0.2)]',
    ghost: ''
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };

  const LoadingSpinner = () => (
    <svg 
      className={clsx(
        'animate-spin',
        iconSizes[size],
        children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : ''
      )}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderIcon = () => {
    if (!Icon) return null;
    return <Icon className={clsx(iconSizes[size], children ? (iconPosition === 'left' ? 'mr-2' : 'ml-2') : '')} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {iconPosition === 'left' && <LoadingSpinner />}
          {children}
          {iconPosition === 'right' && <LoadingSpinner />}
        </>
      );
    }

    return (
      <>
        {iconPosition === 'left' && renderIcon()}
        {children}
        {iconPosition === 'right' && renderIcon()}
      </>
    );
  };

  return (
    <button
      ref={ref}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        glowEffects[variant],
        'hover:scale-105 active:scale-95 transform',
        'hover:-translate-y-0.5 active:translate-y-0',
        // Shimmer effect for all gradient buttons
        (variant === 'primary' || variant === 'secondary' || variant === 'wallet' || variant === 'success' || variant === 'danger' || variant === 'destructive') && 
        'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000',
        // Pulse animation on hover
        'hover:animate-[pulse_2s_ease-in-out_infinite]',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Background glow effect - Always on for futuristic look */}
      <div className={clsx(
        'absolute -inset-1 rounded-lg blur-md opacity-40 group-hover:opacity-70 transition-all duration-500 group-hover:blur-xl',
        variant === 'primary' && 'bg-gradient-to-r from-cyan-500 to-blue-500',
        variant === 'secondary' && 'bg-gradient-to-r from-purple-500 to-pink-500',
        variant === 'wallet' && 'bg-gradient-to-r from-emerald-500 to-teal-500',
        variant === 'success' && 'bg-gradient-to-r from-emerald-500 to-teal-500',
        variant === 'danger' && 'bg-gradient-to-r from-red-500 to-rose-500',
        variant === 'destructive' && 'bg-gradient-to-r from-red-500 to-rose-500',
        variant === 'outline' && 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30',
        variant === 'ghost' && 'bg-gradient-to-r from-gray-500/20 to-gray-600/20'
      )} />
      
      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {renderContent()}
      </span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;