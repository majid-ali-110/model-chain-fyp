import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  WalletIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  AtSymbolIcon,
  GiftIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import WalletConnectModal from '../../components/wallet/WalletConnectModal';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationMethod, setRegistrationMethod] = useState('email'); // 'email' or 'wallet'
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToNewsletter, setAgreeToNewsletter] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Username availability check
  useEffect(() => {
    if (formData.username.length >= 3) {
      setCheckingUsername(true);
      const timer = setTimeout(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate username check (replace with real API)
        const isAvailable = !['admin', 'test', 'user', 'demo'].includes(formData.username.toLowerCase());
        setUsernameAvailable(isAvailable);
        setCheckingUsername(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setUsernameAvailable(null);
    }
  }, [formData.username]);

  // Email availability check
  useEffect(() => {
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setCheckingEmail(true);
      const timer = setTimeout(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simulate email check (replace with real API)
        const isAvailable = !formData.email.includes('taken@');
        setEmailAvailable(isAvailable);
        setCheckingEmail(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setEmailAvailable(null);
    }
  }, [formData.email]);

  // Wallet providers
  const walletProviders = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30 hover:border-orange-400',
      bonus: '10 MCT'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '📱',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30 hover:border-blue-400',
      bonus: '10 MCT'
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: '🔵',
      color: 'text-blue-500',
      bgColor: 'bg-blue-600/20',
      borderColor: 'border-blue-600/30 hover:border-blue-500',
      bonus: '15 MCT'
    }
  ];

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (registrationMethod === 'email') {
      // Username validation
      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (formData.username.length > 20) {
        newErrors.username = 'Username must be less than 20 characters';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
      } else if (usernameAvailable === false) {
        newErrors.username = 'Username is already taken';
      }

      // Email validation
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (emailAvailable === false) {
        newErrors.email = 'Email is already registered';
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms validation
      if (!agreeToTerms) {
        newErrors.terms = 'You must agree to the Terms of Service';
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

  // Handle email registration
  const handleEmailRegistration = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate registration failure for demo (remove in production)
      if (formData.email === 'demo@fail.com') {
        throw new Error('Registration failed');
      }

      // Success - redirect to verification or dashboard
      console.log('Registration successful:', formData);
      navigate('/auth/verify-email');
      
    } catch {
      setErrors({ 
        general: 'Registration failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wallet registration
  const handleWalletRegistration = async (providerId) => {
    setIsWalletConnecting(true);
    setWalletError(null);

    try {
      // Simulate wallet connection and registration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Wallet registration successful:', providerId);
      setShowWalletModal(false);
      navigate('/dashboard');
      
    } catch {
      setWalletError('Failed to register with wallet. Please try again.');
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Quick wallet registration
  const handleQuickWalletRegistration = async (provider) => {
    setIsWalletConnecting(true);
    try {
      await handleWalletRegistration(provider.id);
    } catch {
      setWalletError(`Failed to register with ${provider.name}`);
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'text-red-500' },
      { strength: 2, label: 'Weak', color: 'text-orange-500' },
      { strength: 3, label: 'Fair', color: 'text-yellow-500' },
      { strength: 4, label: 'Good', color: 'text-blue-500' },
      { strength: 5, label: 'Strong', color: 'text-green-500' },
      { strength: 6, label: 'Very Strong', color: 'text-green-600' }
    ];

    return levels[Math.min(strength, 6)];
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
            Join ModelChain
          </h1>
          <p className="text-dark-text-secondary">
            Create your account and start building with AI
          </p>
        </div>

        <Card variant="elevated" className="p-6">
          {/* Registration Method Selector */}
          <div className="flex mb-6 bg-dark-surface-primary rounded-lg p-1">
            <button
              onClick={() => setRegistrationMethod('email')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                registrationMethod === 'email'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              <EnvelopeIcon className="h-4 w-4 inline mr-2" />
              Email Signup
            </button>
            <button
              onClick={() => setRegistrationMethod('wallet')}
              className={clsx(
                'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200',
                registrationMethod === 'wallet'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-dark-text-secondary hover:text-dark-text-primary'
              )}
            >
              <WalletIcon className="h-4 w-4 inline mr-2" />
              Wallet Signup
            </button>
          </div>

          {/* Email Registration Form */}
          {registrationMethod === 'email' && (
            <form onSubmit={handleEmailRegistration} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-400">{errors.general}</span>
                </div>
              )}

              {/* Username Field */}
              <div>
                <div className="relative">
                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    icon={AtSymbolIcon}
                    placeholder="Choose a unique username"
                    error={errors.username}
                    required
                  />
                  
                  {/* Username availability indicator */}
                  {formData.username.length >= 3 && (
                    <div className="absolute right-3 top-9">
                      {checkingUsername ? (
                        <Loading variant="spinner" size="xs" />
                      ) : usernameAvailable === true ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : usernameAvailable === false ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Username feedback */}
                {formData.username.length >= 3 && !checkingUsername && (
                  <div className="mt-1 text-xs">
                    {usernameAvailable === true && (
                      <span className="text-green-400">✓ Username available</span>
                    )}
                    {usernameAvailable === false && (
                      <span className="text-red-400">✗ Username taken</span>
                    )}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <Input
                    label="Email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    icon={EnvelopeIcon}
                    placeholder="Enter your email"
                    error={errors.email}
                    required
                  />
                  
                  {/* Email availability indicator */}
                  {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="absolute right-3 top-9">
                      {checkingEmail ? (
                        <Loading variant="spinner" size="xs" />
                      ) : emailAvailable === true ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      ) : emailAvailable === false ? (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
                
                {/* Email feedback */}
                {formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !checkingEmail && (
                  <div className="mt-1 text-xs">
                    {emailAvailable === true && (
                      <span className="text-green-400">✓ Email available</span>
                    )}
                    {emailAvailable === false && (
                      <span className="text-red-400">✗ Email already registered</span>
                    )}
                  </div>
                )}
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
                    placeholder="Create a strong password"
                    error={errors.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-dark-text-muted hover:text-dark-text-primary transition-colors"
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
                  <div className="mt-2">
                    <div className="flex items-center mb-1">
                      <div className="flex-1 bg-dark-surface-primary rounded-full h-2 mr-3">
                        <div
                          className={clsx(
                            'h-2 rounded-full transition-all duration-300',
                            passwordStrength.color.replace('text-', 'bg-')
                          )}
                          style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                        />
                      </div>
                      <span className={clsx('text-xs', passwordStrength.color)}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="text-xs text-dark-text-muted space-y-1">
                      <div className={clsx(
                        'flex items-center',
                        formData.password.length >= 8 ? 'text-green-400' : 'text-dark-text-muted'
                      )}>
                        <span className="mr-2">{formData.password.length >= 8 ? '✓' : '○'}</span>
                        At least 8 characters
                      </div>
                      <div className={clsx(
                        'flex items-center',
                        /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'text-green-400' : 'text-dark-text-muted'
                      )}>
                        <span className="mr-2">{/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                        Uppercase and lowercase letters
                      </div>
                      <div className={clsx(
                        'flex items-center',
                        /\d/.test(formData.password) ? 'text-green-400' : 'text-dark-text-muted'
                      )}>
                        <span className="mr-2">{/\d/.test(formData.password) ? '✓' : '○'}</span>
                        At least one number
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    icon={LockClosedIcon}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-dark-text-muted hover:text-dark-text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-1 text-xs">
                    {formData.password === formData.confirmPassword ? (
                      <span className="text-green-400">✓ Passwords match</span>
                    ) : (
                      <span className="text-red-400">✗ Passwords don't match</span>
                    )}
                  </div>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-dark-text-secondary">
                    I agree to the{' '}
                    <Link to="/legal/terms" className="text-primary-400 hover:text-primary-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/legal/privacy" className="text-primary-400 hover:text-primary-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToNewsletter}
                    onChange={(e) => setAgreeToNewsletter(e.target.checked)}
                    className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0 mt-1"
                  />
                  <span className="ml-3 text-sm text-dark-text-secondary">
                    Subscribe to our newsletter for updates and exclusive offers
                  </span>
                </label>

                {errors.terms && (
                  <div className="text-sm text-red-400">{errors.terms}</div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={isLoading}
                disabled={!agreeToTerms || usernameAvailable === false || emailAvailable === false}
              >
                {isLoading ? (
                  <>
                    <Loading variant="spinner" size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Wallet Registration */}
          {registrationMethod === 'wallet' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  Connect Your Wallet
                </h3>
                <p className="text-sm text-dark-text-secondary">
                  Get started instantly with your crypto wallet
                </p>
              </div>

              {/* Wallet Error */}
              {walletError && (
                <div className="flex items-center p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-sm text-red-400">{walletError}</span>
                </div>
              )}

              {/* Signup Bonus Notice */}
              <div className="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border border-primary-500/20 rounded-lg p-4">
                <div className="flex items-center">
                  <GiftIcon className="h-5 w-5 text-primary-400 mr-3" />
                  <div className="text-sm">
                    <p className="text-dark-text-primary font-medium mb-1">
                      Welcome Bonus!
                    </p>
                    <p className="text-dark-text-secondary">
                      Get free MCT tokens when you sign up with your wallet
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Wallet Options */}
              <div className="space-y-3">
                {walletProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleQuickWalletRegistration(provider)}
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
                        <div className="text-left">
                          <div className="font-medium text-dark-text-primary">
                            {provider.name}
                          </div>
                          <div className="text-sm text-dark-text-secondary">
                            Sign up with {provider.name}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant="success" size="sm" className="mr-3">
                          <GiftIcon className="h-3 w-3 mr-1" />
                          +{provider.bonus}
                        </Badge>
                        {isWalletConnecting ? (
                          <Loading variant="spinner" size="sm" />
                        ) : (
                          <ArrowRightIcon className="h-5 w-5 text-dark-text-muted" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* More Wallet Options */}
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

              {/* Terms Agreement for Wallet */}
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="rounded border-dark-surface-elevated text-primary-500 focus:ring-primary-500 focus:ring-offset-0 mt-1"
                    required
                  />
                  <span className="ml-3 text-sm text-dark-text-secondary">
                    By connecting your wallet, you agree to our{' '}
                    <Link to="/legal/terms" className="text-primary-400 hover:text-primary-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/legal/privacy" className="text-primary-400 hover:text-primary-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </Card>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <StarIcon className="h-3 w-3 mr-1" />
              Premium
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Access to top models
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <TrophyIcon className="h-3 w-3 mr-1" />
              Rewards
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Earn MCT tokens
            </p>
          </div>
          <div className="text-center">
            <Badge variant="secondary" size="sm" className="mb-2">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Secure
            </Badge>
            <p className="text-xs text-dark-text-muted">
              Blockchain protected
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletRegistration}
        isConnecting={isWalletConnecting}
        connectionError={walletError}
      />
    </div>
  );
};

export default Register;