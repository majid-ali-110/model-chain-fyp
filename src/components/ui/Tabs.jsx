import React, { useState } from 'react';
import { clsx } from 'clsx';

const Tabs = ({ 
  children, 
  defaultActiveKey, 
  onChange, 
  variant = 'line',
  className = '',
  ...props 
}) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleTabChange = (key) => {
    setActiveKey(key);
    onChange?.(key);
  };

  const variants = {
    line: 'border-b border-secondary-200',
    pills: 'bg-secondary-100 p-1 rounded-lg',
    underline: '',
  };

  return (
    <div className={clsx('w-full', className)} {...props}>
      <div className={clsx('flex space-x-1', variants[variant])}>
        {React.Children.map(children, (child) => {
          if (child.type === TabPane) {
            const isActive = child.props.key === activeKey;
            return (
              <button
                key={child.props.key}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                  variant === 'line' && [
                    'border-b-2 border-transparent',
                    isActive ? 'border-primary-500 text-primary-600' : 'text-secondary-500 hover:text-secondary-700',
                  ],
                  variant === 'pills' && [
                    isActive ? 'bg-white text-primary-600 shadow-sm' : 'text-secondary-600 hover:text-secondary-800',
                  ],
                  variant === 'underline' && [
                    'border-b-2 border-transparent',
                    isActive ? 'border-primary-500 text-primary-600' : 'text-secondary-500 hover:text-secondary-700 hover:border-secondary-300',
                  ]
                )}
                onClick={() => handleTabChange(child.props.key)}
                disabled={child.props.disabled}
              >
                {child.props.tab}
              </button>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-4">
        {React.Children.map(children, (child) => {
          if (child.type === TabPane && child.props.key === activeKey) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
};

const TabPane = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

Tabs.TabPane = TabPane;

export default Tabs;