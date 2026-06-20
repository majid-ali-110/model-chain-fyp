import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  WalletIcon,
  BellIcon,
  LockClosedIcon,
  ClipboardDocumentIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  PencilIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';

// Accessible on/off switch (hoisted to module scope so it is not re-created on
// every Settings render — avoids remount/focus bugs).
const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    className={clsx(
      'relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg-primary',
      checked ? 'bg-primary-600' : 'bg-dark-border-light'
    )}
  >
    <span
      className={clsx(
        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1'
      )}
    />
  </button>
);

const isImageAvatar = (value) =>
  typeof value === 'string' && /^(https?:|data:|blob:|\/)/.test(value);

const Settings = () => {
  const navigate = useNavigate();
  const { connected, address, balance, chainId, disconnectWallet } = useWallet();
  const { isAuthenticated, user, logout } = useAuth();
  const { profile } = useUser();
  const { showSuccess } = useNotification();

  const [activeTab, setActiveTab] = useState('account');

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

  // Redirect unauthenticated users to connect their wallet.
  useEffect(() => {
    if (!connected || !isAuthenticated) {
      navigate('/connect-wallet');
    }
  }, [connected, isAuthenticated, navigate]);

  const getNetworkInfo = (id) => {
    const networks = {
      '1': { name: 'Ethereum', currency: 'ETH', isTestnet: false },
      '137': { name: 'Polygon', currency: 'POL', isTestnet: false },
      '80002': { name: 'Polygon Amoy', currency: 'POL', isTestnet: true },
      '11155111': { name: 'Sepolia', currency: 'ETH', isTestnet: true },
      '31337': { name: 'Localhost', currency: 'POL', isTestnet: true }
    };
    return networks[id] || { name: 'Unknown', currency: 'POL', isTestnet: true };
  };
  const networkInfo = getNetworkInfo(chainId);

  const account = {
    username: profile?.username || '',
    displayName: profile?.name || profile?.displayName || user?.name || 'Anonymous',
    email: profile?.email || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || '👤',
    website: profile?.social?.website || '',
    joinedDate: profile?.joinedAt || null
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return Number.isNaN(d.getTime())
      ? '—'
      : d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: UserIcon },
    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'privacy', label: 'Privacy', icon: LockClosedIcon }
  ];

  const handleNotificationChange = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  const handlePrivacyChange = (key, value) =>
    setPrivacy((prev) => ({ ...prev, [key]: value }));

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address || '');
      showSuccess('Wallet address copied to clipboard', { title: 'Copied', duration: 3000 });
    } catch {
      /* clipboard unavailable */
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    logout();
    showSuccess('Wallet disconnected', { title: 'Signed out', duration: 3000 });
    navigate('/');
  };

  const handleTabKeyDown = (event) => {
    const ids = tabs.map((t) => t.id);
    const idx = ids.indexOf(activeTab);
    let next = null;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (idx + 1) % ids.length;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (idx - 1 + ids.length) % ids.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = ids.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActiveTab(ids[next]);
    document.getElementById(`settings-tab-${ids[next]}`)?.focus();
  };

  const panelProps = (id) => ({
    role: 'tabpanel',
    id: `settings-panel-${id}`,
    'aria-labelledby': `settings-tab-${id}`,
    tabIndex: 0,
    className: 'space-y-6 focus:outline-none'
  });

  return (
    <div className="page-content page-shell">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-text-muted">Manage your account, wallet, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation — horizontal scroll on mobile, vertical list on desktop */}
        <div className="lg:col-span-1">
          <nav
            role="tablist"
            aria-label="Settings sections"
            aria-orientation="vertical"
            onKeyDown={handleTabKeyDown}
            className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`settings-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`settings-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'w-full flex items-center whitespace-nowrap px-3 py-2 text-left rounded-lg transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                    selected
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-dark-text-secondary hover:bg-dark-surface-elevated hover:text-white border border-transparent hover:border-cyan-500/30'
                  )}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  {tab.label}
                  {selected && <ChevronRightIcon className="hidden lg:block h-4 w-4 ml-auto" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 min-w-0">
          {/* Account */}
          {activeTab === 'account' && (
            <div {...panelProps('account')}>
              <Card className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-16 w-16 flex-shrink-0 rounded-full bg-dark-surface-elevated flex items-center justify-center text-3xl overflow-hidden">
                      {isImageAvatar(account.avatar) ? (
                        <img src={account.avatar} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span aria-hidden="true">{account.avatar}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white truncate">{account.displayName}</h3>
                      {account.username && (
                        <p className="text-sm text-dark-text-muted truncate">@{account.username}</p>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => navigate('/profile/edit')}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <dl className="mt-6 divide-y divide-dark-border border-t border-dark-border">
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <dt className="w-32 flex-shrink-0 text-sm text-dark-text-muted">Email</dt>
                    <dd className="text-sm text-dark-text-primary break-words min-w-0">
                      {account.email || <span className="text-dark-text-muted">Not set</span>}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <dt className="w-32 flex-shrink-0 text-sm text-dark-text-muted">Bio</dt>
                    <dd className="text-sm text-dark-text-primary break-words min-w-0">
                      {account.bio || <span className="text-dark-text-muted">Not set</span>}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <dt className="w-32 flex-shrink-0 text-sm text-dark-text-muted">Website</dt>
                    <dd className="text-sm min-w-0">
                      {account.website ? (
                        <a
                          href={account.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary-400 hover:text-primary-300 break-all"
                        >
                          <GlobeAltIcon className="h-4 w-4 flex-shrink-0" />
                          {account.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-dark-text-muted">Not set</span>
                      )}
                    </dd>
                  </div>
                  <div className="py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <dt className="w-32 flex-shrink-0 text-sm text-dark-text-muted">Member since</dt>
                    <dd className="text-sm text-dark-text-primary">{formatDate(account.joinedDate)}</dd>
                  </div>
                </dl>
              </Card>
            </div>
          )}

          {/* Wallet */}
          {activeTab === 'wallet' && (
            <div {...panelProps('wallet')}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <WalletIcon className="h-5 w-5 mr-2" />
                  Wallet
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-surface-elevated rounded-lg">
                    <p className="text-sm text-dark-text-muted">
                      {networkInfo.currency} Balance{' '}
                      {networkInfo.isTestnet && <span className="text-xs text-yellow-500">(Testnet)</span>}
                    </p>
                    <p className="text-2xl font-bold text-white break-words">
                      {parseFloat(balance || '0').toFixed(4)} {networkInfo.currency}
                    </p>
                    <p className="text-sm text-dark-text-muted">{networkInfo.name}</p>
                  </div>

                  <div className="p-4 bg-dark-surface-elevated rounded-lg">
                    <p className="text-sm text-dark-text-muted">Wallet Address</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-sm text-white bg-dark-border px-2 py-1 rounded flex-1 min-w-0 truncate">
                        {address || '—'}
                      </code>
                      <Button variant="ghost" size="sm" onClick={copyAddress} aria-label="Copy wallet address">
                        <ClipboardDocumentIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <Button variant="outline" onClick={() => navigate('/wallet')} className="w-full sm:w-auto">
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                    Open Wallet Dashboard
                  </Button>
                  <Button variant="danger" onClick={handleDisconnect} className="w-full sm:w-auto">
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                    Disconnect Wallet
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30 flex items-start gap-3">
                  <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-dark-text-muted">
                    Your identity on ModelChain is your wallet. Keep your seed phrase safe — it is the only
                    way to recover access and is never stored by this app.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div {...panelProps('notifications')}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'push', label: 'Push Notifications', description: 'Receive browser push notifications' },
                    { key: 'marketing', label: 'Marketing Communications', description: 'Updates about new features and promotions' },
                    { key: 'security', label: 'Security Alerts', description: 'Important security notifications' },
                    { key: 'modelUpdates', label: 'Model Updates', description: 'Notifications about model updates and new releases' },
                    { key: 'purchases', label: 'Purchase Confirmations', description: 'Confirmations for purchases and transactions' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between gap-4 p-3 bg-dark-surface-elevated rounded-lg">
                      <div className="min-w-0">
                        <p className="text-white font-medium">{setting.label}</p>
                        <p className="text-sm text-dark-text-muted">{setting.description}</p>
                      </div>
                      <Toggle
                        checked={notifications[setting.key]}
                        onChange={() => handleNotificationChange(setting.key)}
                        label={`${setting.label} ${notifications[setting.key] ? 'on' : 'off'}`}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Privacy */}
          {activeTab === 'privacy' && (
            <div {...panelProps('privacy')}>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>

                <div className="space-y-6">
                  <div>
                    <p className="block text-sm font-medium text-dark-text-secondary mb-2">Profile Visibility</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Profile visibility">
                      {[
                        { value: 'public', desc: 'Anyone can view your profile' },
                        { value: 'followers', desc: 'Only followers can view your profile' },
                        { value: 'private', desc: 'Only you can view your profile' }
                      ].map((option) => {
                        const selected = privacy.profileVisibility === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => handlePrivacyChange('profileVisibility', option.value)}
                            className={clsx(
                              'p-3 rounded-lg border text-left transition-colors',
                              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                              selected
                                ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                                : 'border-dark-border bg-dark-surface-elevated text-dark-text-secondary hover:border-dark-border-light'
                            )}
                          >
                            <p className="font-medium capitalize">{option.value}</p>
                            <p className="text-xs text-dark-text-muted mt-1">{option.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'showEmail', label: 'Show Email Address', description: 'Display your email on your public profile' },
                      { key: 'showActivity', label: 'Show Activity', description: 'Show your recent activity to other users' },
                      { key: 'allowIndexing', label: 'Search Engine Indexing', description: 'Allow search engines to index your profile' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between gap-4 p-3 bg-dark-surface-elevated rounded-lg">
                        <div className="min-w-0">
                          <p className="text-white font-medium">{setting.label}</p>
                          <p className="text-sm text-dark-text-muted">{setting.description}</p>
                        </div>
                        <Toggle
                          checked={privacy[setting.key]}
                          onChange={() => handlePrivacyChange(setting.key, !privacy[setting.key])}
                          label={`${setting.label} ${privacy[setting.key] ? 'on' : 'off'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
