import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  WalletIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserIcon,
  CubeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import { useNotification } from '../../contexts/NotificationContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotification();

  // Mock user and wallet data - replace with actual context
  const user = {
    name: 'Alex Johnson',
    email: 'alex@modelchain.dev',
    avatar: null,
    isAuthenticated: true,
    role: 'developer',
    reputation: 'Verified'
  };

  const wallet = {
    isConnected: true,
    address: '0x742d35...b5d2F3',
    balance: '12.457',
    network: 'Ethereum',
    ensName: 'alexdev.eth'
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const navigation = [
    { 
      name: 'Marketplace', 
      href: '/marketplace/models',
      icon: CubeIcon,
      description: 'Discover AI models'
    },
    { 
      name: 'Sandbox', 
      href: '/sandbox',
      icon: DocumentTextIcon,
      description: 'Test and experiment'
    },
    { 
      name: 'Dashboard', 
      href: '/dashboard',
      icon: UserIcon,
      description: 'Your account overview'
    },
    { 
      name: 'Governance', 
      href: '/governance',
      icon: ShieldCheckIcon,
      description: 'Community voting'
    },
  ];

  const userNavigation = [
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    { name: 'My Models', href: '/developer/models', icon: CubeIcon },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon },
    { name: 'Sign out', href: '#', icon: ArrowRightOnRectangleIcon },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: 'New Model Approved',
      message: 'Your AI model "GPT-Vision-Plus" has been approved!',
      time: '5 min ago',
      unread: true,
      type: 'success',
      icon: CubeIcon
    },
    {
      id: 2,
      title: 'Governance Proposal',
      message: 'New proposal "Reduce Platform Fees" is now live for voting.',
      time: '1 hour ago',
      unread: true,
      type: 'info',
      icon: ShieldCheckIcon
    },
    {
      id: 3,
      title: 'Transaction Complete',
      message: 'You earned 2.5 ETH from model downloads.',
      time: '3 hours ago',
      unread: false,
      type: 'success',
      icon: WalletIcon
    },
    {
      id: 4,
      title: 'Model Update Available',
      message: 'Update available for "Audio Synthesizer X".',
      time: '1 day ago',
      unread: false,
      type: 'info',
      icon: DocumentTextIcon
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleWalletConnect = () => {
    // Mock wallet connection - replace with actual wallet logic
    console.log('Connecting wallet...');
  };

  const handleWalletDisconnect = () => {
    // Mock wallet disconnection
    console.log('Disconnecting wallet...');
  };

  const handleSignOut = () => {
    // Clear any auth tokens/data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Show success notification
    showSuccess('You have been signed out successfully', {
      title: 'Signed Out',
      duration: 3000,
      glow: true
    });
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActiveRoute = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: isScrolled ? 'rgba(10, 12, 16, 0.8)' : 'rgba(10, 12, 16, 0.6)',
      backdropFilter: 'blur(12px)',
      borderBottom: isScrolled ? '1px solid rgba(22, 27, 34, 0.3)' : 'none',
      boxShadow: isScrolled ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button - Only visible on mobile/tablet */}
            <div className="flex items-center mr-3 lg:hidden">
              <button
                type="button"
                className={clsx(
                  'inline-flex items-center justify-center rounded-md p-2 transition-colors',
                  'hover:bg-dark-surface-elevated/50',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
                style={{ color: '#8b949e' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#f0f6fc'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#8b949e'}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="relative w-12 h-12 flex items-center justify-center animate-float">
                  <img 
                    src="/modelchainlogo-removebg-preview.png" 
                    alt="ModelChain Logo" 
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.log('Logo failed to load from:', e.target.src);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-black text-white">Model</span>
                    <span className="text-xl font-black bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">Chain</span>
                  </div>
                  <div className="text-[9px] font-semibold tracking-[0.15em] text-primary-400/80 -mt-0.5">DECENTRALIZED AI</div>
                </div>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="group relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
                    style={{
                      color: isActive ? '#93c5fd' : '#8b949e',
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                      boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#f0f6fc';
                        e.currentTarget.style.backgroundColor = 'rgba(22, 27, 34, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = '#8b949e';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full" 
                           style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {user.isAuthenticated ? (
              <>
                {/* Wallet Section */}
                {wallet.isConnected ? (
                  <Dropdown
                    trigger={
                      <Button variant="secondary" size="sm" className="hidden sm:flex">
                        <WalletIcon className="h-4 w-4 mr-2" />
                        <span className="hidden md:inline">{wallet.ensName || formatAddress(wallet.address)}</span>
                        <Badge.Verified className="ml-2" />
                      </Button>
                    }
                    align="right"
                  >
                    <div className="px-4 py-3 border-b border-dark-surface-elevated">
                      <p className="text-sm font-medium text-dark-text-primary">
                        {wallet.ensName || formatAddress(wallet.address)}
                      </p>
                      <p className="text-sm text-dark-text-muted">
                        {wallet.balance} ETH • {wallet.network}
                      </p>
                    </div>
                    <Dropdown.Item onClick={() => navigate('/wallet')}>
                      <WalletIcon className="h-4 w-4 mr-2" />
                      View Wallet
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigator.clipboard.writeText(wallet.address)}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Copy Address
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleWalletDisconnect}>
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                      Disconnect
                    </Dropdown.Item>
                  </Dropdown>
                ) : (
                  <Button variant="wallet" size="sm" onClick={handleWalletConnect}>
                    <WalletIcon className="h-4 w-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}

                {/* Notifications */}
                <div className="relative notification-container">
                  <button
                    type="button"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative rounded-lg p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 hover:scale-105 transform"
                    style={{ 
                      color: showNotifications ? '#58a6ff' : '#f0f6fc', 
                      backgroundColor: showNotifications ? 'rgba(22, 27, 34, 0.8)' : 'transparent',
                      position: 'relative',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      if (!showNotifications) {
                        e.currentTarget.style.color = '#58a6ff';
                        e.currentTarget.style.backgroundColor = 'rgba(22, 27, 34, 0.8)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!showNotifications) {
                        e.currentTarget.style.color = '#f0f6fc';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6 animate-bounce-subtle" aria-hidden="true" style={{ strokeWidth: 2 }} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 text-xs font-bold rounded-full animate-pulse" style={{ backgroundColor: '#a371f7', color: '#fff', boxShadow: '0 0 10px rgba(163, 113, 247, 0.6)' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div 
                      className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border-2 border-gray-700 overflow-hidden z-50 animate-fade-in-scale"
                      style={{ 
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.3), 0 20px 60px rgba(0, 0, 0, 0.5)'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
                        <h3 className="text-lg font-bold text-white">Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-700"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => {
                          const IconComponent = notification.icon;
                          return (
                            <div
                              key={notification.id}
                              className={clsx(
                                'px-4 py-3 border-b border-gray-800 hover:bg-gray-800/50 transition-all cursor-pointer',
                                notification.unread && 'bg-cyan-500/5'
                              )}
                              onClick={() => {
                                console.log('Notification clicked:', notification.id);
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={clsx(
                                  'flex-shrink-0 rounded-lg p-2',
                                  notification.type === 'success' && 'bg-emerald-500/20 text-emerald-400',
                                  notification.type === 'info' && 'bg-cyan-500/20 text-cyan-400',
                                  notification.type === 'warning' && 'bg-yellow-500/20 text-yellow-400'
                                )}>
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-white truncate">
                                      {notification.title}
                                    </p>
                                    {notification.unread && (
                                      <span className="ml-2 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-700 bg-gray-800/50">
                        <button 
                          className="w-full text-center text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                          onClick={() => {
                            navigate('/notifications');
                            setShowNotifications(false);
                          }}
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <Dropdown
                  trigger={
                    <button 
                      className="flex items-center space-x-2 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 transition-all"
                      style={{ 
                        backgroundColor: 'transparent',
                        position: 'relative',
                        zIndex: 10,
                        display: 'flex',
                        visibility: 'visible',
                        opacity: 1,
                        minWidth: '40px',
                        minHeight: '40px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(22, 27, 34, 0.5)';
                        e.currentTarget.style.borderColor = '#58a6ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <Avatar 
                        src={user.avatar} 
                        name={user.name} 
                        size="sm"
                      />
                      <div className="hidden md:block text-left" style={{ minWidth: '100px' }}>
                        <p className="text-sm font-medium whitespace-nowrap" style={{ color: '#f0f6fc' }}>{user.name}</p>
                        <p className="text-xs whitespace-nowrap" style={{ color: '#8b949e' }}>{user.reputation}</p>
                      </div>
                      <ChevronDownIcon className="h-4 w-4 flex-shrink-0" style={{ color: '#8b949e' }} />
                    </button>
                  }
                  align="right"
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: '#21262d' }}>
                    <p className="text-sm font-medium" style={{ color: '#f0f6fc' }}>
                      {user.name}
                    </p>
                    <p className="text-sm" style={{ color: '#8b949e' }}>
                      {user.email}
                    </p>
                  </div>
                  {userNavigation.map((item) => {
                    const Icon = item.icon;
                    
                    if (item.name === 'Sign out') {
                      return (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <button
                              type="button"
                              className="flex items-center w-full px-4 py-2 text-left text-sm transition-colors"
                              style={{
                                backgroundColor: active ? '#161b22' : 'transparent',
                                color: active ? '#f0f6fc' : '#c9d1d9'
                              }}
                              onClick={() => {
                                console.log('🔴 Sign out clicked');
                                handleSignOut();
                              }}
                            >
                              <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{item.name}</span>
                            </button>
                          )}
                        </Menu.Item>
                      );
                    }
                    
                    return (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className="flex items-center w-full px-4 py-2 text-left text-sm transition-colors"
                            style={{
                              backgroundColor: active ? '#161b22' : 'transparent',
                              color: active ? '#f0f6fc' : '#c9d1d9'
                            }}
                            onClick={() => {
                              console.log('🟢 Link clicked:', item.name, '→', item.href);
                            }}
                          >
                            <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </Menu.Item>
                    );
                  })}
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={clsx(
        'lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
        isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="bg-dark-bg-primary/95 backdrop-blur-xl border-t border-dark-surface-elevated/20">
          {/* Mobile navigation */}
          <div className="space-y-1 py-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'flex items-center px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'text-primary-300 bg-primary-500/10 border-r-2 border-primary-500'
                      : 'text-dark-text-muted hover:text-dark-text-primary hover:bg-dark-surface-elevated/30'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-dark-text-muted">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile wallet & user section */}
          {user.isAuthenticated && (
            <div className="border-t border-dark-surface-elevated/20 px-4 py-3">
              {!wallet.isConnected ? (
                <Button 
                  variant="wallet" 
                  size="sm" 
                  onClick={handleWalletConnect}
                  className="w-full mb-3"
                >
                  <WalletIcon className="h-4 w-4 mr-2" />
                  Connect Wallet
                </Button>
              ) : (
                <div className="mb-3 p-3 bg-dark-surface-elevated rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-dark-text-primary">
                        {wallet.ensName || formatAddress(wallet.address)}
                      </p>
                      <p className="text-xs text-dark-text-muted">
                        {wallet.balance} ETH
                      </p>
                    </div>
                    <Badge.Verified />
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-3 mb-3">
                <Avatar src={user.avatar} name={user.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-dark-text-primary">{user.name}</p>
                  <p className="text-xs text-dark-text-muted">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;