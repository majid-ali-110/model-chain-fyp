import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  className = '',
  ...props 
}) => {
  const alignments = {
    left: 'origin-top-left left-0',
    right: 'origin-top-right right-0',
    center: 'origin-top left-1/2 transform -translate-x-1/2',
  };

  return (
    <Menu as="div" className={clsx('relative inline-block text-left', className)} {...props}>
      <Menu.Button as={Fragment}>
        {trigger}
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            'absolute mt-2 w-56 rounded-md shadow-lg focus:outline-none',
            alignments[align]
          )}
          style={{
            backgroundColor: '#0d1117',
            border: '1px solid #21262d',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 9999
          }}
        >
          <div className="py-1">{children}</div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const DropdownItem = ({ children, onClick, disabled = false, className = '', ...props }) => (
  <Menu.Item disabled={disabled}>
    {({ active, close }) => {
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (onClick) {
          onClick(e);
        }
        
        // Close dropdown after action
        setTimeout(() => {
          close();
        }, 100);
      };

      return (
        <button
          type="button"
          className={clsx(
            'block w-full px-4 py-2 text-left text-sm transition-colors flex items-center',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          style={{
            backgroundColor: active ? '#161b22' : 'transparent',
            color: active ? '#f0f6fc' : '#c9d1d9'
          }}
          onClick={handleClick}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      );
    }}
  </Menu.Item>
);

const DropdownDivider = () => (
  <div className="my-1" style={{ borderTop: '1px solid #21262d' }} />
);

Dropdown.Item = DropdownItem;
Dropdown.Divider = DropdownDivider;

export default Dropdown;