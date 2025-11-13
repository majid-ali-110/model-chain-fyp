import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  ShoppingBagIcon,
  PlayIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  WalletIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Badge from '../ui/Badge';

const Sidebar = ({ isOpen = true, className = '' }) => {
  const location = useLocation();

  // Mock user data - replace with actual auth context
  const user = {
    role: 'developer', // 'user', 'developer', 'validator', 'admin'
    name: 'John Doe',
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
      current: location.pathname.startsWith('/dashboard'),
      roles: ['user', 'developer', 'validator', 'admin'],
    },
    {
      name: 'Marketplace',
      href: '/marketplace',
      icon: ShoppingBagIcon,
      current: location.pathname.startsWith('/marketplace'),
      roles: ['user', 'developer', 'validator', 'admin'],
    },
    {
      name: 'Sandbox',
      href: '/sandbox',
      icon: PlayIcon,
      current: location.pathname.startsWith('/sandbox'),
      roles: ['user', 'developer', 'validator', 'admin'],
    },
    {
      name: 'Wallet',
      href: '/wallet',
      icon: WalletIcon,
      current: location.pathname.startsWith('/wallet'),
      roles: ['user', 'developer', 'validator', 'admin'],
    },
  ];

  const developerNavigation = [
    {
      name: 'My Models',
      href: '/developer/models',
      icon: CodeBracketIcon,
      current: location.pathname.startsWith('/developer/models'),
      badge: '3',
    },
    {
      name: 'Upload Model',
      href: '/developer/upload',
      icon: DocumentTextIcon,
      current: location.pathname === '/developer/upload',
    },
    {
      name: 'Analytics',
      href: '/developer/analytics',
      icon: ChartBarIcon,
      current: location.pathname.startsWith('/developer/analytics'),
    },
    {
      name: 'Developer Tools',
      href: '/developer/tools',
      icon: CogIcon,
      current: location.pathname.startsWith('/developer/tools'),
    },
  ];

  const validatorNavigation = [
    {
      name: 'Validator Dashboard',
      href: '/validator/dashboard',
      icon: ShieldCheckIcon,
      current: location.pathname.startsWith('/validator/dashboard'),
    },
    {
      name: 'Review Models',
      href: '/validator/review',
      icon: DocumentTextIcon,
      current: location.pathname.startsWith('/validator/review'),
      badge: '5',
    },
    {
      name: 'Leaderboard',
      href: '/validator/leaderboard',
      icon: ChartBarIcon,
      current: location.pathname.startsWith('/validator/leaderboard'),
    },
  ];

  const adminNavigation = [
    {
      name: 'Admin Dashboard',
      href: '/admin/dashboard',
      icon: ChartBarIcon,
      current: location.pathname.startsWith('/admin/dashboard'),
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: UserGroupIcon,
      current: location.pathname.startsWith('/admin/users'),
    },
    {
      name: 'Model Management',
      href: '/admin/models',
      icon: CodeBracketIcon,
      current: location.pathname.startsWith('/admin/models'),
    },
    {
      name: 'System Settings',
      href: '/admin/settings',
      icon: CogIcon,
      current: location.pathname.startsWith('/admin/settings'),
    },
  ];

  const bottomNavigation = [
    {
      name: 'Settings',
      href: '/settings',
      icon: CogIcon,
      current: location.pathname === '/settings',
    },
    {
      name: 'Help & Support',
      href: '/support',
      icon: QuestionMarkCircleIcon,
      current: location.pathname === '/support',
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user.role)
  );

  const renderNavItem = (item) => {
    const Icon = item.icon;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={clsx(
          'group flex items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden',
          item.current
            ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50',
          'transform hover:scale-[1.02] hover:-translate-y-0.5'
        )}
      >
        {item.current && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 animate-pulse" />
        )}
        <Icon
          className={clsx(
            'flex-shrink-0 h-5 w-5 transition-all duration-300',
            item.current 
              ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' 
              : 'text-gray-500 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]',
            isOpen ? 'mr-3' : 'mx-auto'
          )}
          aria-hidden="true"
        />
        {isOpen && (
          <>
            <span className="flex-1 relative z-10">{item.name}</span>
            {item.badge && (
              <Badge 
                variant="success" 
                size="sm"
                className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={clsx(
      'flex flex-col h-full bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 border-r border-cyan-500/10 transition-all duration-300 backdrop-blur-sm shadow-2xl shadow-black/50',
      isOpen ? 'w-64' : 'w-20',
      className
    )}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      
      {/* Main navigation */}
      <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto relative z-10 custom-scrollbar">
        <nav className="flex-1 px-3 space-y-2">
          {filteredNavigation.map(renderNavItem)}
        </nav>

        {/* Role-specific navigation */}
        {user.role === 'developer' && (
          <div className="mt-8">
            {isOpen && (
              <div className="px-3 mb-3">
                <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-3" />
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Developer
                </h3>
              </div>
            )}
            <nav className="px-3 space-y-2">
              {developerNavigation.map(renderNavItem)}
            </nav>
          </div>
        )}

        {user.role === 'validator' && (
          <div className="mt-8">
            {isOpen && (
              <div className="px-3 mb-3">
                <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-3" />
                <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
                  Validator
                </h3>
              </div>
            )}
            <nav className="px-3 space-y-2">
              {validatorNavigation.map(renderNavItem)}
            </nav>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="mt-8">
            {isOpen && (
              <div className="px-3 mb-3">
                <div className="h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent mb-3" />
                <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
                  Administration
                </h3>
              </div>
            )}
            <nav className="px-3 space-y-2">
              {adminNavigation.map(renderNavItem)}
            </nav>
          </div>
        )}
      </div>

      {/* Bottom navigation */}
      <div className="flex-shrink-0 pb-4 relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-3" />
        <nav className="px-3 space-y-2">
          {bottomNavigation.map(renderNavItem)}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;