import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import { AdjustmentsHorizontalIcon, ViewColumnsIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { useModel } from '../../contexts/ModelContext';

const Browse = () => {
  const { models, loading } = useModel();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [filterBy, setFilterBy] = useState('all');

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Models' },
    { value: 'verified', label: 'Verified' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' },
    { value: 'listed', label: 'Listed for Sale' }
  ];

  const displayedModels = useMemo(() => {
    const filtered = models.filter((model) => {
      if (filterBy === 'all') return true;
      if (filterBy === 'verified') return model.verified;
      if (filterBy === 'free') return parseFloat(model.price || '0') === 0;
      if (filterBy === 'premium') return parseFloat(model.price || '0') > 0;
      if (filterBy === 'listed') return model.isListed;
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'price-low':
          return parseFloat(a.price || '0') - parseFloat(b.price || '0');
        case 'price-high':
          return parseFloat(b.price || '0') - parseFloat(a.price || '0');
        case 'rating':
          return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
        case 'popular':
        default:
          return (b.downloads || 0) - (a.downloads || 0);
      }
    });
  }, [models, filterBy, sortBy]);

  const featuredModels = displayedModels.filter((model) => model.verified).slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary">Browse Models</h1>
          <p className="text-dark-text-tertiary">Discover AI models from the community</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dropdown
            trigger={(
              <Button variant="outline" size="sm">
                <AdjustmentsHorizontalIcon className="h-4 w-4" />
                Filter
              </Button>
            )}
            items={filterOptions.map(option => ({
              label: option.label,
              onClick: () => setFilterBy(option.value)
            }))}
          />
          
          <Dropdown
            trigger={(
              <Button variant="outline" size="sm">
                Sort by
              </Button>
            )}
            items={sortOptions.map(option => ({
              label: option.label,
              onClick: () => setSortBy(option.value)
            }))}
          />
          
          <div className="flex border border-dark-border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'grid' ? 'bg-dark-surface-elevated' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <ViewColumnsIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'list' ? 'bg-dark-surface-elevated' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div>
        <h2 className="text-lg font-semibold text-dark-text-primary mb-4">Featured Models</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredModels.map(model => (
            <Card key={model.id} className="relative">
              <Badge className="absolute top-4 right-4" variant="primary">Featured</Badge>
              <Card.Header>
                <Card.Title>{model.name}</Card.Title>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{model.category}</Badge>
                  {model.verified && <Badge variant="success">Verified</Badge>}
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-400">
                    {parseFloat(model.price || '0') > 0 ? `${model.price} ETH` : 'Free'}
                  </span>
                  <Link to={`/marketplace/models/${model.id}`}>
                    <Button>View Model</Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
          {!loading && featuredModels.length === 0 && (
            <Card>
              <Card.Content>
                <p className="text-dark-text-tertiary">No featured models available yet.</p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>

      {/* All Models */}
      <div>
        <h2 className="text-lg font-semibold text-dark-text-primary mb-4">All Models</h2>
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {displayedModels.map(model => (
            <Card key={model.id}>
              <Card.Header>
                <div className="flex items-start justify-between">
                  <Card.Title>{model.name}</Card.Title>
                  <div className="flex gap-1">
                    <Badge variant="secondary">{model.category}</Badge>
                    {model.verified && <Badge variant="success">Verified</Badge>}
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-400">
                    {parseFloat(model.price || '0') > 0 ? `${model.price} ETH` : 'Free'}
                  </span>
                  <Link to={`/marketplace/models/${model.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
          {!loading && displayedModels.length === 0 && (
            <Card>
              <Card.Content>
                <p className="text-dark-text-tertiary">No models match current filters.</p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Browse;