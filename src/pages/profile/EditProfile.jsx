import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';

const EditProfile = () => {
  const navigate = useNavigate();
  const { connected, address, profile, updateProfile: updateWalletProfile } = useWallet();
  const { isAuthenticated, updateUser } = useAuth();
  const { updateProfile: updateUserProfile } = useUser();
  const { showSuccess, showError } = useNotification();

  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    username: '',
    email: '',
    bio: '',
    avatar: '',
    website: '',
  });

  useEffect(() => {
    if (!connected || !isAuthenticated || !address) {
      navigate('/connect-wallet');
      return;
    }

    setForm({
      displayName: profile?.displayName || profile?.name || '',
      username: profile?.username || '',
      email: profile?.email || '',
      bio: profile?.bio || '',
      avatar: profile?.avatar || '',
      website: profile?.social?.website || '',
    });
  }, [connected, isAuthenticated, address, profile, navigate]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.displayName.trim()) {
      showError('Display name is required.', { title: 'Validation Error' });
      return;
    }

    setIsSaving(true);

    try {
      const updates = {
        displayName: form.displayName.trim(),
        name: form.displayName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
        social: {
          ...(profile?.social || {}),
          website: form.website.trim(),
        },
      };

      await updateWalletProfile(updates);
      updateUser({
        name: updates.displayName,
        username: updates.username,
        email: updates.email,
        bio: updates.bio,
        avatar: updates.avatar,
      });
      await updateUserProfile({
        name: updates.displayName,
        username: updates.username,
        email: updates.email,
        bio: updates.bio,
        avatar: updates.avatar,
        social: updates.social,
      });

      showSuccess('Your profile has been updated.', { title: 'Profile Saved' });
      navigate('/profile');
    } catch (error) {
      showError(error.message || 'Failed to update profile.', { title: 'Save Failed' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/profile')}>
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title className="flex items-center">
            <PencilSquareIcon className="h-5 w-5 mr-2" />
            Edit Profile
          </Card.Title>
          <Card.Description>
            Update your public profile and identity details.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Display Name"
                value={form.displayName}
                onChange={(e) => onChange('displayName', e.target.value)}
                placeholder="Your display name"
                required
              />
              <Input
                label="Username"
                value={form.username}
                onChange={(e) => onChange('username', e.target.value)}
                placeholder="username"
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="Avatar (emoji or URL)"
              value={form.avatar}
              onChange={(e) => onChange('avatar', e.target.value)}
              placeholder="e.g. 🤖 or https://..."
            />

            <Input
              label="Website"
              type="url"
              inputMode="url"
              value={form.website}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://your-site.com"
            />

            <div>
              <label htmlFor="profile-bio" className="block text-sm font-medium text-dark-text-secondary mb-2">Bio</label>
              <textarea
                id="profile-bio"
                rows={4}
                maxLength={500}
                value={form.bio}
                onChange={(e) => onChange('bio', e.target.value)}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-white placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell others what you build..."
              />
              <p className="mt-1 text-xs text-dark-text-muted text-right">{form.bio.length}/500</p>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" loading={isSaving} disabled={isSaving} className="w-full sm:w-auto">
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default EditProfile;
