/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { getContracts } from '../contracts';
import ModelRegistryABI from '../contracts/abis/ModelRegistry.json';
import MarketplaceABI from '../contracts/abis/Marketplace.json';
import { uploadJSON, uploadFile, fetchFromIPFS, uploadModelMetadata, getIPFSUrl } from '../services/ipfs';

// Model Context
const ModelContext = createContext();

// Category enum matching smart contract
const CATEGORIES = {
  0: 'text',
  1: 'image',
  2: 'audio',
  3: 'video',
  4: 'multimodal',
  5: 'other'
};

const CATEGORY_TO_ENUM = {
  'text': 0,
  'image': 1,
  'audio': 2,
  'video': 3,
  'multimodal': 4,
  'other': 5
};

// Status enum matching smart contract
const STATUS = {
  0: 'pending',
  1: 'validated',
  2: 'rejected',
  3: 'suspended'
};

const modelReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MODELS':
      return { ...state, models: action.payload, loading: false };
    case 'ADD_MODEL':
      return { ...state, models: [...state.models, action.payload] };
    case 'UPDATE_MODEL':
      return {
        ...state,
        models: state.models.map(model =>
          model.id === action.payload.id ? { ...model, ...action.payload } : model
        ),
      };
    case 'DELETE_MODEL':
      return {
        ...state,
        models: state.models.filter(model => model.id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_CONTRACTS':
      return { ...state, contracts: action.payload };
    default:
      return state;
  }
};

const initialModelState = {
  models: [],
  categories: Object.values(CATEGORIES),
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'newest',
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    verified: false,
    status: '',
  },
  contracts: {
    modelRegistry: null,
    marketplace: null
  }
};

export const ModelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(modelReducer, initialModelState);
  const { provider, signer, connected, chainId } = useWallet();

  // Initialize contracts when provider is available
  useEffect(() => {
    if (provider && chainId) {
      initializeContracts();
    }
  }, [provider, chainId]);

  // Load models when contracts are ready
  useEffect(() => {
    if (state.contracts.modelRegistry) {
      loadModels();
    }
  }, [state.contracts.modelRegistry]);

  const initializeContracts = useCallback(async () => {
    try {
      const addresses = getContracts(chainId);
      
      // Initialize read-only contracts with provider
      const modelRegistry = new ethers.Contract(
        addresses.modelRegistry,
        ModelRegistryABI.abi,
        provider
      );
      
      const marketplace = new ethers.Contract(
        addresses.marketplace,
        MarketplaceABI.abi,
        provider
      );

      dispatch({ 
        type: 'SET_CONTRACTS', 
        payload: { modelRegistry, marketplace } 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize contracts' });
    }
  }, [provider, chainId]);

  const loadModels = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { modelRegistry, marketplace } = state.contracts;
      
      if (!modelRegistry) {
        dispatch({ type: 'SET_MODELS', payload: [] });
        return;
      }

      // Get total number of models
      const totalModels = await modelRegistry.getTotalModels();
      const models = [];

      // Fetch each model
      for (let i = 0; i < totalModels; i++) {
        try {
          const modelData = await modelRegistry.getModel(i);
          const listing = marketplace ? await marketplace.getListing(i).catch(() => null) : null;
          
          // Fetch metadata from IPFS
          let metadata = {};
          try {
            metadata = await fetchFromIPFS(modelData.metadataHash);
          } catch {
            // Use on-chain data if IPFS fails
          }

          const model = {
            id: modelData.id.toString(),
            tokenId: modelData.id.toString(),
            owner: modelData.owner,
            name: modelData.name || metadata.name || `Model #${i}`,
            description: metadata.description || '',
            ipfsHash: modelData.ipfsHash,
            metadataHash: modelData.metadataHash,
            category: CATEGORIES[modelData.category] || 'other',
            status: STATUS[modelData.status] || 'pending',
            price: listing?.isActive ? ethers.formatEther(listing.basePrice) : '0',
            priceWei: listing?.basePrice?.toString() || '0',
            isListed: listing?.isActive || false,
            createdAt: new Date(Number(modelData.createdAt) * 1000).toISOString(),
            updatedAt: new Date(Number(modelData.updatedAt) * 1000).toISOString(),
            downloads: Number(modelData.totalDownloads),
            rating: modelData.totalRatings > 0 
              ? (Number(modelData.ratingSum) / Number(modelData.totalRatings)).toFixed(1) 
              : 0,
            totalRatings: Number(modelData.totalRatings),
            verified: modelData.status === 1, // VALIDATED status
            // Metadata fields
            framework: metadata.framework || '',
            version: metadata.version || '1.0.0',
            tags: metadata.tags || [],
            requirements: metadata.requirements || [],
            license: metadata.license || 'MIT',
            imageUrl: metadata.imageUrl ? getIPFSUrl(metadata.imageUrl) : null,
          };

          models.push(model);
        } catch (error) {
          // Skip models that fail to load
          continue;
        }
      }

      dispatch({ type: 'SET_MODELS', payload: models });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const uploadModel = async (modelData) => {
    if (!signer || !connected) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const addresses = getContracts(chainId);
      const modelRegistry = new ethers.Contract(
        addresses.modelRegistry,
        ModelRegistryABI.abi,
        signer
      );

      // 1. Upload model file to IPFS
      let modelFileHash = '';
      if (modelData.file) {
        const fileResult = await uploadFile(modelData.file);
        modelFileHash = fileResult.hash;
      }

      // 2. Upload metadata to IPFS
      const metadataResult = await uploadModelMetadata({
        name: modelData.name,
        description: modelData.description,
        category: modelData.category,
        framework: modelData.framework,
        version: modelData.version || '1.0.0',
        author: await signer.getAddress(),
        license: modelData.license || 'MIT',
        tags: modelData.tags || [],
        requirements: modelData.requirements || [],
        inputFormat: modelData.inputFormat,
        outputFormat: modelData.outputFormat,
        modelSize: modelData.file?.size || 0,
        imageUrl: modelData.imageHash || '',
      });

      // 3. Register model on blockchain
      const categoryEnum = CATEGORY_TO_ENUM[modelData.category] || 5;
      const priceWei = modelData.price ? ethers.parseEther(modelData.price.toString()) : 0n;

      const tx = await modelRegistry.registerModel(
        modelData.name,
        modelFileHash || metadataResult.hash, // Use metadata hash if no file
        metadataResult.hash,
        categoryEnum,
        priceWei
      );

      const receipt = await tx.wait();
      
      // Get the token ID from the event
      const event = receipt.logs.find(log => {
        try {
          const parsed = modelRegistry.interface.parseLog(log);
          return parsed?.name === 'ModelRegistered';
        } catch {
          return false;
        }
      });

      const tokenId = event ? modelRegistry.interface.parseLog(event).args.tokenId : null;

      // Reload models
      await loadModels();

      return { 
        success: true, 
        tokenId: tokenId?.toString(),
        transactionHash: receipt.hash,
        ipfsHash: metadataResult.hash
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateModel = async (tokenId, updates) => {
    if (!signer || !connected) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const addresses = getContracts(chainId);
      const modelRegistry = new ethers.Contract(
        addresses.modelRegistry,
        ModelRegistryABI.abi,
        signer
      );

      // Upload new metadata to IPFS
      const metadataResult = await uploadJSON(updates.metadata || updates);
      const priceWei = updates.price ? ethers.parseEther(updates.price.toString()) : 0n;

      const tx = await modelRegistry.updateModel(tokenId, metadataResult.hash, priceWei);
      await tx.wait();

      // Reload models
      await loadModels();

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const listModelForSale = async (tokenId, basePrice, commercialMultiplier = 300, enterpriseMultiplier = 1000) => {
    if (!signer || !connected) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const addresses = getContracts(chainId);
      const marketplace = new ethers.Contract(
        addresses.marketplace,
        MarketplaceABI.abi,
        signer
      );

      const priceWei = ethers.parseEther(basePrice.toString());
      const tx = await marketplace.listModel(tokenId, priceWei, commercialMultiplier, enterpriseMultiplier);
      await tx.wait();

      await loadModels();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const purchaseModel = async (tokenId, licenseType = 0) => {
    if (!signer || !connected) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const addresses = getContracts(chainId);
      const marketplace = new ethers.Contract(
        addresses.marketplace,
        MarketplaceABI.abi,
        signer
      );

      const price = await marketplace.calculatePrice(tokenId, licenseType);
      const tx = await marketplace.purchaseModel(tokenId, licenseType, { value: price });
      await tx.wait();

      await loadModels();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const rateModel = async (tokenId, rating) => {
    if (!signer || !connected) {
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      const addresses = getContracts(chainId);
      const modelRegistry = new ethers.Contract(
        addresses.modelRegistry,
        ModelRegistryABI.abi,
        signer
      );

      const tx = await modelRegistry.rateModel(tokenId, rating);
      await tx.wait();

      await loadModels();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const searchModels = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const filterModels = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const sortModels = (sortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  const getModelById = (id) => {
    return state.models.find(model => model.id === id || model.tokenId === id);
  };

  const getFilteredModels = () => {
    let filtered = [...state.models];

    // Apply search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(model =>
        model.name?.toLowerCase().includes(query) ||
        model.description?.toLowerCase().includes(query) ||
        model.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (state.filters.category) {
      filtered = filtered.filter(model => model.category === state.filters.category);
    }

    if (state.filters.verified) {
      filtered = filtered.filter(model => model.verified);
    }

    if (state.filters.status) {
      filtered = filtered.filter(model => model.status === state.filters.status);
    }

    if (state.filters.minPrice > 0) {
      filtered = filtered.filter(model => parseFloat(model.price) >= state.filters.minPrice);
    }

    if (state.filters.maxPrice < 1000) {
      filtered = filtered.filter(model => parseFloat(model.price) <= state.filters.maxPrice);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price_high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating);
        case 'downloads':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const value = {
    ...state,
    searchModels,
    filterModels,
    sortModels,
    uploadModel,
    updateModel,
    getModelById,
    getFilteredModels,
    loadModels,
    listModelForSale,
    purchaseModel,
    rateModel,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};

// Alias for backward compatibility
export const useModels = useModel;
