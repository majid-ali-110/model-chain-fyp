/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Model Context
const ModelContext = createContext();

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
    default:
      return state;
  }
};

const initialModelState = {
  models: [],
  categories: [],
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'newest',
  filters: {
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    verified: false,
    language: '',
    framework: '',
  },
};

export const ModelProvider = ({ children }) => {
  const [state, dispatch] = useReducer(modelReducer, initialModelState);

  // Mock data - replace with actual API calls
  useEffect(() => {
    loadModels();
    loadCategories();
  }, []);

  const loadModels = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock API call
      const mockModels = [
        {
          id: '1',
          name: 'GPT-4 Clone',
          description: 'A powerful language model trained for conversational AI',
          category: 'Language Models',
          price: 0.05,
          priceType: 'per_query',
          owner: '0x123...abc',
          verified: true,
          downloads: 1250,
          rating: 4.8,
          tags: ['language', 'conversation', 'gpt'],
          framework: 'PyTorch',
          language: 'Python',
          createdAt: '2024-01-15',
          image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop',
        },
        {
          id: '2',
          name: 'Image Classifier Pro',
          description: 'Advanced image classification model with 99% accuracy',
          category: 'Computer Vision',
          price: 25,
          priceType: 'one_time',
          owner: '0x456...def',
          verified: true,
          downloads: 890,
          rating: 4.6,
          tags: ['vision', 'classification', 'cnn'],
          framework: 'TensorFlow',
          language: 'Python',
          createdAt: '2024-01-10',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
        },
      ];
      
      dispatch({ type: 'SET_MODELS', payload: mockModels });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadCategories = async () => {
    try {
      const mockCategories = [
        'Language Models',
        'Computer Vision',
        'Audio Processing',
        'Recommendation Systems',
        'Time Series',
        'Reinforcement Learning',
      ];
      
      dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const searchModels = async (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    // Implement search logic here
  };

  const filterModels = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
    // Implement filtering logic here
  };

  const sortModels = (sortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
    // Implement sorting logic here
  };

  const uploadModel = async (modelData) => {
    try {
      // Mock upload - replace with actual API call
      const newModel = {
        id: Date.now().toString(),
        ...modelData,
        owner: '0x123...abc', // From auth context
        verified: false,
        downloads: 0,
        rating: 0,
        createdAt: new Date().toISOString(),
      };
      
      dispatch({ type: 'ADD_MODEL', payload: newModel });
      return { success: true, model: newModel };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateModel = async (modelId, updates) => {
    try {
      dispatch({ type: 'UPDATE_MODEL', payload: { id: modelId, ...updates } });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteModel = async (modelId) => {
    try {
      dispatch({ type: 'DELETE_MODEL', payload: modelId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getModelById = (id) => {
    return state.models.find(model => model.id === id);
  };

  const getFilteredModels = () => {
    let filtered = [...state.models];

    // Apply search query
    if (state.searchQuery) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        model.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (state.filters.category) {
      filtered = filtered.filter(model => model.category === state.filters.category);
    }

    if (state.filters.verified) {
      filtered = filtered.filter(model => model.verified);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
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
    deleteModel,
    getModelById,
    getFilteredModels,
    loadModels,
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