import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import { useWallet } from '../../contexts/WalletContext';
import { PlusIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';

const MyModels = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { chainId, isConnected } = useWallet();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);

  // Models would come from ModelRegistry contract in production
  const models = [
    // Empty - will be populated from blockchain
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'draft': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleDeleteModel = (model) => {
    setSelectedModel(model);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic
    setShowDeleteModal(false);
    setSelectedModel(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Models</h1>
          <p className="text-secondary-600">Manage and monitor your AI models</p>
        </div>
        <Link to="/developer/upload">
          <Button>
            <PlusIcon className="h-4 w-4" />
            Upload New Model
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.length === 0 ? (
          <Card className="col-span-full">
            <Card.Content className="text-center py-12">
              <CubeIcon className="h-16 w-16 mx-auto mb-4 text-secondary-400" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No models yet</h3>
              <p className="text-secondary-600 mb-4">Get started by uploading your first AI model</p>
              <Link to="/developer/upload">
                <Button>
                  <PlusIcon className="h-4 w-4" />
                  Upload Your First Model
                </Button>
              </Link>
            </Card.Content>
          </Card>
        ) : models.map(model => (
          <Card key={model.id}>
            <Card.Header>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Card.Title className="text-lg">{model.name}</Card.Title>
                  <p className="text-sm text-secondary-600 mt-1">{model.description}</p>
                </div>
                <Dropdown
                  trigger={(
                    <Button variant="ghost" size="sm">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  )}
                  items={[
                    {
                      label: 'Edit',
                      icon: PencilIcon,
                      onClick: () => {}
                    },
                    {
                      label: 'Delete',
                      icon: TrashIcon,
                      onClick: () => handleDeleteModel(model),
                      className: 'text-red-600'
                    }
                  ]}
                />
              </div>
            </Card.Header>
            
            <Card.Content>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={getStatusColor(model.status)}>
                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                  </Badge>
                  <Badge variant="secondary">{model.category}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-600">Downloads</span>
                    <p className="font-medium">{model.downloads}</p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Earnings</span>
                    <p className="font-medium text-primary-600">{model.earnings}</p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Rating</span>
                    <p className="font-medium">{model.rating > 0 ? `${model.rating}/5` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-secondary-600">Updated</span>
                    <p className="font-medium">{new Date(model.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Link to={`/marketplace/models/${model.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link to={`/developer/analytics/${model.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      Analytics
                    </Button>
                  </Link>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {models.length === 0 && (
        <Card>
          <Card.Content className="text-center py-12">
            <CubeIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No models yet</h3>
            <p className="text-secondary-600 mb-4">Upload your first AI model to get started</p>
            <Link to="/developer/upload">
              <Button>
                <PlusIcon className="h-4 w-4" />
                Upload Model
              </Button>
            </Link>
          </Card.Content>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Delete Model</Modal.Title>
        </Modal.Header>
        <Modal.Content>
          <p className="text-secondary-600">
            Are you sure you want to delete "{selectedModel?.name}"? This action cannot be undone.
          </p>
        </Modal.Content>
        <Modal.Footer>
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyModels;