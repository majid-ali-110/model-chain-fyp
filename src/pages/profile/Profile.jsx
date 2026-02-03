import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  DocumentTextIcon,
  PhotoIcon,
  SpeakerWaveIcon,
  VideoCameraIcon,
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
  PencilIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon
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
import ModelCard from '../../components/models/ModelCard';
import { useWallet } from '../../contexts/WalletContext';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const { profile: userProfile, userModels: contextUserModels } = useUser();
  
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

  // Helper functions - Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'text': return DocumentTextIcon;
      case 'image': return PhotoIcon;
      case 'audio': return SpeakerWaveIcon;
      case 'video': return VideoCameraIcon;
      case 'code': return CodeBracketIcon;
      default: return CpuChipIcon;
    }
  };

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
  const handleFollowToggle = async () => {
    try {
      setIsFollowing(!isFollowing);
      setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch {
      // Revert on error
      setIsFollowing(isFollowing);
      setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
    }
  };

  // Handle share profile
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // Show toast notification
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
        <span className="ml-3 text-gray-400">Loading profile...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Profile not found</h2>
          <p className="text-gray-400 mb-6">The user profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/marketplace/models')}>
            Browse Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full -mx-6 -my-6">
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
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Cover
            </Button>
          )}
        </div>

        {/* Profile Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-24 sm:-mt-32">
            {/* Avatar */}
            <div className="flex items-end space-x-6">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-dark-surface-elevated rounded-full border-4 border-dark-surface-primary flex items-center justify-center text-6xl">
                  {profile.avatar || <UserSolidIcon className="h-20 w-20 text-dark-text-muted" />}
                </div>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center border-2 border-dark-surface-primary">
                    <CheckBadgeSolidIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Actions */}
              <div className="flex-1 flex justify-end pb-4">
                <div className="flex items-center space-x-3">
                  {!isCurrentUser && (
                    <>
                      <Button
                        variant={isFollowing ? "outline" : "primary"}
                        onClick={handleFollowToggle}
                        className="min-w-24"
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
                      <Button variant="outline" size="sm">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {isCurrentUser && (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/settings/profile')}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <EllipsisHorizontalIcon className="h-4 w-4" />
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
                        className="flex items-center hover:text-primary-400 transition-colors"
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {profile.website.replace(/^https?:\/\//, '')}
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
                  <div className="flex items-center space-x-6 mt-4">
                    <button className="hover:underline">
                      <span className="font-bold text-dark-text-primary">{followingCount.toLocaleString()}</span>
                      <span className="text-dark-text-muted ml-1">Following</span>
                    </button>
                    <button className="hover:underline">
                      <span className="font-bold text-dark-text-primary">{followersCount.toLocaleString()}</span>
                      <span className="text-dark-text-muted ml-1">Followers</span>
                    </button>
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
                      <ArrowDownTrayIcon className="h-6 w-6 text-secondary-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {(profile.stats.totalDownloads / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-dark-text-muted">Downloads</p>
                    </div>
                  </Card>
                  
                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <StarSolidIcon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {profile.stats.averageRating}
                      </p>
                      <p className="text-xs text-dark-text-muted">Avg Rating</p>
                    </div>
                  </Card>
                  
                  <Card variant="elevated" className="p-4">
                    <div className="text-center">
                      <EyeIcon className="h-6 w-6 text-accent-400 mx-auto mb-2" />
                      <p className="text-xl font-bold text-dark-text-primary">
                        {(profile.stats.totalViews / 1000).toFixed(0)}K
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-dark-text-muted hover:text-dark-text-primary hover:border-dark-surface-elevated'
                  )}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-dark-surface-elevated text-dark-text-muted px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Models Tab */}
        {activeTab === 'models' && (
          <div>
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userModels.map((model) => (
                  <ModelCard
                    key={model.id}
                    model={{
                      ...model,
                      provider: profile.displayName,
                      isHot: model.isHot || false,
                      isNew: model.isNew || false,
                      stats: {
                        rating: model.rating,
                        reviews: model.reviews,
                        downloads: model.downloads
                      }
                    }}
                    showBadges={true}
                    showStats={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
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
                          onClick={() => navigate(`/marketplace/model/${review.modelId}`)}
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
          <div>
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