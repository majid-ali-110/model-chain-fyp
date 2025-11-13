import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import { AdjustmentsHorizontalIcon, ViewColumnsIcon, ListBulletIcon } from '@heroicons/react/24/outline';

const Browse = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [_sortBy, setSortBy] = useState('popular');
  const [_filterBy, setFilterBy] = useState('all');

  const models = [
    {
      id: 1,
      name: 'GPT-4 Clone',
      category: 'Language',
      price: '0.05 ETH',
      featured: true,
      trending: true
    },
    {
      id: 2,
      name: 'Image Classifier Pro',
      category: 'Computer Vision',
      price: '0.03 ETH',
      featured: false,
      trending: true
    }
  ];

  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Models' },
    { value: 'featured', label: 'Featured' },
    { value: 'trending', label: 'Trending' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Browse Models</h1>
          <p className="text-secondary-600">Discover AI models from the community</p>
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
          
          <div className="flex border border-secondary-200 rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'grid' ? 'bg-secondary-100' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <ViewColumnsIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`${viewMode === 'list' ? 'bg-secondary-100' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Featured Models</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.filter(model => model.featured).map(model => (
            <Card key={model.id} className="relative">
              <Badge className="absolute top-4 right-4" variant="primary">Featured</Badge>
              <Card.Header>
                <Card.Title>{model.name}</Card.Title>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{model.category}</Badge>
                  {model.trending && <Badge variant="success">Trending</Badge>}
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">{model.price}</span>
                  <Link to={`/marketplace/models/${model.id}`}>
                    <Button>View Model</Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>

      {/* All Models */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">All Models</h2>
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {models.map(model => (
            <Card key={model.id}>
              <Card.Header>
                <div className="flex items-start justify-between">
                  <Card.Title>{model.name}</Card.Title>
                  <div className="flex gap-1">
                    <Badge variant="secondary">{model.category}</Badge>
                    {model.trending && <Badge variant="success">Trending</Badge>}
                  </div>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">{model.price}</span>
                  <Link to={`/marketplace/models/${model.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;