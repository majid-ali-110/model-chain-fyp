import React, { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from './Button';

const Modal = ({ 
  open = false,
  isOpen, // Legacy prop support
  onClose, 
  children, 
  size = 'md',
  position = 'center',
  animation = 'slide',
  backdrop = 'blur',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  hideCloseButton = false, // Legacy prop
  className = '',
  overlayClassName = '',
  ...props 
}) => {
  const modalRef = useRef(null);
  const isModalOpen = open || isOpen;

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isModalOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isModalOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isModalOpen]);

  const sizes = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full mx-4',
  };

  const positions = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
    bottom: 'items-end justify-center pb-16'
  };

  const backdropStyles = {
    blur: 'bg-black/60 backdrop-blur-md',
    dark: 'bg-black/80',
    light: 'bg-black/40',
    none: 'bg-transparent'
  };

  const animations = {
    slide: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
      enterTo: 'opacity-100 translate-y-0 sm:scale-100',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
      leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
    },
    fade: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0',
      enterTo: 'opacity-100',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100',
      leaveTo: 'opacity-0'
    },
    slideDown: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0 -translate-y-full',
      enterTo: 'opacity-100 translate-y-0',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 -translate-y-full'
    },
    slideUp: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0 translate-y-full',
      enterTo: 'opacity-100 translate-y-0',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100 translate-y-0',
      leaveTo: 'opacity-0 translate-y-full'
    },
    zoom: {
      enter: 'ease-out duration-300',
      enterFrom: 'opacity-0 scale-50',
      enterTo: 'opacity-100 scale-100',
      leave: 'ease-in duration-200',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-50'
    }
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const modalContent = (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={closeOnBackdrop ? onClose : () => {}}
        initialFocus={modalRef}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div 
            className={clsx(
              'fixed inset-0 transition-all',
              backdropStyles[backdrop],
              overlayClassName
            )}
            onClick={handleBackdropClick}
          />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className={clsx(
            'flex min-h-full p-4 text-center',
            positions[position]
          )}>
            <Transition.Child
              as={Fragment}
              enter={animations[animation].enter}
              enterFrom={animations[animation].enterFrom}
              enterTo={animations[animation].enterTo}
              leave={animations[animation].leave}
              leaveFrom={animations[animation].leaveFrom}
              leaveTo={animations[animation].leaveTo}
            >
              <Dialog.Panel
                ref={modalRef}
                className={clsx(
                  'w-full transform overflow-hidden rounded-2xl text-left align-middle transition-all',
                  // Dark theme styling
                  'bg-dark-surface border border-dark-border-light',
                  'shadow-2xl shadow-black/50',
                  // Responsive sizing
                  sizes[size],
                  // Custom styling
                  className
                )}
                {...props}
              >
                {/* Close button */}
                {(showCloseButton && !hideCloseButton) && (
                  <button
                    type="button"
                    className="absolute top-4 right-4 z-10 rounded-lg p-2 text-dark-text-muted hover:text-dark-text-secondary hover:bg-dark-surface-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}

                {/* Modal Content */}
                <div className="relative">
                  {children}
                </div>

                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/20 via-transparent to-secondary-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );

  // Use portal to render modal at document root
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
};

const ModalHeader = ({ 
  children, 
  title,
  subtitle,
  gradient = false,
  className = '', 
  ...props 
}) => (
  <div className={clsx('px-6 py-4 border-b border-dark-border', className)} {...props}>
    {title && (
      <Dialog.Title 
        as="h3" 
        className={clsx(
          'text-xl font-bold leading-6',
          gradient 
            ? 'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent'
            : 'text-dark-text-primary'
        )}
      >
        {title}
      </Dialog.Title>
    )}
    {subtitle && (
      <p className="mt-1 text-sm text-dark-text-muted">
        {subtitle}
      </p>
    )}
    {children}
  </div>
);

const ModalContent = ({ 
  children, 
  className = '', 
  padding = true,
  ...props 
}) => (
  <div 
    className={clsx(
      padding && 'px-6 py-4',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const ModalBody = ({ 
  children, 
  className = '', 
  padding = true,
  maxHeight = false,
  ...props 
}) => (
  <div 
    className={clsx(
      padding && 'px-6 py-4',
      maxHeight && 'max-h-96 overflow-y-auto',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const ModalFooter = ({ 
  children, 
  className = '',
  justify = 'end',
  divider = true,
  ...props 
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div 
      className={clsx(
        'flex items-center gap-3 px-6 py-4',
        justifyClasses[justify],
        divider && 'border-t border-dark-border',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Preset Modal Components
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  ...props
}) => (
  <Modal open={open} onClose={onClose} size="sm" {...props}>
    <Modal.Header title={title} />
    <Modal.Body>
      <p className="text-dark-text-secondary">{message}</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="ghost" onClick={onClose}>
        {cancelText}
      </Button>
      <Button variant={variant} onClick={onConfirm}>
        {confirmText}
      </Button>
    </Modal.Footer>
  </Modal>
);

const AlertModal = ({
  open,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  variant = 'primary',
  ...props
}) => (
  <Modal open={open} onClose={onClose} size="sm" {...props}>
    <Modal.Header title={title} />
    <Modal.Body>
      <p className="text-dark-text-secondary">{message}</p>
    </Modal.Body>
    <Modal.Footer justify="center">
      <Button variant={variant} onClick={onClose}>
        {buttonText}
      </Button>
    </Modal.Footer>
  </Modal>
);

// Attach components and presets
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Confirm = ConfirmModal;
Modal.Alert = AlertModal;

export default Modal;