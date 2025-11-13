import React, { createContext, useContext, useReducer } from 'react';

// User Context
const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'UPDATE_PROFILE':
      return { 
        ...state, 
        profile: { ...state.profile, ...action.payload } 
      };
    case 'SET_PURCHASES':
      return { ...state, purchases: action.payload };
    case 'ADD_PURCHASE':
      return { 
        ...state, 
        purchases: [...state.purchases, action.payload] 
      };
    case 'SET_MODELS':
      return { ...state, userModels: action.payload };
    case 'ADD_USER_MODEL':
      return { 
        ...state, 
        userModels: [...state.userModels, action.payload] 
      };
    case 'UPDATE_USER_MODEL':
      return {
        ...state,
        userModels: state.userModels.map(model =>
          model.id === action.payload.id ? { ...model, ...action.payload } : model
        ),
      };
    case 'SET_EARNINGS':
      return { ...state, earnings: action.payload };
    case 'SET_REWARDS':
      return { ...state, rewards: action.payload };
    case 'SET_ACTIVITY':
      return { ...state, activity: action.payload };
    case 'ADD_ACTIVITY':
      return { 
        ...state, 
        activity: [action.payload, ...state.activity] 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialUserState = {
  profile: null,
  purchases: [],
  userModels: [],
  earnings: {
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    currency: 'ETH',
  },
  rewards: {
    balance: 0,
    earned: 0,
    redeemed: 0,
    tier: 'Bronze',
  },
  activity: [],
  loading: false,
  error: null,
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const loadUserProfile = async (userId) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock API call
      const mockProfile = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'AI/ML Engineer passionate about decentralized AI',
        avatar: null,
        walletAddress: '0x123...abc',
        role: 'developer',
        verified: true,
        joinedAt: '2024-01-01',
        stats: {
          modelsPublished: 5,
          totalDownloads: 2140,
          totalEarnings: 1.5,
          validationsCompleted: 25,
        },
        social: {
          github: 'johndoe',
          twitter: '@johndoe',
          linkedin: 'johndoe',
        },
      };
      
      dispatch({ type: 'SET_PROFILE', payload: mockProfile });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateProfile = async (updates) => {
    try {
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loadPurchases = async () => {
    try {
      const mockPurchases = [
        {
          id: '1',
          modelId: '1',
          modelName: 'GPT-4 Clone',
          price: 0.05,
          currency: 'ETH',
          purchaseDate: '2024-01-20',
          status: 'completed',
          usageCount: 150,
        },
      ];
      
      dispatch({ type: 'SET_PURCHASES', payload: mockPurchases });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadUserModels = async () => {
    try {
      const mockUserModels = [
        {
          id: '1',
          name: 'My Awesome Model',
          status: 'published',
          downloads: 120,
          earnings: 0.6,
          rating: 4.5,
          createdAt: '2024-01-15',
        },
      ];
      
      dispatch({ type: 'SET_MODELS', payload: mockUserModels });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadEarnings = async () => {
    try {
      const mockEarnings = {
        total: 1.5,
        thisMonth: 0.3,
        lastMonth: 0.5,
        currency: 'ETH',
        breakdown: [
          { modelId: '1', modelName: 'My Awesome Model', earnings: 0.6 },
          { modelId: '2', modelName: 'Another Model', earnings: 0.9 },
        ],
      };
      
      dispatch({ type: 'SET_EARNINGS', payload: mockEarnings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadRewards = async () => {
    try {
      const mockRewards = {
        balance: 1250,
        earned: 2500,
        redeemed: 1250,
        tier: 'Silver',
        nextTier: 'Gold',
        nextTierThreshold: 5000,
      };
      
      dispatch({ type: 'SET_REWARDS', payload: mockRewards });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const loadActivity = async () => {
    try {
      const mockActivity = [
        {
          id: '1',
          type: 'model_published',
          title: 'Model Published',
          description: 'Your model "GPT-4 Clone" has been published',
          timestamp: '2024-01-20T10:30:00Z',
          icon: 'upload',
        },
        {
          id: '2',
          type: 'purchase',
          title: 'New Purchase',
          description: 'Someone purchased your model for 0.05 ETH',
          timestamp: '2024-01-19T14:15:00Z',
          icon: 'dollar',
        },
      ];
      
      dispatch({ type: 'SET_ACTIVITY', payload: mockActivity });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity,
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: newActivity });
  };

  const purchaseModel = async (modelId, price) => {
    try {
      const purchase = {
        id: Date.now().toString(),
        modelId,
        price,
        currency: 'ETH',
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        usageCount: 0,
      };
      
      dispatch({ type: 'ADD_PURCHASE', payload: purchase });
      addActivity({
        type: 'purchase',
        title: 'Model Purchased',
        description: `You purchased a model for ${price} ETH`,
        icon: 'shopping',
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    loadUserProfile,
    updateProfile,
    loadPurchases,
    loadUserModels,
    loadEarnings,
    loadRewards,
    loadActivity,
    addActivity,
    purchaseModel,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;