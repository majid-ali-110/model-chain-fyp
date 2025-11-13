import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  variant = 'default', 
  padding = 'md',
  shadow = 'md',
  glow = false,
  glowColor = 'primary',
  hover = true,
  gradient = false,
  gradientDirection = 'br',
  className = '', 
  ...props 
}) => {
  const baseClasses = clsx(
    'relative rounded-xl border transition-all duration-500 overflow-hidden',
    'bg-dark-surface border-dark-border',
    // Entrance animation
    'animate-fade-in-scale',
    // Hover lift animation - enhanced
    hover && 'hover:transform hover:scale-[1.03] hover:-translate-y-2 hover-lift',
    // Hover border glow - enhanced
    hover && !glow && 'hover:border-dark-border-light hover:shadow-2xl hover:shadow-cyan-500/20',
    // Smooth transform origin
    'transform-gpu'
  );
  
  const variants = {
    default: 'bg-dark-surface',
    elevated: 'bg-dark-surface-elevated border-dark-border-light',
    outlined: 'border-2 border-dark-border bg-dark-surface/50 backdrop-blur-sm',
    filled: 'bg-dark-surface-elevated',
    glass: 'bg-dark-surface/30 backdrop-blur-md border-dark-border/50',
    neon: 'bg-dark-surface border-primary-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm shadow-black/10',
    md: 'shadow-md shadow-black/20',
    lg: 'shadow-lg shadow-black/30',
    xl: 'shadow-xl shadow-black/40',
  };

  const glowEffects = {
    primary: 'hover:border-cyan-500/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.5),0_0_60px_rgba(6,182,212,0.2)] hover-glow',
    secondary: 'hover:border-purple-500/70 hover:shadow-[0_0_30px_rgba(168,85,247,0.5),0_0_60px_rgba(168,85,247,0.2)] hover-glow',
    accent: 'hover:border-emerald-500/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.5),0_0_60px_rgba(16,185,129,0.2)] hover-glow',
    warning: 'hover:border-yellow-500/70 hover:shadow-[0_0_30px_rgba(245,158,11,0.5),0_0_60px_rgba(245,158,11,0.2)] hover-glow',
    danger: 'hover:border-red-500/70 hover:shadow-[0_0_30px_rgba(239,68,68,0.5),0_0_60px_rgba(239,68,68,0.2)] hover-glow'
  };

  const gradientOverlays = {
    tl: 'bg-gradient-to-br from-primary-500/5 via-transparent to-secondary-500/5',
    tr: 'bg-gradient-to-bl from-primary-500/5 via-transparent to-secondary-500/5',
    bl: 'bg-gradient-to-tr from-primary-500/5 via-transparent to-secondary-500/5',
    br: 'bg-gradient-to-tl from-primary-500/5 via-transparent to-secondary-500/5',
    vertical: 'bg-gradient-to-b from-primary-500/5 via-transparent to-secondary-500/5',
    horizontal: 'bg-gradient-to-r from-primary-500/5 via-transparent to-secondary-500/5'
  };

  return (
    <div
      className={clsx(
        baseClasses,
        variants[variant],
        paddings[padding],
        shadows[shadow],
        glow && glowEffects[glowColor],
        className
      )}
      {...props}
    >
      {/* Gradient Overlay */}
      {gradient && (
        <div className={clsx(
          'absolute inset-0 pointer-events-none',
          gradientOverlays[gradientDirection]
        )} />
      )}
      
      {/* Subtle Border Glow Effect */}
      {glow && (
        <div className={clsx(
          'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none',
          'group-hover:opacity-100 hover:opacity-100',
          glowColor === 'primary' && 'bg-gradient-to-r from-primary-500/10 to-transparent',
          glowColor === 'secondary' && 'bg-gradient-to-r from-secondary-500/10 to-transparent',
          glowColor === 'accent' && 'bg-gradient-to-r from-accent-500/10 to-transparent'
        )} />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer Effect on Hover */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
      )}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '', 
  divider = true,
  gradient = false,
  ...props 
}) => (
  <div 
    className={clsx(
      'relative',
      divider && 'border-b border-dark-border pb-4 mb-6',
      gradient && 'bg-gradient-to-r from-primary-500/5 to-secondary-500/5 -m-6 p-6 mb-6',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const CardTitle = ({ 
  children, 
  className = '', 
  gradient = false,
  size = 'lg',
  ...props 
}) => {
  const sizes = {
    sm: 'text-base font-semibold',
    md: 'text-lg font-semibold',
    lg: 'text-xl font-bold',
    xl: 'text-2xl font-bold'
  };

  return (
    <h3 
      className={clsx(
        sizes[size],
        gradient ? 'bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent' : 'text-dark-text-primary',
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({ 
  children, 
  className = '', 
  muted = true,
  ...props 
}) => (
  <p 
    className={clsx(
      'text-sm mt-2 leading-relaxed',
      muted ? 'text-dark-text-muted' : 'text-dark-text-secondary',
      className
    )} 
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ 
  children, 
  className = '', 
  padding = false,
  ...props 
}) => (
  <div 
    className={clsx(
      padding && 'p-4 bg-dark-surface-hover/30 rounded-lg',
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

const CardFooter = ({ 
  children, 
  className = '', 
  divider = true,
  justify = 'start',
  gradient = false,
  ...props 
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  return (
    <div 
      className={clsx(
        'flex items-center gap-3 mt-6',
        justifyClasses[justify],
        divider && 'border-t border-dark-border pt-4',
        gradient && 'bg-gradient-to-r from-primary-500/5 to-secondary-500/5 -m-6 p-6 mt-6',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

// Interactive Card Variants
const CardButton = ({ 
  children, 
  onClick, 
  className = '', 
  ...props 
}) => (
  <Card
    className={clsx(
      'cursor-pointer group transition-all duration-200',
      'hover:shadow-lg hover:shadow-primary-500/20',
      'active:scale-[0.98]',
      className
    )}
    onClick={onClick}
    glow
    hover
    {...props}
  >
    {children}
  </Card>
);

const CardStats = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  className = '',
  ...props 
}) => {
  const changeColors = {
    positive: 'text-accent-400',
    negative: 'text-red-400',
    neutral: 'text-dark-text-muted'
  };

  return (
    <Card 
      className={clsx('relative overflow-hidden', className)} 
      glow 
      hover 
      {...props}
    >
      <Card.Content>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dark-text-muted">{title}</p>
            <p className="text-2xl font-bold text-dark-text-primary mt-1">{value}</p>
            {change && (
              <p className={clsx('text-sm font-medium mt-1', changeColors[changeType])}>
                {change}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-primary-500/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary-400" />
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;
Card.Button = CardButton;
Card.Stats = CardStats;

export default Card;