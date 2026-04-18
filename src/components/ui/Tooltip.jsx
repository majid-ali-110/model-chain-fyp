import React, { useState } from 'react';
import { clsx } from 'clsx';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  trigger = 'hover',
  delay = 200,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-surface-elevated',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-transparent border-b-dark-surface-elevated',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-dark-surface-elevated',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-dark-surface-elevated',
  };

  const showTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const triggerProps = {
    ...(trigger === 'hover' && {
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
    }),
    ...(trigger === 'click' && {
      onClick: handleClick,
    }),
  };

  return (
    <div className={clsx('relative inline-block', className)} {...props}>
      <div {...triggerProps}>
        {children}
      </div>
      {isVisible && content && (
        <div role="tooltip" className={clsx('absolute z-50 px-3 py-1.5 text-sm text-dark-text-primary bg-dark-surface-elevated border border-dark-border rounded-lg shadow-lg whitespace-nowrap animate-fade-in', positions[position])}>
          {content}
          <div className={clsx('absolute w-0 h-0', arrows[position])} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;