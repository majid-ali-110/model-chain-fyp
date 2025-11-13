import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';

const Loading = ({ 
  size = 'md', 
  variant = 'spinner',
  color = 'primary',
  glow = false,
  className = '',
  text = '',
  progress,
  fullscreen = false,
  ...props 
}) => {
  const [dots, setDots] = useState('');

  // Animated dots for text
  useEffect(() => {
    if (!text) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, [text]);

  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
    '2xl': 'h-20 w-20',
  };

  const colors = {
    primary: 'text-primary-400',
    secondary: 'text-secondary-400',
    accent: 'text-accent-400',
    white: 'text-white',
    muted: 'text-dark-text-muted'
  };

  const glowStyles = {
    primary: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]',
    secondary: 'drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]',
    accent: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]',
    white: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
  };

  // Neon Spinner with glow
  const NeonSpinner = () => (
    <div className="relative">
      <svg
        className={clsx(
          'animate-spin',
          sizes[size],
          colors[color],
          glow && glowStyles[color],
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
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
      {glow && (
        <div className={clsx(
          'absolute inset-0 animate-pulse',
          'bg-gradient-to-r from-transparent via-current to-transparent opacity-20 rounded-full blur-sm'
        )} />
      )}
    </div>
  );

  // Blockchain Grid Animation
  const BlockchainGrid = () => (
    <div className={clsx('relative', size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12')}>
      <div className="grid grid-cols-3 gap-1 h-full w-full">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              'rounded-sm transition-all duration-500',
              colors[color],
              'bg-current opacity-20'
            )}
            style={{
              animation: `blockchainPulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
      {glow && (
        <div className={clsx(
          'absolute inset-0 rounded-lg blur-sm opacity-30',
          color === 'primary' && 'bg-primary-400',
          color === 'secondary' && 'bg-secondary-400',
          color === 'accent' && 'bg-accent-400'
        )} />
      )}
      <style jsx>{`
        @keyframes blockchainPulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );

  // Neon Dots
  const NeonDots = () => (
    <div className={clsx('flex space-x-2', className)}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className={clsx(
            'w-3 h-3 rounded-full transition-all',
            colors[color],
            'bg-current animate-bounce',
            glow && glowStyles[color]
          )}
          style={{ 
            animationDelay: `${i * 150}ms`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  // Pulse Ring
  const PulseRing = () => (
    <div className="relative">
      <div className={clsx(
        'rounded-full animate-pulse',
        sizes[size],
        colors[color],
        'bg-current opacity-75'
      )} />
      <div className={clsx(
        'absolute inset-0 rounded-full animate-ping',
        colors[color],
        'bg-current opacity-25'
      )} />
      {glow && (
        <div className={clsx(
          'absolute inset-0 rounded-full blur-md opacity-50 animate-pulse',
          color === 'primary' && 'bg-primary-400',
          color === 'secondary' && 'bg-secondary-400',
          color === 'accent' && 'bg-accent-400'
        )} />
      )}
    </div>
  );

  // Progress Circle
  const ProgressCircle = () => {
    const progressValue = progress || 0;
    const circumference = 2 * Math.PI * 10;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progressValue / 100) * circumference;

    return (
      <div className="relative">
        <svg className={clsx(sizes[size], 'transform -rotate-90')} viewBox="0 0 24 24">
          {/* Background circle */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="opacity-25"
          />
          {/* Progress circle */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={clsx(
              'transition-all duration-300 ease-in-out',
              colors[color],
              glow && glowStyles[color]
            )}
            strokeLinecap="round"
          />
        </svg>
        {progress !== undefined && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx('text-xs font-medium', colors[color])}>
              {Math.round(progressValue)}%
            </span>
          </div>
        )}
      </div>
    );
  };

  // Progress Bar
  const ProgressBar = () => {
    const progressValue = progress || 0;
    
    return (
      <div className={clsx('w-full', size === 'sm' ? 'h-1' : size === 'lg' ? 'h-3' : 'h-2')}>
        <div className="w-full bg-dark-surface-elevated rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full transition-all duration-300 ease-out rounded-full',
              'bg-gradient-to-r',
              color === 'primary' && 'from-primary-500 to-primary-400',
              color === 'secondary' && 'from-secondary-500 to-secondary-400',
              color === 'accent' && 'from-accent-500 to-accent-400',
              glow && 'shadow-[0_0_10px_currentColor]'
            )}
            style={{ width: `${progressValue}%` }}
          />
        </div>
        {progress !== undefined && (
          <div className="flex justify-between text-xs mt-1">
            <span className="text-dark-text-muted">Loading...</span>
            <span className={colors[color]}>{Math.round(progressValue)}%</span>
          </div>
        )}
      </div>
    );
  };

  // Matrix Rain Effect
  const MatrixRain = () => (
    <div className={clsx('relative overflow-hidden', sizes[size])}>
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={clsx(
              'absolute w-0.5 opacity-60',
              colors[color],
              'bg-current'
            )}
            style={{
              left: `${i * 20}%`,
              height: '100%',
              animation: `matrixFall 2s linear infinite`,
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'neon':
        return <NeonSpinner />;
      case 'blockchain':
        return <BlockchainGrid />;
      case 'dots':
        return <NeonDots />;
      case 'pulse':
        return <PulseRing />;
      case 'progress-circle':
        return <ProgressCircle />;
      case 'progress-bar':
        return <ProgressBar />;
      case 'matrix':
        return <MatrixRain />;
      case 'spinner':
      default:
        return <NeonSpinner />;
    }
  };

  const content = (
    <div className={clsx(
      'flex flex-col items-center justify-center gap-3',
      fullscreen && 'min-h-screen'
    )}>
      {renderLoader()}
      {text && (
        <div className="text-center">
          <span className={clsx('text-sm font-medium', colors[color])}>
            {text}{dots}
          </span>
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-dark-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// Preset Loading Components
const LoadingSpinner = (props) => <Loading variant="neon" glow {...props} />;
const LoadingDots = (props) => <Loading variant="dots" glow {...props} />;
const LoadingProgress = (props) => <Loading variant="progress-circle" glow {...props} />;
const LoadingBlockchain = (props) => <Loading variant="blockchain" glow {...props} />;

// Page Loading Component
const PageLoading = ({ text = "Loading page..." }) => (
  <Loading 
    variant="blockchain" 
    size="lg" 
    color="primary" 
    glow 
    fullscreen 
    text={text}
  />
);

// Button Loading Component  
const ButtonLoading = ({ size = "sm" }) => (
  <Loading 
    variant="neon" 
    size={size} 
    color="white" 
    className="mr-2"
  />
);

Loading.Spinner = LoadingSpinner;
Loading.Dots = LoadingDots;
Loading.Progress = LoadingProgress;
Loading.Blockchain = LoadingBlockchain;
Loading.Page = PageLoading;
Loading.Button = ButtonLoading;

export default Loading;