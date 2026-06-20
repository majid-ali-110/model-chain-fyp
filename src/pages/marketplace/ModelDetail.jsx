import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  StarIcon,
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { useModel } from '../../contexts/ModelContext';
import { useWallet } from '../../contexts/WalletContext';

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { models, getModelById, loadModels, purchaseModel, rateModel } = useModel();
  const { connected, address } = useWallet();

  const [loading, setLoading] = useState(true);
  const [purchasePending, setPurchasePending] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [purchaseError, setPurchaseError] = useState('');

  const [ratingValue, setRatingValue] = useState(0);
  const [ratingPending, setRatingPending] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [ratingError, setRatingError] = useState('');

  const [localReviews, setLocalReviews] = useState([]);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      if ((!models || models.length === 0) && loadModels) {
        await loadModels();
      }
      setLoading(false);
    };

    bootstrap();
  }, [models.length, loadModels]);

  const model = useMemo(() => getModelById?.(id), [getModelById, id, models]);
  const isOwner = Boolean(connected && address && model?.owner && model.owner.toLowerCase() === address.toLowerCase());

  const canPurchase = connected && model?.isListed && !isOwner;

  const handlePurchase = async () => {
    if (!model) return;
    setPurchasePending(true);
    setPurchaseMessage('');
    setPurchaseError('');

    const result = await purchaseModel(model.id, 0);
    if (result.success) {
      setPurchaseMessage('Purchase completed successfully. Access granted for this model.');
    } else {
      setPurchaseError(result.error || 'Purchase failed.');
    }

    setPurchasePending(false);
  };

  const handleRate = async () => {
    if (!model || ratingValue < 1 || ratingValue > 5) return;
    setRatingPending(true);
    setRatingMessage('');
    setRatingError('');

    const result = await rateModel(model.id, ratingValue);
    if (result.success) {
      setRatingMessage('Rating submitted on-chain.');
      setLocalReviews((prev) => [
        {
          id: Date.now().toString(),
          wallet: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'You',
          rating: ratingValue
        },
        ...prev
      ]);
      setRatingValue(0);
    } else {
      setRatingError(result.error || 'Rating failed.');
    }

    setRatingPending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center">
        <Loading variant="spinner" size="lg" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-dark-surface-primary flex items-center justify-center px-4">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-dark-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-dark-text-primary mb-2">Model not found</h2>
          <p className="text-dark-text-secondary mb-6">This model could not be loaded from the registry.</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" onClick={() => navigate('/marketplace/models')} className="mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-dark-text-primary">{model.name}</h1>
                    <p className="text-dark-text-secondary mt-2">{model.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{model.category}</Badge>
                    {model.verified && (
                      <Badge variant="success">
                        <ShieldCheckIcon className="h-3 w-3 mr-1" />
                        Validated
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-dark-text-muted">Rating</p>
                    <p className="text-dark-text-primary font-semibold">{model.rating || 0} / 5</p>
                  </div>
                  <div>
                    <p className="text-dark-text-muted">Total Ratings</p>
                    <p className="text-dark-text-primary font-semibold">{model.totalRatings || 0}</p>
                  </div>
                  <div>
                    <p className="text-dark-text-muted">Downloads</p>
                    <p className="text-dark-text-primary font-semibold flex items-center">
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      {(model.downloads || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-dark-text-muted">Owner</p>
                    <p className="text-dark-text-primary font-semibold">
                      {model.owner ? `${model.owner.slice(0, 6)}...${model.owner.slice(-4)}` : 'Unknown'}
                    </p>
                  </div>
                </div>

                {(model.tags || []).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            <Card variant="elevated">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Rate This Model</h2>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} onClick={() => setRatingValue(value)} className="focus:outline-none" type="button">
                      {value <= ratingValue ? (
                        <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-6 w-6 text-dark-surface-elevated" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Button onClick={handleRate} loading={ratingPending} disabled={!connected || ratingValue === 0}>
                    Submit Rating
                  </Button>
                  {!connected && <span className="text-sm text-dark-text-muted">Connect wallet to rate.</span>}
                </div>
                {ratingMessage && <p className="text-sm text-green-400 mt-3">{ratingMessage}</p>}
                {ratingError && <p className="text-sm text-red-400 mt-3">{ratingError}</p>}
              </div>
            </Card>

            {localReviews.length > 0 && (
              <Card variant="elevated">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Recent Ratings</h2>
                  <div className="space-y-3">
                    {localReviews.map((review) => (
                      <div key={review.id} className="flex items-center justify-between p-3 bg-dark-surface-primary rounded-lg">
                        <span className="text-dark-text-secondary">{review.wallet}</span>
                        <span className="text-yellow-400 font-semibold">{review.rating}★</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="elevated">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Purchase Access</h2>

                <div className="mb-5">
                  <p className="text-sm text-dark-text-muted">Price</p>
                  <p className="text-3xl font-bold text-dark-text-primary flex items-center">
                    <CurrencyDollarIcon className="h-6 w-6 mr-1" />
                    {parseFloat(model.price || '0') > 0 ? `${model.price} POL` : 'Free'}
                  </p>
                  <p className="text-xs text-dark-text-muted mt-1">
                    {model.isListed ? 'Listed in marketplace' : 'Not listed yet'}
                  </p>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePurchase}
                  loading={purchasePending}
                  disabled={!canPurchase}
                >
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Purchase Access
                </Button>

                <Link to={`/sandbox?model=${model.id}`} className="block mt-3">
                  <Button variant="outline" className="w-full">
                    <BeakerIcon className="h-5 w-5 mr-2" />
                    Try in Sandbox
                  </Button>
                </Link>

                {!connected && (
                  <p className="text-sm text-dark-text-muted mt-3">
                    Connect your wallet first. <Link className="text-primary-400" to="/connect-wallet">Connect Wallet</Link>
                  </p>
                )}

                {connected && !model.isListed && (
                  <p className="text-sm text-yellow-400 mt-3">This model is not listed for sale yet.</p>
                )}

                {isOwner && (
                  <p className="text-sm text-dark-text-muted mt-3">You own this model, so purchase is disabled.</p>
                )}

                {purchaseMessage && <p className="text-sm text-green-400 mt-3">{purchaseMessage}</p>}
                {purchaseError && <p className="text-sm text-red-400 mt-3">{purchaseError}</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
