import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { 
  MagnifyingGlassIcon, 
  StarIcon,
  AdjustmentsHorizontalIcon,
  PlayIcon,
  CurrencyDollarIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useModel } from '../../contexts/ModelContext';

const Models = () => {
  const { models, categories } = useModel();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, _setMinPrice] = useState(0);
  const [maxPrice, _setMaxPrice] = useState(10);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popular'); // popular, newest, price-low, price-high

  // Categories with "all" option
  const allCategories = ['all', ...categories];

  // Filter and sort models
  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          model.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
      const matchesPrice = (model.price || 0) >= minPrice && (model.price || 0) <= maxPrice;
      const matchesRating = (model.rating || 0) >= minRating;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'popular':
        default:
          return (b.downloads || 0) - (a.downloads || 0);
      }
    });
  }, [models, searchTerm, selectedCategory, minPrice, maxPrice, minRating, sortBy]);

  // Empty state when no models
  if (models.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CubeIcon className="h-16 w-16 text-dark-text-muted mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-dark-text-primary mb-2">No Models Yet</h2>
            <p className="text-dark-text-secondary mb-6">Be the first to upload a model to the marketplace!</p>
            <Link to="/developer/upload">
              <Button variant="primary">Upload Model</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Search and Filters Header */}
          <div className="bg-surface-primary rounded-xl p-4 space-y-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search models..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={MagnifyingGlassIcon}
                  className="bg-surface-secondary"
                />
              </div>
              
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMinRating(4.5)}
                  className="flex items-center gap-1"
                >
                  <StarIcon className="h-4 w-4" />
                  4.5+
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setSortBy(sortBy === 'newest' ? 'popular' : 'newest')}
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4" />
                  {sortBy === 'newest' ? 'Popular' : 'Newest'}
                </Button>
              </div>
            </div>

              {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-dark-text-muted">
              Showing {filteredModels.length} models
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSortBy('price-low')}
                className={sortBy === 'price-low' ? 'border-primary-500' : ''}
              >
                Price: Low to High
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSortBy('price-high')}
                className={sortBy === 'price-high' ? 'border-primary-500' : ''}
              >
                Price: High to Low
              </Button>
            </div>
          </div>

          {/* Models Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map(model => (
              <Card 
                key={model.id} 
                className={clsx(
                  'h-full transition-all duration-300 hover:shadow-lg overflow-hidden',
                  model.featured && 'border-2 border-primary-500/30',
                  'hover:border-primary-500/50'
                )}
              >
                {/* Model Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                  <img
                    src={model.thumbnail || (() => {
                      const aiImages = [
                        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1676277791608-ac36a5fc80e3?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
                        'https://images.unsplash.com/photo-1675271591843-b127ce24ba6f?w=400&h=300&fit=crop'
                      ];
                      const hash = model.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      return aiImages[hash % aiImages.length];
                    })()}
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }}
                  />
                  {model.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="primary" className="shadow-lg">Featured</Badge>
                    </div>
                  )}
                  {model.verified && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="success" className="shadow-lg">Verified</Badge>
                    </div>
                  )}
                </div>

                <Card.Header>
                  <div className="flex items-start justify-between">
                    <div>
                      <Card.Title className="text-lg flex items-center gap-2">
                        {model.name}
                      </Card.Title>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-dark-text-muted">by {model.developer.name}</p>
                        {model.developer.verified && (
                          <Badge variant="outline" size="sm" className="text-xs">Verified Developer</Badge>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={model.featured ? 'primary' : 'secondary'}
                      className="whitespace-nowrap"
                    >
                      {model.category}
                    </Badge>
                  </div>
                </Card.Header>
                
                <Card.Content>
                  <div className="space-y-4">
                    <p className="text-dark-text-muted line-clamp-3">{model.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-dark-text-muted">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="font-medium">{model.rating}</span>
                          <span className="text-xs">({model.reviewCount})</span>
                        </div>
                        <span>{model.downloads.toLocaleString()} downloads</span>
                      </div>
                      <Badge variant="outline" size="sm" className="text-xs">
                        {model.accuracy}% Accuracy
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {model.tags.map(tag => (
                      <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-bold text-primary-500">
                      {model.price === 0 ? 'Free' : `${model.price} ${model.currency}`}
                    </span>
                    <div className="flex gap-2">
                      <Link to={`/sandbox?model=${model.id}`}>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <PlayIcon className="h-4 w-4" />
                          Try it
                        </Button>
                      </Link>
                      <Link to={`/marketplace/models/${model.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;