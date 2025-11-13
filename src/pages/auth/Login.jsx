import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  WalletIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import WalletConnectModal from '../../components/wallet/WalletConnectModal';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'wallet'
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockoutTime === 0 && isLocked) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [isLocked, lockoutTime]);

  // Wallet providers for quick connect
  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-400'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '📱',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-400'
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: '🔵',
      color: 'text-blue-500',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-600/30 hover:border-blue-500'
    }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (loginMethod === 'email') {
      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) return;
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate login failure for demo (remove in production)
      if (formData.email === 'demo@fail.com') {
        throw new Error('Invalid credentials');
      }

      // Success - redirect to dashboard
      console.log('Login successful:', formData);
      navigate('/dashboard');
      
    } catch {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(300); // 5 minutes lockout
        setErrors({ general: 'Too many failed attempts. Account locked for 5 minutes.' });
      } else {
        setErrors({ 
          general: `Invalid email or password. ${3 - newAttempts} attempts remaining.` 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wallet connection
  const handleWalletConnect = async (providerId) => {
    setIsWalletConnecting(true);
    setWalletError(null);

    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Wallet connected:', providerId);
      setShowWalletModal(false);
      navigate('/dashboard');
      
    } catch {
      setWalletError('Failed to connect wallet. Please try again.');
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Quick wallet connect (bypassing modal)
  const handleQuickWalletConnect = async (provider) => {
    setIsWalletConnecting(true);
    try {
      await handleWalletConnect(provider.id);
    } catch {
      setWalletError(`Failed to connect to ${provider.name}`);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'text-red-500' },
      { strength: 2, label: 'Weak', color: 'text-orange-500' },
      { strength: 3, label: 'Fair', color: 'text-yellow-500' },
      { strength: 4, label: 'Good', color: 'text-blue-500' },
      { strength: 5, label: 'Strong', color: 'text-green-500' }
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-6">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-dark-text-secondary">
            Sign in to access your ModelChain account
          </p>
        </div>

        <Card variant="elevated" className="p-6">
          {/* Login Method Selector */}
          <div className="flex mb-6 bg-dark-surface-primary rounded-lg p-1">
            <button
              onClick={() => setLoginMethod('email')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                loginMethod === 'email'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              <EnvelopeIcon className="h-4 w-4 inline mr-2" />
              Email Login
            </button>
            <button
              onClick={() => setLoginMethod('wallet')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                loginMethod === 'wallet'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              <WalletIcon className="h-4 w-4 inline mr-2" />
              Wallet Login
            </button>
          </div>

          {/* Email Login Form */}
          {loginMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-400">{errors.general}</span>
                </div>
              )}

              {/* Lockout Warning */}
              {isLocked && (
                <div className="flex items-center p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <LockClosedIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <div className="text-sm text-yellow-400">
                    Account locked. Try again in {Math.floor(lockoutTime / 60)}:
                    {String(lockoutTime % 60).padStart(2, '0')}
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={EnvelopeIcon}
                  placeholder="Enter your email"
                  error={errors.email}
                  disabled={isLocked}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    icon={LockClosedIcon}
                    placeholder="Enter your password"
                    error={errors.password}
                    disabled={isLocked}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-dark-text-muted hover:text-dark-text-primary transition-colors"
                    disabled={isLocked}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                {formData.password && passwordStrength.label && (
                  <div className="mt-2 flex items-center">
                    <div className="flex-1 bg-dark-surface-primary rounded-full h-2 mr-3">
                      <div
                        className={clsx(
                          'h-2 rounded-full transition-all duration-300',
                          passwordStrength.color.replace('text-', 'bg-')
                        )}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={clsx('text-xs', passwordStrength.color)}>
                      {passwordStrength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                    disabled={isLocked}
                  />
                  <span className="ml-2 text-sm text-dark-text-secondary">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={isLocked}
              >
                {isLoading ? (
                  <>
                    <Loading variant="spinner" size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Wallet Login */}
          {loginMethod === 'wallet' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-dark-text-secondary">
                  Choose your preferred wallet to sign in securely
                </p>
              </div>

              {/* Wallet Error */}
              {walletError && (
                <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-400">{walletError}</span>
                </div>
              )}

              {/* Quick Connect Options */}
              <div className="space-y-3">
                {walletProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleQuickWalletConnect(provider)}
                    disabled={isWalletConnecting}
                    className={clsx(
                      'w-full p-4 rounded-lg border-2 transition-all duration-200',
                      'bg-dark-surface-elevated hover:bg-dark-surface-hover',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500/30',
                      provider.borderColor,
                      {
                        'opacity-50 cursor-not-allowed': isWalletConnecting
                      }
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={clsx(
                          'w-10 h-10 rounded-lg flex items-center justify-center mr-3',
                          provider.bgColor
                        )}>
                          <span className="text-lg">{provider.icon}</span>
                        </div>
                        <span className="font-medium text-dark-text-primary">
                          {provider.name}
                        </span>
                      </div>
                      
                      {isWalletConnecting ? (
                        <Loading variant="spinner" size="sm" />
                      ) : (
                        <ArrowRightIcon className="h-5 w-5 text-dark-text-muted" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* More Options */}
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowWalletModal(true)}
                  disabled={isWalletConnecting}
                  className="w-full"
                >
                  <WalletIcon className="h-5 w-5 mr-2" />
                  More Wallet Options
                </Button>
              </div>

              {/* Security Notice */}
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-lg p-4">
                <div className="flex items-start">
                  <ShieldCheckIcon className="h-5 w-5 text-primary-400 mt-0.5 mr-3" />
                  <div className="text-sm">
                    <p className="text-dark-text-primary font-medium mb-1">
                      Secure Wallet Authentication
                    </p>
                    <p className="text-dark-text-secondary">
                      Your wallet signature is used for secure authentication. 
                      We never access your private keys.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-surface-elevated" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-surface-elevated text-dark-text-muted">
                New to ModelChain?
              </span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/register"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Create an account
            </Link>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Blockchain protected
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Verified
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Trusted platform
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <SparklesIcon className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Advanced models
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
        isConnecting={isWalletConnecting}
        connectionError={walletError}
      />
    </div>
  );
};

export default Login;