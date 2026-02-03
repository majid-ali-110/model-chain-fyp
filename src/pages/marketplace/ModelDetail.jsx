import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  CalendarIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  BeakerIcon,
  BookOpenIcon,
  FlagIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ExclamationCircleIcon,
  FireIcon,
  SparklesIcon,
  LockClosedIcon,
  KeyIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  HeartIcon as HeartSolidIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon
} from '@heroicons/react/24/solid';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Input from '../../components/ui/Input';
import { useModel } from '../../contexts/ModelContext';
import { useWallet } from '../../contexts/WalletContext';

const ModelDetail = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const { models, getModelById } = useModel();
  const { connected, address } = useWallet();
  
  // State management
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pay-per-use');

  // Load model data from context
  useEffect(() => {
    const loadModel = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Try to find model in context
      const contextModel = getModelById ? getModelById(modelId) : models?.find(m => m.id === modelId);
      
      if (contextModel) {
        setModel(contextModel);
        setReviews(contextModel.reviews || []);
      } else {
        // Model not found - show empty state or placeholder
        setModel({
          id: modelId,
          name: 'Model Not Found',
          description: 'This model does not exist or has been removed from the marketplace.',
          notFound: true
        });
      }
      
      setIsLoading(false);
    };

    loadModel();
  }, [modelId, models, getModelById]);

  // Tab configuration
  const tabs = [
    { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
    { id: 'docs', name: 'Documentation', icon: DocumentTextIcon },
    { id: 'reviews', name: 'Reviews', icon: StarIcon, count: model?.stats?.reviews || 0 },
    { id: 'licensing', name: 'Licensing', icon: ScaleIcon }
  ];

  // Handle actions
  const handleFavorite = () => setIsFavorited(!isFavorited);
  const handleFollow = () => setIsFollowing(!isFollowing);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  const handlePurchase = async () => {
    setPurchaseLoading(true);
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Redirect to success page or show success modal
    } catch (error) {
      // Purchase failed
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!userReview.comment || userReview.rating === 0) return;
    
    setIsSubmittingReview(true);
    try {
      // Simulate review submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReviews(prev => [{
        id: Date.now(),
        user: { name: 'You', avatar: '👤', verified: true },
        rating: userReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: userReview.comment,
        helpful: 0,
        verified_purchase: true
      }, ...prev]);
      setUserReview({ rating: 0, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      console.error('Review submission failed:', error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
        <span className="ml-3 text-dark-text-secondary">Loading model details...</span>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-dark-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text-primary mb-2">Model not found</h2>
          <p className="text-dark-text-secondary mb-6">The model you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/marketplace/models')}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-surface-primary">
      {/* Header */}
      <div className="bg-dark-surface-secondary border-b border-dark-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/marketplace/models')}
              className="flex items-center text-dark-text-secondary hover:text-dark-text-primary"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Marketplace
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-dark-text-muted hover:text-dark-text-primary"
              >
                <ShareIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className={clsx(
                  'transition-colors',
                  isFavorited
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-dark-text-muted hover:text-red-400'
                )}
              >
                {isFavorited ? (
                  <HeartSolidIcon className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Model Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h1 className="text-3xl font-bold text-dark-text-primary mr-4">
                      {model.name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      {model.isHot && (
                        <Badge variant="accent" size="sm">
                          <FireIcon className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                      {model.isFeatured && (
                        <Badge variant="primary" size="sm">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {model.blockchain.verified && (
                        <Badge variant="success" size="sm">
                          <ShieldCheckIcon className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-lg text-dark-text-secondary mb-4">
                    {model.tagline}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarSolidIcon
                            key={i}
                            className={clsx(
                              'h-4 w-4',
                              i < Math.floor(model.stats.rating)
                                ? 'text-yellow-400'
                                : 'text-dark-surface-elevated'
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-dark-text-primary font-medium">
                        {model.stats.rating}
                      </span>
                      <span className="text-sm text-dark-text-muted ml-1">
                        ({model.stats.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-dark-text-muted">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      {model.stats.downloads.toLocaleString()} downloads
                    </div>
                    
                    <div className="flex items-center text-sm text-dark-text-muted">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {model.stats.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {model.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    <TagIcon className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="border-b border-dark-surface-elevated">
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
                        {tab.count && (
                          <span className="ml-2 bg-dark-surface-elevated text-dark-text-muted px-2 py-1 rounded-full text-xs">
                            {tab.count.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Description */}
                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                          About this model
                        </h3>
                        <p className="text-dark-text-secondary leading-relaxed mb-6">
                          {model.description}
                        </p>
                        
                        {/* Key Features */}
                        <div className="mb-6">
                          <h4 className="text-md font-medium text-dark-text-primary mb-3">
                            Key Features
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {model.features.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <CheckBadgeSolidIcon className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                                <span className="text-sm text-dark-text-secondary">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <h4 className="text-md font-medium text-dark-text-primary mb-3">
                            Use Cases
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {model.useCases.map((useCase, index) => (
                              <div key={index} className="flex items-center">
                                <SparklesIcon className="h-4 w-4 text-primary-400 mr-2 flex-shrink-0" />
                                <span className="text-sm text-dark-text-secondary">{useCase}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Technical Specifications */}
                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center">
                          <CpuChipIcon className="h-5 w-5 mr-2" />
                          Technical Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Model Type</h4>
                            <p className="text-dark-text-primary">{model.technical.modelType}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Parameters</h4>
                            <p className="text-dark-text-primary">{model.technical.parameters}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Context Length</h4>
                            <p className="text-dark-text-primary">{model.technical.contextLength}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">API Version</h4>
                            <p className="text-dark-text-primary">{model.technical.apiVersion}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Update Frequency</h4>
                            <p className="text-dark-text-primary">{model.technical.updateFrequency}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Supported Languages</h4>
                            <div className="flex flex-wrap gap-1">
                              {model.technical.languages.slice(0, 3).map((lang) => (
                                <Badge key={lang} variant="secondary" size="sm">{lang}</Badge>
                              ))}
                              {model.technical.languages.length > 3 && (
                                <Badge variant="secondary" size="sm">
                                  +{model.technical.languages.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Documentation Tab */}
                {activeTab === 'docs' && (
                  <div className="space-y-6">
                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center">
                          <BookOpenIcon className="h-5 w-5 mr-2" />
                          Quick Start Guide
                        </h3>
                        <p className="text-dark-text-secondary mb-4">
                          {model.documentation.quickStart}
                        </p>
                        <div className="bg-dark-surface-primary rounded-lg p-4">
                          <code className="text-sm text-green-400">
                            {`curl -X POST "https://api.modelchain.ai/v1/chat/completions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model.id}",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}
                          </code>
                        </div>
                      </div>
                    </Card>

                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                          API Reference
                        </h3>
                        <p className="text-dark-text-secondary mb-4">
                          {model.documentation.apiReference}
                        </p>
                        <Button variant="outline">
                          <DocumentTextIcon className="h-4 w-4 mr-2" />
                          View Full Documentation
                        </Button>
                      </div>
                    </Card>

                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                          SDKs & Libraries
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {model.documentation.sdks.map((sdk) => (
                            <div key={sdk} className="p-3 bg-dark-surface-primary rounded-lg">
                              <CodeBracketIcon className="h-6 w-6 text-primary-400 mb-2" />
                              <h4 className="font-medium text-dark-text-primary">{sdk}</h4>
                              <p className="text-xs text-dark-text-muted">Official SDK</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <Card variant="elevated">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-dark-text-primary">
                            Customer Reviews
                          </h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                          >
                            Write a Review
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-dark-text-primary mb-2">
                              {model.stats.rating}
                            </div>
                            <div className="flex items-center justify-center mb-2">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={clsx(
                                    'h-5 w-5',
                                    i < Math.floor(model.stats.rating)
                                      ? 'text-yellow-400'
                                      : 'text-dark-surface-elevated'
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-dark-text-muted">
                              Based on {model.stats.reviews.toLocaleString()} reviews
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <div key={rating} className="flex items-center">
                                <span className="text-sm text-dark-text-muted w-8">{rating}★</span>
                                <div className="flex-1 bg-dark-surface-primary rounded-full h-2 mx-3">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` }}
                                  />
                                </div>
                                <span className="text-sm text-dark-text-muted w-8">
                                  {rating === 5 ? '70%' : rating === 4 ? '20%' : rating === 3 ? '7%' : rating === 2 ? '2%' : '1%'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Review Form */}
                    {showReviewForm && (
                      <Card variant="elevated">
                        <div className="p-6">
                          <h4 className="text-md font-semibold text-dark-text-primary mb-4">
                            Write a Review
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                                Rating
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() => setUserReview(prev => ({ ...prev, rating }))}
                                    className="focus:outline-none"
                                  >
                                    <StarSolidIcon
                                      className={clsx(
                                        'h-6 w-6 transition-colors',
                                        rating <= userReview.rating
                                          ? 'text-yellow-400'
                                          : 'text-dark-surface-elevated hover:text-yellow-300'
                                      )}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                                Comment
                              </label>
                              <textarea
                                value={userReview.comment}
                                onChange={(e) => setUserReview(prev => ({ ...prev, comment: e.target.value }))}
                                placeholder="Share your experience with this model..."
                                rows={4}
                                className="w-full bg-dark-surface-primary border border-dark-surface-elevated rounded-lg px-3 py-2 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button
                                onClick={handleReviewSubmit}
                                loading={isSubmittingReview}
                                disabled={!userReview.comment || userReview.rating === 0}
                              >
                                Submit Review
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => setShowReviewForm(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.id} variant="elevated">
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center">
                                <div className="text-2xl mr-3">{review.user.avatar}</div>
                                <div>
                                  <div className="flex items-center">
                                    <h4 className="font-medium text-dark-text-primary">
                                      {review.user.name}
                                    </h4>
                                    {review.user.verified && (
                                      <CheckBadgeSolidIcon className="h-4 w-4 text-blue-400 ml-1" />
                                    )}
                                    {review.verified_purchase && (
                                      <Badge variant="success" size="sm" className="ml-2">
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <div className="flex items-center mr-2">
                                      {[...Array(5)].map((_, i) => (
                                        <StarSolidIcon
                                          key={i}
                                          className={clsx(
                                            'h-3 w-3',
                                            i < review.rating
                                              ? 'text-yellow-400'
                                              : 'text-dark-surface-elevated'
                                          )}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-xs text-dark-text-muted">
                                      {review.date}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-dark-text-secondary mb-4">
                              {review.comment}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center text-sm text-dark-text-muted hover:text-dark-text-primary">
                                  <HandThumbUpIcon className="h-4 w-4 mr-1" />
                                  Helpful ({review.helpful})
                                </button>
                                <button className="flex items-center text-sm text-dark-text-muted hover:text-dark-text-primary">
                                  <HandThumbDownIcon className="h-4 w-4 mr-1" />
                                  Not helpful
                                </button>
                              </div>
                              <Button variant="ghost" size="sm">
                                <FlagIcon className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Licensing Tab */}
                {activeTab === 'licensing' && (
                  <div className="space-y-6">
                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center">
                          <ScaleIcon className="h-5 w-5 mr-2" />
                          License Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-md font-medium text-dark-text-primary mb-3">
                              License Type
                            </h4>
                            <Badge variant="primary" size="lg">
                              {model.license.type}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium text-dark-text-primary mb-3">
                              Permissions
                            </h4>
                            <div className="space-y-2">
                              {model.license.permissions.map((permission) => (
                                <div key={permission} className="flex items-center">
                                  <CheckBadgeSolidIcon className="h-4 w-4 text-green-400 mr-2" />
                                  <span className="text-sm text-dark-text-secondary">{permission}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-md font-medium text-dark-text-primary mb-3">
                              Limitations
                            </h4>
                            <div className="space-y-2">
                              {model.license.limitations.map((limitation) => (
                                <div key={limitation} className="flex items-center">
                                  <ExclamationCircleIcon className="h-4 w-4 text-yellow-400 mr-2" />
                                  <span className="text-sm text-dark-text-secondary">{limitation}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-dark-surface-elevated">
                          <Button variant="outline">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            View Full License Agreement
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Blockchain Verification */}
                    <Card variant="elevated">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-dark-text-primary mb-4 flex items-center">
                          <ShieldCheckIcon className="h-5 w-5 mr-2" />
                          Blockchain Verification
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Contract Address</h4>
                            <div className="flex items-center">
                              <code className="text-sm bg-dark-surface-primary px-2 py-1 rounded text-primary-400">
                                {model.blockchain.contractAddress}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigator.clipboard.writeText(model.blockchain.contractAddress)}
                                className="ml-2"
                              >
                                <DocumentDuplicateIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Network</h4>
                            <Badge variant="secondary">{model.blockchain.network}</Badge>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">Verification Date</h4>
                            <p className="text-dark-text-primary">{model.blockchain.verificationDate}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-dark-text-muted mb-2">IPFS Hash</h4>
                            <code className="text-sm bg-dark-surface-primary px-2 py-1 rounded text-primary-400">
                              {model.blockchain.ipfsHash}
                            </code>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="text-md font-medium text-dark-text-primary mb-3">
                            Security Audits
                          </h4>
                          <div className="space-y-3">
                            {model.blockchain.audits.map((audit, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-dark-surface-primary rounded-lg">
                                <div className="flex items-center">
                                  <TrophyIcon className="h-5 w-5 text-yellow-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-dark-text-primary">{audit.company}</p>
                                    <p className="text-sm text-dark-text-muted">{audit.date}</p>
                                  </div>
                                </div>
                                <Badge
                                  variant={audit.status === 'Passed' ? 'success' : 'danger'}
                                  size="sm"
                                >
                                  {audit.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Purchase Card */}
              <Card variant="elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                    Pricing Plans
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Pay Per Use */}
                    <div
                      className={clsx(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all',
                        selectedPlan === 'pay-per-use'
                          ? 'border-primary-500 bg-primary-500/5'
                          : 'border-dark-surface-elevated hover:border-dark-surface-hover'
                      )}
                      onClick={() => setSelectedPlan('pay-per-use')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-text-primary">Pay Per Use</h4>
                        <input
                          type="radio"
                          checked={selectedPlan === 'pay-per-use'}
                          onChange={() => setSelectedPlan('pay-per-use')}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="text-2xl font-bold text-dark-text-primary">
                        ${model.pricing.payPerUse.price}
                      </div>
                      <div className="text-sm text-dark-text-muted">
                        {model.pricing.payPerUse.unit}
                      </div>
                    </div>

                    {/* Monthly Subscription */}
                    <div
                      className={clsx(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all',
                        selectedPlan === 'monthly'
                          ? 'border-primary-500 bg-primary-500/5'
                          : 'border-dark-surface-elevated hover:border-dark-surface-hover'
                      )}
                      onClick={() => setSelectedPlan('monthly')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-text-primary">Monthly</h4>
                        <input
                          type="radio"
                          checked={selectedPlan === 'monthly'}
                          onChange={() => setSelectedPlan('monthly')}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="text-2xl font-bold text-dark-text-primary">
                        ${model.pricing.subscription.monthly.price}
                      </div>
                      <div className="text-sm text-dark-text-muted">
                        {model.pricing.subscription.monthly.requests.toLocaleString()} requests/month
                      </div>
                    </div>

                    {/* Yearly Subscription */}
                    <div
                      className={clsx(
                        'p-4 rounded-lg border-2 cursor-pointer transition-all relative',
                        selectedPlan === 'yearly'
                          ? 'border-primary-500 bg-primary-500/5'
                          : 'border-dark-surface-elevated hover:border-dark-surface-hover'
                      )}
                      onClick={() => setSelectedPlan('yearly')}
                    >
                      <Badge variant="success" size="sm" className="absolute -top-2 -right-2">
                        Save {model.pricing.subscription.yearly.discount}%
                      </Badge>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-dark-text-primary">Yearly</h4>
                        <input
                          type="radio"
                          checked={selectedPlan === 'yearly'}
                          onChange={() => setSelectedPlan('yearly')}
                          className="text-primary-500 focus:ring-primary-500"
                        />
                      </div>
                      <div className="text-2xl font-bold text-dark-text-primary">
                        ${model.pricing.subscription.yearly.price}
                      </div>
                      <div className="text-sm text-dark-text-muted">
                        {model.pricing.subscription.yearly.requests.toLocaleString()} requests/year
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePurchase}
                      loading={purchaseLoading}
                    >
                      <CreditCardIcon className="h-5 w-5 mr-2" />
                      {purchaseLoading ? 'Processing...' : 'Purchase Access'}
                    </Button>
                    
                    <Button variant="outline" className="w-full" size="lg">
                      <BeakerIcon className="h-5 w-5 mr-2" />
                      Try Free Trial
                    </Button>
                  </div>

                  <div className="mt-4 text-center">
                    <Button variant="ghost" size="sm">
                      <BanknotesIcon className="h-4 w-4 mr-1" />
                      Enterprise pricing
                    </Button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dark-surface-elevated">
                    <div className="flex items-center justify-center space-x-4 text-sm text-dark-text-muted">
                      <div className="flex items-center">
                        <LockClosedIcon className="h-4 w-4 mr-1" />
                        Secure
                      </div>
                      <div className="flex items-center">
                        <KeyIcon className="h-4 w-4 mr-1" />
                        API Access
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Developer Info */}
              <Card variant="elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                    Developer
                  </h3>
                  
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="text-3xl">{model.provider.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-dark-text-primary">
                          {model.provider.name}
                        </h4>
                        {model.provider.verified && (
                          <CheckBadgeSolidIcon className="h-4 w-4 text-blue-400 ml-1" />
                        )}
                      </div>
                      <p className="text-sm text-dark-text-muted mb-2">
                        {model.provider.followers.toLocaleString()} followers
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-dark-text-muted">
                        <span>{model.provider.totalModels} models</span>
                        <span>Since {new Date(model.provider.joinDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-dark-text-secondary mb-4">
                    {model.provider.description}
                  </p>
                  
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    
                    <Button variant="ghost" className="w-full">
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Model Stats */}
              <Card variant="elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
                    Model Statistics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-dark-text-muted mr-2" />
                        <span className="text-sm text-dark-text-secondary">Created</span>
                      </div>
                      <span className="text-sm text-dark-text-primary">
                        {new Date(model.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 text-dark-text-muted mr-2" />
                        <span className="text-sm text-dark-text-secondary">Last Updated</span>
                      </div>
                      <span className="text-sm text-dark-text-primary">
                        {new Date(model.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <HeartIcon className="h-4 w-4 text-dark-text-muted mr-2" />
                        <span className="text-sm text-dark-text-secondary">Favorites</span>
                      </div>
                      <span className="text-sm text-dark-text-primary">
                        {model.stats.favorites.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;