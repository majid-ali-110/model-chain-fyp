import React, { Fragment, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LinkIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Toast = ({ 
  show = false,
  type = 'info',
  variant = 'default',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  className = '',
  action,
  progress,
  txHash,
  amount,
  glow = false,
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    setIsVisible(show);
    setRemainingTime(duration);
    
    if (show && autoClose && duration > 0) {
      const startTime = Date.now();
      
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
          clearInterval(timer);
        }
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [show, autoClose, duration, onClose]);

  const types = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-gray-900/95 border-cyan-500/30',
      iconColor: 'text-cyan-400',
      titleColor: 'text-cyan-300',
      messageColor: 'text-gray-300',
      glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.4),0_0_60px_rgba(6,182,212,0.2)]',
      progressColor: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-gray-900/95 border-red-500/30',
      iconColor: 'text-red-400',
      titleColor: 'text-red-300',
      messageColor: 'text-gray-300',
      glowColor: 'shadow-[0_0_30px_rgba(239,68,68,0.4),0_0_60px_rgba(239,68,68,0.2)]',
      progressColor: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-gray-900/95 border-yellow-500/30',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-300',
      messageColor: 'text-gray-300',
      glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.4),0_0_60px_rgba(245,158,11,0.2)]',
      progressColor: 'bg-gradient-to-r from-yellow-500 to-amber-500'
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-dark-surface-elevated border-primary-500/20',
      iconColor: 'text-primary-400',
      titleColor: 'text-primary-300',
      messageColor: 'text-dark-text-secondary',
      glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      progressColor: 'bg-primary-500'
    },
    pending: {
      icon: ClockIcon,
      bgColor: 'bg-dark-surface-elevated border-secondary-500/20',
      iconColor: 'text-secondary-400',
      titleColor: 'text-secondary-300',
      messageColor: 'text-dark-text-secondary',
      glowColor: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      progressColor: 'bg-secondary-500'
    }
  };

  const variants = {
    default: 'rounded-lg',
    transaction: 'rounded-xl border-2',
    blockchain: 'rounded-lg bg-gradient-to-r from-dark-surface-elevated via-dark-surface-elevated to-dark-surface-elevated bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite]',
    minimal: 'rounded-md'
  };

  const config = types[type];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const formatTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const progressPercentage = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0;

  return (
    <Transition
      show={isVisible}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2 scale-95"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={clsx(
          'min-w-[400px] max-w-md w-full pointer-events-auto backdrop-blur-xl border-2',
          config.bgColor,
          variants[variant],
          glow && config.glowColor,
          'relative overflow-hidden',
          className
        )}
        {...props}
      >
        {/* Progress bar */}
        {autoClose && duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800/50 overflow-hidden">
            <div
              className={clsx(
                'h-full transition-all duration-100 ease-linear',
                config.progressColor,
                'opacity-80'
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        <div className="px-5 py-4 pt-5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Icon 
                className={clsx(
                  'h-7 w-7',
                  config.iconColor,
                  type === 'pending' && 'animate-spin'
                )} 
                aria-hidden="true" 
              />
            </div>
            
            <div className="flex-1 min-w-0">
              {title && (
                <p className={clsx('text-base font-bold leading-tight', config.titleColor)}>
                  {title}
                </p>
              )}
              
              {message && (
                <p className={clsx('text-sm font-medium leading-snug', config.messageColor, title && 'mt-1.5')}>
                  {message}
                </p>
              )}

              {/* Transaction details */}
              {variant === 'transaction' && (
                <div className="mt-2 space-y-1">
                  {amount && (
                    <div className="flex items-center text-xs text-dark-text-muted">
                      <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                      <span>Amount: {amount}</span>
                    </div>
                  )}
                  {txHash && (
                    <div className="flex items-center text-xs text-dark-text-muted">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      <span>Tx: {formatTxHash(txHash)}</span>
                      <button 
                        onClick={() => navigator.clipboard.writeText(txHash)}
                        className="ml-1 text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Progress for pending transactions */}
              {progress !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-dark-text-muted mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-dark-surface-primary rounded-full h-1.5">
                    <div
                      className={clsx(
                        'h-1.5 rounded-full transition-all duration-300',
                        config.progressColor
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action button */}
              {action && (
                <div className="mt-3">
                  <button
                    onClick={action.onClick}
                    className={clsx(
                      'text-sm font-medium transition-colors',
                      config.titleColor,
                      'hover:opacity-80'
                    )}
                  >
                    {action.label}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0 self-start">
              <button
                type="button"
                className={clsx(
                  'rounded-lg inline-flex p-1.5 transition-all duration-200',
                  'text-gray-400 hover:text-white',
                  'hover:bg-gray-700/50',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500'
                )}
                onClick={handleClose}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Blockchain variant shimmer effect */}
        {variant === 'blockchain' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_infinite] pointer-events-none" />
        )}
      </div>
    </Transition>
  );
};

// Preset Toast Components
const ToastSuccess = (props) => (
  <Toast type="success" glow {...props} />
);

const ToastError = (props) => (
  <Toast type="error" glow {...props} />
);

const ToastWarning = (props) => (
  <Toast type="warning" glow {...props} />
);

const ToastInfo = (props) => (
  <Toast type="info" {...props} />
);

const ToastPending = (props) => (
  <Toast type="pending" variant="transaction" glow {...props} />
);

// Transaction-specific presets
const ToastTransaction = ({ status = 'pending', ...props }) => {
  const typeMap = {
    pending: 'pending',
    confirmed: 'success',
    failed: 'error'
  };
  
  return (
    <Toast 
      type={typeMap[status]} 
      variant="transaction" 
      glow 
      {...props} 
    />
  );
};

const ToastBlockchain = (props) => (
  <Toast variant="blockchain" glow {...props} />
);

// Toast Container for managing multiple toasts
const ToastContainer = ({ toasts = [], position = 'top-right' }) => {
  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className={clsx('fixed z-50 flex flex-col space-y-2', positions[position])}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

Toast.Success = ToastSuccess;
Toast.Error = ToastError;
Toast.Warning = ToastWarning;
Toast.Info = ToastInfo;
Toast.Pending = ToastPending;
Toast.Transaction = ToastTransaction;
Toast.Blockchain = ToastBlockchain;
Toast.Container = ToastContainer;

export default Toast;