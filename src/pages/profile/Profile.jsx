import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  LinkIcon,
  GlobeAltIcon,
  StarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  HeartIcon,
  UserPlusIcon,
  UserMinusIcon,
  ShareIcon,
  CpuChipIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BoltIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  FlagIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTopRightOnSquareIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon,
  UserIcon as UserSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { getIPFSUrl } from '../../services/ipfs';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNotification } from '../../contexts/NotificationContext';

// Resolve a model image that may be a full URL, an ipfs:// URI, or a bare CID.
const resolveModelImage = (img) => {
  if (!img) return '';
  return /^https?:\/\//.test(img) ? img : getIPFSUrl(img);
};

const formatModelPrice = (price) => {
  const value = parseFloat(price);
  if (!value || Number.isNaN(value)) return 'Free';
  return `${value.toFixed(4)} POL`;
};

/**
 * Card for a model published by the profile owner. Built for showcasing
 * (the whole card links to the model's detail page) rather than buying — the
 * marketplace buy-card was the wrong fit and used a mismatched data shape.
 */
const PublishedModelCard = ({ model }) => {
  const [imageOk, setImageOk] = useState(true);
  const imageUrl = resolveModelImage(model.image);
  const isFree = !parseFloat(model.price);

  return (
    <Link
      to={`/marketplace/models/${model.id}`}
      className={clsx(
        'group flex flex-col h-full rounded-xl border border-dark-border bg-dark-surface overflow-hidden',
        'transition-colors hover:border-primary-500/50',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg-primary'
      )}
    >
      <div className="relative aspect-video bg-dark-surface-elevated overflow-hidden">
        {imageUrl && imageOk ? (
          <img
            src={imageUrl}
            alt={model.name}
            loading="lazy"
            onError={() => setImageOk(false)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/15 to-secondary-500/15">
            <CpuChipIcon className="h-12 w-12 text-primary-400/70" />
          </div>
        )}
        {model.category && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium capitalize bg-dark-bg-primary/80 text-dark-text-secondary backdrop-blur-sm">
            {model.category}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-dark-text-primary truncate group-hover:text-primary-400 transition-colors">
          {model.name}
        </h3>
        <p className="mt-1 text-sm text-dark-text-secondary line-clamp-2 flex-1">
          {model.description || 'No description provided.'}
        </p>

        <div className="mt-3 pt-3 border-t border-dark-border flex items-center justify-between gap-2">
          <span className={clsx('text-sm font-semibold', isFree ? 'text-accent-400' : 'text-primary-400')}>
            {formatModelPrice(model.price)}
          </span>
          <span className="flex items-center gap-3 text-xs text-dark-text-muted">
            <span className="inline-flex items-center gap-1">
              <ArrowDownTrayIcon className="h-3.5 w-3.5" />
              {model.downloads ?? 0}
            </span>
            {model.rating > 0 && (
              <span className="inline-flex items-center gap-1">
                <StarSolidIcon className="h-3.5 w-3.5 text-yellow-400" />
                {Number(model.rating).toFixed(1)}
              </span>
            )}
          </span>
        </div>

        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-400">
          View details
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
};

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const { profile: userProfile, userModels: contextUserModels } = useUser();
  const { showSuccess } = useNotification();
  
  // State management
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('models');
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userModels, setUserModels] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // Load profile from context
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      
      // Check if viewing own profile
      const isOwnProfile = !userId || userId === address;
      setIsCurrentUser(isOwnProfile);
      
      if (isOwnProfile && userProfile) {
        // Use profile from context
        const profileData = {
          id: address,
          username: userProfile.username || address?.slice(0, 8),
          displayName: userProfile.name || user?.name || 'Anonymous',
          email: userProfile.email || '',
          bio: userProfile.bio || 'No bio yet',
          avatar: userProfile.avatar || '👤',
          coverImage: null,
          location: '',
          website: userProfile.social?.website || '',
          joinDate: userProfile.joinedAt || new Date().toISOString(),
          verified: false,
          isPro: userProfile.role === 'developer' || userProfile.role === 'validator',
          stats: {
            modelsPublished: contextUserModels?.length || 0,
            totalDownloads: 0,
            totalStars: 0,
            reviewsWritten: 0,
            averageRating: 0,
            totalViews: 0,
            followers: 0,
            following: 0
          },
          badges: [],
          specialties: [],
          socialLinks: userProfile.social || {}
        };

        setProfile(profileData);
        setFollowersCount(0);
        setFollowingCount(0);
        setUserModels(contextUserModels || []);
        setUserReviews([]);
        setUserActivity([]);
      } else if (!isOwnProfile) {
        // Viewing another user's profile - TODO: fetch from blockchain
        setProfile(null);
      }
      
      setIsLoading(false);
    };

    if (connected && isAuthenticated) {
      loadProfile();
    } else {
      navigate('/connect-wallet');
    }
  }, [userId, address, userProfile, user, contextUserModels, connected, isAuthenticated, navigate]);

  // Format a count as a compact, honest number (e.g. 0, 950, 1.2K, 3.4M).
  const formatStat = (value) => {
    const num = Number(value) || 0;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
    return num.toLocaleString();
  };

  // Detect whether an avatar value is an image source vs. an emoji/initial.
  const isImageAvatar = (value) =>
    typeof value === 'string' && /^(https?:|data:|blob:|\/)/.test(value);

  // Tab configuration
  const tabs = [
    { 
      id: 'models', 
      name: 'Models', 
      count: profile?.stats.modelsPublished,
      icon: CpuChipIcon 
    },
    { 
      id: 'reviews', 
      name: 'Reviews', 
      count: profile?.stats.reviewsWritten,
      icon: StarIcon 
    },
    { 
      id: 'activity', 
      name: 'Activity', 
      icon: ClockIcon 
    }
  ];

  // Handle follow/unfollow
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  // Handle share profile — copy link and confirm with a toast so the user
  // gets clear feedback that the action succeeded.
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile?.displayName} on ModelChain`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      showSuccess('Profile link copied to clipboard', { title: 'Link copied', duration: 3000 });
    } catch {
      // User cancelled the share sheet, or clipboard was unavailable — no-op.
    }
  };

  // Keyboard navigation for the tab list (Left/Right/Home/End).
  const handleTabKeyDown = (event) => {
    const ids = tabs.map((t) => t.id);
    const currentIndex = ids.indexOf(activeTab);
    let nextIndex = null;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % ids.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + ids.length) % ids.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = ids.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    setActiveTab(ids[nextIndex]);
    document.getElementById(`profile-tab-${ids[nextIndex]}`)?.focus();
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'model_published': return CpuChipIcon;
      case 'review_written': return StarIcon;
      case 'model_favorited': return HeartIcon;
      case 'achievement_earned': return TrophyIcon;
      case 'model_updated': return PencilIcon;
      default: return ClockIcon;
    }
  };

  // Format relative time
  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
        <span className="ml-3 text-dark-text-muted">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-dark-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Profile not found</h2>
          <p className="text-dark-text-muted mb-6">The user profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/marketplace/models')}>
            Browse Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Cover Image & Header */}
      <div className="relative">
        {/* Cover Image */}
        <div 
          className="h-64 sm:h-80 bg-gradient-to-br from-primary-500 to-secondary-500 relative overflow-hidden"
          style={{
            backgroundImage: profile.coverImage ? `url(${profile.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black/20" />
          {isCurrentUser && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile/edit')}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>

        {/* Profile Header */}
        <div className="page-shell max-w-4xl">
          <div className="relative -mt-24 sm:-mt-32">
            {/* Avatar */}
            <div className="flex items-end space-x-6">
              <div className="relative">
                <div className="w-28 h-28 sm:w-40 sm:h-40 bg-dark-surface-elevated rounded-full border-4 border-dark-surface-primary flex items-center justify-center text-6xl overflow-hidden">
                  {isImageAvatar(profile.avatar) ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.displayName}'s avatar`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span aria-hidden="true">
                      {profile.avatar || <UserSolidIcon className="h-20 w-20 text-dark-text-muted" />}
                    </span>
                  )}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500/100 rounded-full flex items-center justify-center border-2 border-dark-surface-primary">
                    <CheckBadgeSolidIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Actions */}
              <div className="flex-1 flex justify-end pb-4">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {!isCurrentUser && (
                    <>
                      <Button
                        variant={isFollowing ? "outline" : "primary"}
                        onClick={handleFollowToggle}
                        className="min-w-[6rem]"
                      >
                        {isFollowing ? (
                          <>
                            <UserMinusIcon className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" aria-label={`Message ${profile.displayName}`}>
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/profile/edit')}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleShare} aria-label="Share profile link">
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-dark-text-primary">
                      {profile.displayName}
                    </h1>
                    {profile.badges.map((badge) => {
                      const IconComponent = badge.icon;
                      return (
                        <div
                          key={badge.id}
                          className="flex items-center"
                          title={badge.name}
                        >
                          <IconComponent className={clsx('h-5 w-5', badge.color)} />
                        </div>
                      );
                    })}
                  </div>
                  
                  <p className="text-dark-text-muted mb-2">@{profile.username}</p>
                  
                  {/* Bio */}
                  <div className="mb-4">
                    <p className={clsx(
                      'text-dark-text-secondary leading-relaxed',
                      !showFullBio && profile.bio.length > 200 && 'line-clamp-3'
                    )}>
                      {profile.bio}
                    </p>
                    {profile.bio.length > 200 && (
                      <button
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="text-primary-400 hover:text-primary-300 text-sm mt-1"
                      >
                        {showFullBio ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-text-muted">
                    {profile.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {profile.location}
                      </div>
                    )}
                    
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center min-w-0 max-w-full hover:text-primary-400 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>

                  {/* Follower Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <span>
                      <span className="font-bold text-dark-text-primary">{followingCount.toLocaleString()}</span>
                      <span className="text-dark-text-muted ml-1">Following</span>
                    </span>
                    <span>
                      <span className="font-bold text-dark-text-primary">{followersCount.toLocaleString()}</span>
                      <span className="text-dark-text-muted ml-1">Followers</span>
                    </span>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 mt-6 sm:mt-0 sm:ml-8 sm:max-w-sm">
                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <CpuChipIcon className="h-6 w-6 text-primary-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {profile.stats.modelsPublished}
                      </p>
                      <p className="text-xs text-dark-text-muted">Models</p>
                    </div>
                  </Card>
                  
                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <ArrowDownTrayIcon className="h-6 w-6 text-dark-text-muted mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {formatStat(profile.stats.totalDownloads)}
                      </p>
                      <p className="text-xs text-dark-text-muted">Downloads</p>
                    </div>
                  </Card>

                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <StarSolidIcon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {profile.stats.averageRating > 0 ? profile.stats.averageRating.toFixed(1) : '—'}
                      </p>
                      <p className="text-xs text-dark-text-muted">Avg Rating</p>
                    </div>
                  </Card>

                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <EyeIcon className="h-6 w-6 text-accent-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {formatStat(profile.stats.totalViews)}
                      </p>
                      <p className="text-xs text-dark-text-muted">Views</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="border-b border-dark-surface-elevated">
        <div className="page-shell max-w-4xl">
          <nav
            role="tablist"
            aria-label="Profile sections"
            onKeyDown={handleTabKeyDown}
            className="flex gap-6 sm:gap-8 overflow-x-auto"
          >
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`profile-tab-${tab.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`profile-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:rounded-sm',
                    selected
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-text-muted hover:text-dark-text-primary hover:border-dark-surface-elevated'
                  )}
                >
                  <IconComponent className="h-4 w-4 mr-2 flex-shrink-0" />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-dark-surface-elevated text-dark-text-muted px-2 py-0.5 rounded-full text-xs">
                      {tab.count ?? 0}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="page-shell max-w-4xl py-8">
        {/* Models Tab */}
        {activeTab === 'models' && (
          <div role="tabpanel" id="profile-panel-models" aria-labelledby="profile-tab-models" tabIndex={0} className="focus:outline-none">
            {userModels.length === 0 ? (
              <div className="text-center py-12">
                <CpuChipIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  No models published yet
                </h3>
                <p className="text-dark-text-secondary">
                  {isCurrentUser
                    ? "Start building and sharing your AI models with the community."
                    : `${profile.displayName} hasn't published any models yet.`
                  }
                </p>
                {isCurrentUser && (
                  <Button onClick={() => navigate('/developer/upload')} className="mt-6">
                    <CpuChipIcon className="h-4 w-4 mr-2" />
                    Upload a Model
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userModels.map((model) => (
                  <PublishedModelCard key={model.id} model={model} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div role="tabpanel" id="profile-panel-reviews" aria-labelledby="profile-tab-reviews" tabIndex={0} className="focus:outline-none">
            {userReviews.length === 0 ? (
              <div className="text-center py-12">
                <StarIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  No reviews written yet
                </h3>
                <p className="text-dark-text-secondary">
                  {isCurrentUser 
                    ? "Share your experience by reviewing models you've used."
                    : `${profile.displayName} hasn't written any reviews yet.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userReviews.map((review) => (
                  <Card key={review.id} variant="elevated">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-dark-text-primary mb-1">
                            Review for {review.modelName}
                          </h4>
                          <div className="flex items-center">
                            <div className="flex items-center mr-3">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={clsx(
                                    'h-4 w-4',
                                    i < review.rating
                                      ? 'text-yellow-400'
                                      : 'text-dark-surface-elevated'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-dark-text-muted">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                            {review.verified && (
                              <Badge variant="success" size="sm" className="ml-2">
                                Verified Purchase
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-dark-text-secondary mb-4">
                        {review.comment}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-dark-text-muted">
                          <button className="flex items-center hover:text-dark-text-primary">
                            <HandThumbUpIcon className="h-4 w-4 mr-1" />
                            Helpful ({review.helpful})
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/marketplace/models/${review.modelId}`)}
                        >
                          View Model
                          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div role="tabpanel" id="profile-panel-activity" aria-labelledby="profile-tab-activity" tabIndex={0} className="focus:outline-none">
            {userActivity.length === 0 ? (
              <div className="text-center py-12">
                <ClockIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-medium text-dark-text-primary mb-2">
                  No recent activity
                </h3>
                <p className="text-dark-text-secondary">
                  {isCurrentUser 
                    ? "Your activity will appear here as you use ModelChain."
                    : `${profile.displayName} hasn't been active recently.`
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <Card key={activity.id} variant="elevated">
                      <div className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className={clsx(
                            'p-2 rounded-lg mt-0.5',
                            activity.type === 'model_published' && 'bg-blue-500/10',
                            activity.type === 'review_written' && 'bg-yellow-500/10',
                            activity.type === 'model_favorited' && 'bg-red-500/10',
                            activity.type === 'achievement_earned' && 'bg-purple-500/10',
                            activity.type === 'model_updated' && 'bg-green-500/10'
                          )}>
                            <IconComponent className={clsx(
                              'h-5 w-5',
                              activity.type === 'model_published' && 'text-blue-400',
                              activity.type === 'review_written' && 'text-yellow-400',
                              activity.type === 'model_favorited' && 'text-red-400',
                              activity.type === 'achievement_earned' && 'text-purple-400',
                              activity.type === 'model_updated' && 'text-green-400'
                            )} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-dark-text-primary">
                              {activity.action}
                            </p>
                            <p className="text-xs text-dark-text-muted mt-1">
                              {formatRelativeTime(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;