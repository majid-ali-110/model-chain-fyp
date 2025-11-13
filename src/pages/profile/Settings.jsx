import React, { useState } from 'react';
import {
  UserIcon,
  ShieldCheckIcon,
  WalletIcon,
  BellIcon,
  LockClosedIcon,
  CogIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  KeyIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
    security: true,
    modelUpdates: true,
    purchases: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    allowIndexing: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'UTC-8',
    currency: 'USD',
    autoSave: true,
    compactMode: false
  });

  // Mock user data
  const [userInfo, setUserInfo] = useState({
    username: 'sarah_ai_dev',
    email: 'sarah@example.com',
    displayName: 'Sarah Chen',
    bio: 'AI/ML Engineer passionate about democratizing AI technology',
    location: 'San Francisco, CA',
    website: 'https://sarahchen.dev',
    joinedDate: '2024-01-15',
    verified: true
  });

  // Mock wallet data
  const [walletInfo] = useState({
    address: '0x742d35Cc6C4532B789FE2EAB4C8F5a7B8D8F4E3C',
    balance: '1,250.45',
    currency: 'MCT',
    usdValue: '$3,751.35',
    connectedWallets: [
      { type: 'MetaMask', address: '0x742d35...4E3C', status: 'connected' },
      { type: 'WalletConnect', address: '0x8A3B2C...9F1E', status: 'disconnected' }
    ]
  });

  // Mock sessions data
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'San Francisco, CA',
      lastActive: '2025-10-03T10:30:00Z',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '2025-10-02T15:45:00Z',
      current: false,
      ip: '10.0.0.50'
    },
    {
      id: 3,
      device: 'Firefox on Mac',
      location: 'New York, NY',
      lastActive: '2025-10-01T09:20:00Z',
      current: false,
      ip: '172.16.0.10'
    }
  ]);

  const tabs = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: LockClosedIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon },
    { id: 'danger', label: 'Danger Zone', icon: ExclamationTriangleIcon }
  ];

  // Handle form submissions
  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleToggle2FA = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTwoFactorEnabled(!twoFactorEnabled);
    setIsLoading(false);
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const revokeSession = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  // Account Tab Content
  const AccountTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        
        <form onSubmit={handleSaveAccount} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              value={userInfo.username}
              onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
            />
            <Input
              label="Display Name"
              value={userInfo.displayName}
              onChange={(e) => setUserInfo(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="Enter display name"
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            value={userInfo.email}
            onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter email"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={userInfo.bio}
              onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Location"
              value={userInfo.location}
              onChange={(e) => setUserInfo(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location"
            />
            <Input
              label="Website"
              value={userInfo.website}
              onChange={(e) => setUserInfo(prev => ({ ...prev, website: e.target.value }))}
              placeholder="Enter website URL"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-400">
              Account created: {formatDate(userInfo.joinedDate)}
              {userInfo.verified && (
                <Badge variant="success" className="ml-2">Verified</Badge>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  // Security Tab Content
  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <KeyIcon className="h-5 w-5 mr-2" />
          Change Password
        </h3>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
            >
              {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button
            onClick={handleToggle2FA}
            variant={twoFactorEnabled ? 'danger' : 'primary'}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : twoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>
        
        {twoFactorEnabled && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400 flex items-center">
              <CheckIcon className="h-4 w-4 mr-2" />
              Two-factor authentication is enabled
            </p>
          </div>
        )}
      </Card>

      {/* Active Sessions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ComputerDesktopIcon className="h-5 w-5 mr-2" />
          Active Sessions
        </h3>
        
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <p className="text-white font-medium">{session.device}</p>
                  {session.current && (
                    <Badge variant="success" className="ml-2">Current</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {session.location} • {formatRelativeTime(session.lastActive)}
                </p>
                <p className="text-xs text-gray-500">{session.ip}</p>
              </div>
              
              {!session.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => revokeSession(session.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Wallet Tab Content
  const WalletTab = () => (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <WalletIcon className="h-5 w-5 mr-2" />
          Wallet Balance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">MCT Balance</p>
            <p className="text-2xl font-bold text-white">{walletInfo.balance}</p>
            <p className="text-sm text-gray-400">{walletInfo.usdValue}</p>
          </div>
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-sm text-gray-400">Wallet Address</p>
            <div className="flex items-center mt-2">
              <code className="text-sm text-white bg-gray-700 px-2 py-1 rounded flex-1 truncate">
                {walletInfo.address}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(walletInfo.address)}
                className="ml-2"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Wallets */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Wallets</h3>
        
        <div className="space-y-3">
          {walletInfo.connectedWallets.map((wallet, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center">
                <div className="h-10 w-10 bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                  <WalletIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{wallet.type}</p>
                  <p className="text-sm text-gray-400">{wallet.address}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Badge
                  variant={wallet.status === 'connected' ? 'success' : 'secondary'}
                  className="mr-2"
                >
                  {wallet.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  {wallet.status === 'connected' ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          Connect New Wallet
        </Button>
      </Card>

      {/* Transaction History */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        
        <div className="space-y-3">
          {[
            { type: 'purchase', model: 'GPT-4 Vision', amount: '-50.00', date: '2025-10-03' },
            { type: 'sale', model: 'Custom Classifier', amount: '+120.50', date: '2025-10-02' },
            { type: 'deposit', model: 'Wallet Deposit', amount: '+500.00', date: '2025-10-01' }
          ].map((tx, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={clsx(
                  'h-8 w-8 rounded-full flex items-center justify-center mr-3',
                  tx.type === 'purchase' && 'bg-red-500/20 text-red-400',
                  tx.type === 'sale' && 'bg-green-500/20 text-green-400',
                  tx.type === 'deposit' && 'bg-blue-500/20 text-blue-400'
                )}>
                  {tx.type === 'purchase' && <ArrowRightOnRectangleIcon className="h-4 w-4" />}
                  {tx.type === 'sale' && <CreditCardIcon className="h-4 w-4" />}
                  {tx.type === 'deposit' && <WalletIcon className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-white font-medium">{tx.model}</p>
                  <p className="text-sm text-gray-400">{tx.date}</p>
                </div>
              </div>
              
              <p className={clsx(
                'font-medium',
                tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
              )}>
                {tx.amount} MCT
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Notifications Tab Content
  const NotificationsTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
            { key: 'marketing', label: 'Marketing Communications', description: 'Receive updates about new features and promotions' },
            { key: 'security', label: 'Security Alerts', description: 'Important security notifications' },
            { key: 'modelUpdates', label: 'Model Updates', description: 'Notifications about model updates and new releases' },
            { key: 'purchases', label: 'Purchase Confirmations', description: 'Confirmations for purchases and transactions' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex-1">
                <p className="text-white font-medium">{setting.label}</p>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </div>
              
              <button
                onClick={() => handleNotificationChange(setting.key)}
                className={clsx(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notifications[setting.key] ? 'bg-blue-600' : 'bg-gray-600'
                )}
              >
                <span
                  className={clsx(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    notifications[setting.key] ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Privacy Tab Content
  const PrivacyTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
        
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['public', 'followers', 'private'].map((option) => (
                <button
                  key={option}
                  onClick={() => handlePrivacyChange('profileVisibility', option)}
                  className={clsx(
                    'p-3 rounded-lg border text-left transition-colors',
                    privacy.profileVisibility === option
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                  )}
                >
                  <p className="font-medium capitalize">{option}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {option === 'public' && 'Anyone can view your profile'}
                    {option === 'followers' && 'Only followers can view your profile'}
                    {option === 'private' && 'Only you can view your profile'}
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Other Privacy Settings */}
          <div className="space-y-4">
            {[
              { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
              { key: 'showActivity', label: 'Show Activity', description: 'Show your recent activity to other users' },
              { key: 'allowIndexing', label: 'Search Engine Indexing', description: 'Allow search engines to index your profile' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                
                <button
                  onClick={() => handlePrivacyChange(setting.key, !privacy[setting.key])}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    privacy[setting.key] ? 'bg-blue-600' : 'bg-gray-600'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      privacy[setting.key] ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  // Preferences Tab Content
  const PreferencesTab = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Application Preferences</h3>
        
        <div className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {['light', 'dark', 'auto'].map((option) => (
                <button
                  key={option}
                  onClick={() => handlePreferenceChange('theme', option)}
                  className={clsx(
                    'p-3 rounded-lg border text-left transition-colors',
                    preferences.theme === option
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                  )}
                >
                  <p className="font-medium capitalize">{option}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          
          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC-12">UTC-12 (Baker Island)</option>
              <option value="UTC-8">UTC-8 (Pacific Time)</option>
              <option value="UTC-5">UTC-5 (Eastern Time)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (Central European Time)</option>
              <option value="UTC+8">UTC+8 (China Standard Time)</option>
              <option value="UTC+9">UTC+9 (Japan Standard Time)</option>
            </select>
          </div>
          
          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
              <option value="MCT">MCT - ModelChain Token</option>
            </select>
          </div>
          
          {/* Toggle Settings */}
          <div className="space-y-4">
            {[
              { key: 'autoSave', label: 'Auto-save', description: 'Automatically save your work' },
              { key: 'compactMode', label: 'Compact Mode', description: 'Use a more compact interface layout' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{setting.label}</p>
                  <p className="text-sm text-gray-400">{setting.description}</p>
                </div>
                
                <button
                  onClick={() => handlePreferenceChange(setting.key, !preferences[setting.key])}
                  className={clsx(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    preferences[setting.key] ? 'bg-blue-600' : 'bg-gray-600'
                  )}
                >
                  <span
                    className={clsx(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      preferences[setting.key] ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );

  // Danger Zone Tab Content
  const DangerTab = () => (
    <div className="space-y-6">
      <Card className="p-6 border-red-500/30">
        <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          Danger Zone
        </h3>
        
        <div className="space-y-4">
          {/* Export Data */}
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Export Account Data</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Download a copy of your account data including models, reviews, and activity
                </p>
              </div>
              <Button variant="outline">
                Export Data
              </Button>
            </div>
          </div>
          
          {/* Deactivate Account */}
          <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-yellow-400 font-medium">Deactivate Account</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Temporarily deactivate your account. You can reactivate it anytime.
                </p>
              </div>
              <Button variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/10">
                Deactivate
              </Button>
            </div>
          </div>
          
          {/* Delete Account */}
          <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-red-400 font-medium">Delete Account</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <Button variant="danger">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Before you go...</h4>
              <p className="text-sm text-gray-400">
                Make sure to export your data and cancel any active subscriptions. 
                If you have published models, consider transferring ownership or archiving them.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account': return <AccountTab />;
      case 'security': return <SecurityTab />;
      case 'wallet': return <WalletTab />;
      case 'notifications': return <NotificationsTab />;
      case 'privacy': return <PrivacyTab />;
      case 'preferences': return <PreferencesTab />;
      case 'danger': return <DangerTab />;
      default: return <AccountTab />;
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'text-gray-300 hover:bg-gray-800/50 hover:text-white border border-transparent hover:border-cyan-500/30'
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <ChevronRightIcon className="h-4 w-4 ml-auto" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;