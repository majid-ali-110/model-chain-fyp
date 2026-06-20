import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Dropdown from '../../components/ui/Dropdown';
import Modal from '../../components/ui/Modal';
import { useWallet } from '../../contexts/WalletContext';
import { useModel } from '../../contexts/ModelContext';
import { useNotification } from '../../contexts/NotificationContext';
import { PlusIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, CubeIcon } from '@heroicons/react/24/outline';

const MyModels = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { chainId, isConnected, address } = useWallet();
  const { models, loading, delistModel } = useModel();
  const { showSuccess, showError } = useNotification();

  // Get network currency based on chainId
  const getNetworkCurrency = (chainId) => {
    const polygonChains = ['137', '80002', '80001', '31337'];
    return polygonChains.includes(chainId) ? 'POL' : 'ETH';
  };

  const currency = getNetworkCurrency(chainId);

  const ownedModels = (models || []).filter(
    (model) => model.owner?.toLowerCase() === address?.toLowerCase()
  );

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

  const confirmDelete = async () => {
    if (!selectedModel) return;

    const result = await delistModel(selectedModel.id);
    if (result.success) {
      showSuccess('Model listing removed from marketplace.', { title: 'Model Delisted' });
    } else {
      showError(result.error || 'Failed to delist model.', { title: 'Action Failed' });
    }

    setShowDeleteModal(false);
    setSelectedModel(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark-text-primary">My Models</h1>
        <Card>
          <Card.Content className="py-10 text-center text-dark-text-tertiary">Loading models...</Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary">My Models</h1>
          <p className="text-dark-text-tertiary">Manage and monitor your AI models</p>
        </div>
        <Link to="/developer/upload">
          <Button>
            <PlusIcon className="h-4 w-4" />
            Upload New Model
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {ownedModels.length === 0 ? (
          <Card className="col-span-full">
            <Card.Content className="text-center py-12">
              <CubeIcon className="h-16 w-16 mx-auto mb-4 text-dark-text-muted" />
              <h3 className="text-lg font-medium text-dark-text-primary mb-2">No models yet</h3>
              <p className="text-dark-text-tertiary mb-4">Get started by uploading your first AI model</p>
              <Link to="/developer/upload">
                <Button>
                  <PlusIcon className="h-4 w-4" />
                  Upload Your First Model
                </Button>
              </Link>
            </Card.Content>
          </Card>
        ) : ownedModels.map(model => (
          <Card key={model.id}>
            <Card.Header>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Card.Title className="text-lg">{model.name}</Card.Title>
                  <p className="text-sm text-dark-text-tertiary mt-1">{model.description}</p>
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
                    <span className="text-dark-text-tertiary">Downloads</span>
                    <p className="font-medium">{model.downloads}</p>
                  </div>
                  <div>
                    <span className="text-dark-text-tertiary">Earnings</span>
                    <p className="font-medium text-primary-400">{model.isListed ? `${model.price} ${currency}` : `0 ${currency}`}</p>
                  </div>
                  <div>
                    <span className="text-dark-text-tertiary">Rating</span>
                    <p className="font-medium">{model.rating > 0 ? `${model.rating}/5` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-dark-text-tertiary">Updated</span>
                    <p className="font-medium">{new Date(model.updatedAt || model.createdAt).toLocaleDateString()}</p>
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
      {ownedModels.length === 0 && (
        <Card>
          <Card.Content className="text-center py-12">
            <CubeIcon className="h-12 w-12 text-dark-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-text-primary mb-2">No models yet</h3>
            <p className="text-dark-text-tertiary mb-4">Upload your first AI model to get started</p>
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
          <p className="text-dark-text-tertiary">
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