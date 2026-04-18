import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Accordion = ({ 
  children, 
  allowMultiple = false,
  className = '',
  ...props 
}) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (key) => {
    const newOpenItems = new Set(openItems);
    
    if (allowMultiple) {
      if (newOpenItems.has(key)) {
        newOpenItems.delete(key);
      } else {
        newOpenItems.add(key);
      }
    } else {
      if (newOpenItems.has(key)) {
        newOpenItems.clear();
      } else {
        newOpenItems.clear();
        newOpenItems.add(key);
      }
    }
    
    setOpenItems(newOpenItems);
  };

  return (
    <div className={clsx('space-y-2', className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (child.type === AccordionItem) {
          const key = child.props.key || index;
          const isOpen = openItems.has(key);
          
          return React.cloneElement(child, {
            key,
            isOpen,
            onToggle: () => toggleItem(key),
          });
        }
        return child;
      })}
    </div>
  );
};

const AccordionItem = ({ 
  title, 
  children, 
  isOpen = false, 
  onToggle, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className={clsx('border border-dark-border rounded-lg', className)} {...props}>
      <button
        type="button"
        className={clsx(
          'flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors duration-200',
          'hover:bg-dark-surface-hover focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-bg-primary',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={onToggle}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className="text-dark-text-primary">{title}</span>
        <ChevronDownIcon
          className={clsx(
            'h-5 w-5 text-dark-text-muted transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-3 pt-1 border-t border-dark-border">
          <div className="text-sm text-dark-text-secondary">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

Accordion.Item = AccordionItem;

export default Accordion;