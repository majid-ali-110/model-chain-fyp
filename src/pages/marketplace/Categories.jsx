import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
  ChatBubbleLeftRightIcon,
  EyeIcon,
  SpeakerWaveIcon,
  CubeIcon,
  ChartBarIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

const Categories = () => {
  const categories = [
    {
      id: 'language',
      name: 'Language Models',
      description: 'Text generation, translation, and understanding models',
      icon: ChatBubbleLeftRightIcon,
      modelCount: 156,
      trending: true,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      description: 'Image classification, object detection, and visual AI',
      icon: EyeIcon,
      modelCount: 89,
      trending: true,
      color: 'bg-green-50 text-green-600'
    },
    {
      id: 'audio',
      name: 'Audio & Speech',
      description: 'Speech recognition, audio generation, and processing',
      icon: SpeakerWaveIcon,
      modelCount: 45,
      trending: false,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'multimodal',
      name: 'Multimodal',
      description: 'Models that work with multiple data types',
      icon: CubeIcon,
      modelCount: 23,
      trending: true,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 'analytics',
      name: 'Analytics & Prediction',
      description: 'Data analysis, forecasting, and predictive models',
      icon: ChartBarIcon,
      modelCount: 67,
      trending: false,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'research',
      name: 'Research & Experimental',
      description: 'Cutting-edge and experimental AI models',
      icon: BeakerIcon,
      modelCount: 34,
      trending: false,
      color: 'bg-red-50 text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Model Categories</h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Explore AI models organized by category. Find the perfect model for your specific use case.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => {
          const IconComponent = category.icon;
          
          return (
            <Link key={category.id} to={`/marketplace/browse?category=${category.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <Card.Header>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <Card.Title className="text-lg">{category.name}</Card.Title>
                        {category.trending && (
                          <Badge variant="success" size="sm">Trending</Badge>
                        )}
                      </div>
                      <p className="text-sm text-secondary-600 mt-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card.Header>
                
                <Card.Content>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-600">
                      {category.modelCount} models available
                    </span>
                    <span className="text-primary-600 font-medium hover:text-primary-700">
                      Explore →
                    </span>
                  </div>
                </Card.Content>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <Card>
          <Card.Header>
            <Card.Title>Marketplace Statistics</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">414</div>
                <div className="text-sm text-secondary-600">Total Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">1.2k</div>
                <div className="text-sm text-secondary-600">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">89%</div>
                <div className="text-sm text-secondary-600">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50k+</div>
                <div className="text-sm text-secondary-600">Downloads</div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Categories;