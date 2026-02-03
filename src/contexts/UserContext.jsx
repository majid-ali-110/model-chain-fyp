import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, MODEL_REGISTRY_ABI, MARKETPLACE_ABI } from '../contracts';
import { getFromIPFS, parseMetadata } from '../services/ipfs';

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

// Helper to get contract instances
const getContracts = async () => {
  if (!window.ethereum) {
    throw new Error('No wallet detected');
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  
  // Map chainId to network name
  const networkMap = {
    1: 'mainnet',
    5: 'goerli',
    11155111: 'sepolia',
    31337: 'localhost',
  };
  
  const networkName = networkMap[chainId] || 'localhost';
  const addresses = CONTRACT_ADDRESSES[networkName];
  
  if (!addresses) {
    throw new Error(`Unsupported network: ${networkName}`);
  }
  
  const signer = await provider.getSigner();
  
  return {
    modelRegistry: new ethers.Contract(addresses.ModelRegistry, MODEL_REGISTRY_ABI, signer),
    marketplace: new ethers.Contract(addresses.Marketplace, MARKETPLACE_ABI, signer),
    provider,
    signer,
  };
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  const loadUserProfile = useCallback(async (walletAddress, profile) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (!profile) {
        dispatch({ type: 'SET_PROFILE', payload: null });
        return;
      }

      // Get user's model count from blockchain
      let modelsPublished = 0;
      try {
        const { modelRegistry } = await getContracts();
        const totalModels = await modelRegistry.getModelCount();
        
        // Count models owned by this user
        for (let i = 0; i < totalModels; i++) {
          const owner = await modelRegistry.ownerOf(i);
          if (owner.toLowerCase() === walletAddress.toLowerCase()) {
            modelsPublished++;
          }
        }
      } catch (err) {
        // Contract may not be deployed yet
      }

      const userProfile = {
        id: walletAddress,
        name: profile.displayName,
        email: profile.email || '',
        bio: profile.bio || '',
        avatar: profile.avatar,
        walletAddress: walletAddress,
        role: profile.role,
        verified: false,
        joinedAt: profile.createdAt,
        username: profile.username,
        stats: {
          modelsPublished,
          totalDownloads: 0,
          totalEarnings: 0,
          validationsCompleted: 0,
        },
        social: profile.social || {},
      };
      
      dispatch({ type: 'SET_PROFILE', payload: userProfile });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateProfile = async (updates) => {
    try {
      dispatch({ type: 'UPDATE_PROFILE', payload: updates });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loadPurchases = useCallback(async (walletAddress) => {
    try {
      const { marketplace, provider } = await getContracts();
      
      // Get AccessPurchased events for this user
      const filter = marketplace.filters.AccessPurchased(null, walletAddress);
      const events = await marketplace.queryFilter(filter);
      
      const purchases = await Promise.all(
        events.map(async (event) => {
          const { modelId, buyer, price, seller } = event.args;
          const block = await provider.getBlock(event.blockNumber);
          
          return {
            id: `${event.transactionHash}-${event.index}`,
            modelId: modelId.toString(),
            price: ethers.formatEther(price),
            currency: 'ETH',
            purchaseDate: new Date(block.timestamp * 1000).toISOString(),
            status: 'completed',
            txHash: event.transactionHash,
            seller: seller,
          };
        })
      );
      
      dispatch({ type: 'SET_PURCHASES', payload: purchases });
    } catch (error) {
      // Contract may not be deployed or no purchases yet
      dispatch({ type: 'SET_PURCHASES', payload: [] });
    }
  }, []);

  const loadUserModels = useCallback(async (walletAddress) => {
    try {
      const { modelRegistry } = await getContracts();
      const totalModels = await modelRegistry.getModelCount();
      
      const userModels = [];
      
      for (let i = 0; i < totalModels; i++) {
        const owner = await modelRegistry.ownerOf(i);
        
        if (owner.toLowerCase() === walletAddress.toLowerCase()) {
          const model = await modelRegistry.getModel(i);
          const metadataURI = model.metadataURI;
          
          // Fetch metadata from IPFS
          let metadata = {};
          try {
            const data = await getFromIPFS(metadataURI);
            metadata = parseMetadata(data);
          } catch (err) {
            // Fallback if IPFS fetch fails
          }
          
          userModels.push({
            id: i.toString(),
            tokenId: i.toString(),
            name: metadata.name || `Model #${i}`,
            description: metadata.description || '',
            category: metadata.category || 'Other',
            price: ethers.formatEther(model.price),
            owner: owner,
            metadataURI,
            createdAt: new Date(Number(model.timestamp) * 1000).toISOString(),
            downloads: 0,
            rating: metadata.rating || 0,
            image: metadata.image,
          });
        }
      }
      
      dispatch({ type: 'SET_MODELS', payload: userModels });
    } catch (error) {
      dispatch({ type: 'SET_MODELS', payload: [] });
    }
  }, []);

  const loadEarnings = useCallback(async (walletAddress) => {
    try {
      const { marketplace, provider } = await getContracts();
      
      // Get TransactionCompleted events where user is seller
      const filter = marketplace.filters.TransactionCompleted(null, walletAddress);
      const events = await marketplace.queryFilter(filter);
      
      let total = BigInt(0);
      let thisMonth = BigInt(0);
      let lastMonth = BigInt(0);
      
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const breakdown = [];
      
      for (const event of events) {
        const { modelId, amount } = event.args;
        const block = await provider.getBlock(event.blockNumber);
        const txDate = new Date(block.timestamp * 1000);
        
        total += amount;
        
        if (txDate >= thisMonthStart) {
          thisMonth += amount;
        } else if (txDate >= lastMonthStart && txDate <= lastMonthEnd) {
          lastMonth += amount;
        }
        
        breakdown.push({
          modelId: modelId.toString(),
          amount: ethers.formatEther(amount),
          date: txDate.toISOString(),
          txHash: event.transactionHash,
        });
      }
      
      const earnings = {
        total: parseFloat(ethers.formatEther(total)),
        thisMonth: parseFloat(ethers.formatEther(thisMonth)),
        lastMonth: parseFloat(ethers.formatEther(lastMonth)),
        currency: 'ETH',
        breakdown,
      };
      
      dispatch({ type: 'SET_EARNINGS', payload: earnings });
    } catch (error) {
      dispatch({ type: 'SET_EARNINGS', payload: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        currency: 'ETH',
        breakdown: [],
      }});
    }
  }, []);

  const loadRewards = useCallback(async (walletAddress) => {
    try {
      // Rewards calculated based on activity
      // For now, use placeholder - could integrate a rewards contract later
      const { purchases, earnings } = state;
      
      const purchasePoints = purchases.length * 100;
      const earningsPoints = Math.floor(earnings.total * 1000);
      const totalPoints = purchasePoints + earningsPoints;
      
      // Tier calculation
      let tier = 'Bronze';
      let nextTier = 'Silver';
      let nextTierThreshold = 1000;
      
      if (totalPoints >= 10000) {
        tier = 'Platinum';
        nextTier = 'Platinum';
        nextTierThreshold = totalPoints;
      } else if (totalPoints >= 5000) {
        tier = 'Gold';
        nextTier = 'Platinum';
        nextTierThreshold = 10000;
      } else if (totalPoints >= 1000) {
        tier = 'Silver';
        nextTier = 'Gold';
        nextTierThreshold = 5000;
      }
      
      const rewards = {
        balance: totalPoints,
        earned: totalPoints,
        redeemed: 0,
        tier,
        nextTier,
        nextTierThreshold,
      };
      
      dispatch({ type: 'SET_REWARDS', payload: rewards });
    } catch (error) {
      dispatch({ type: 'SET_REWARDS', payload: {
        balance: 0,
        earned: 0,
        redeemed: 0,
        tier: 'Bronze',
        nextTier: 'Silver',
        nextTierThreshold: 1000,
      }});
    }
  }, [state.purchases.length, state.earnings.total]);

  const loadActivity = useCallback(async (walletAddress) => {
    try {
      const { modelRegistry, marketplace, provider } = await getContracts();
      const activities = [];
      
      // Get model minted events
      const mintFilter = modelRegistry.filters.ModelMinted(null, walletAddress);
      const mintEvents = await modelRegistry.queryFilter(mintFilter);
      
      for (const event of mintEvents) {
        const block = await provider.getBlock(event.blockNumber);
        const { tokenId } = event.args;
        
        activities.push({
          id: `mint-${event.transactionHash}`,
          type: 'model_upload',
          title: 'Model Published',
          description: `You published model #${tokenId}`,
          icon: 'upload',
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          txHash: event.transactionHash,
        });
      }
      
      // Get purchase events (as buyer)
      const buyFilter = marketplace.filters.AccessPurchased(null, walletAddress);
      const buyEvents = await marketplace.queryFilter(buyFilter);
      
      for (const event of buyEvents) {
        const block = await provider.getBlock(event.blockNumber);
        const { modelId, price } = event.args;
        
        activities.push({
          id: `buy-${event.transactionHash}`,
          type: 'purchase',
          title: 'Model Purchased',
          description: `You purchased model #${modelId} for ${ethers.formatEther(price)} ETH`,
          icon: 'shopping',
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          txHash: event.transactionHash,
        });
      }
      
      // Get sale events (as seller)
      const sellFilter = marketplace.filters.TransactionCompleted(null, walletAddress);
      const sellEvents = await marketplace.queryFilter(sellFilter);
      
      for (const event of sellEvents) {
        const block = await provider.getBlock(event.blockNumber);
        const { modelId, amount } = event.args;
        
        activities.push({
          id: `sell-${event.transactionHash}`,
          type: 'sale',
          title: 'Model Sold',
          description: `You earned ${ethers.formatEther(amount)} ETH from model #${modelId}`,
          icon: 'money',
          timestamp: new Date(block.timestamp * 1000).toISOString(),
          txHash: event.transactionHash,
        });
      }
      
      // Sort by timestamp descending
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      dispatch({ type: 'SET_ACTIVITY', payload: activities });
    } catch (error) {
      dispatch({ type: 'SET_ACTIVITY', payload: [] });
    }
  }, []);

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
      const { marketplace } = await getContracts();
      
      // Call marketplace contract
      const tx = await marketplace.buyAccess(modelId, {
        value: ethers.parseEther(price.toString()),
      });
      
      await tx.wait();
      
      const purchase = {
        id: tx.hash,
        modelId,
        price,
        currency: 'ETH',
        purchaseDate: new Date().toISOString(),
        status: 'completed',
        txHash: tx.hash,
      };
      
      dispatch({ type: 'ADD_PURCHASE', payload: purchase });
      addActivity({
        type: 'purchase',
        title: 'Model Purchased',
        description: `You purchased model #${modelId} for ${price} ETH`,
        icon: 'shopping',
        txHash: tx.hash,
      });
      
      return { success: true, txHash: tx.hash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Load all user data
  const loadAllUserData = useCallback(async (walletAddress) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      await Promise.all([
        loadPurchases(walletAddress),
        loadUserModels(walletAddress),
        loadEarnings(walletAddress),
        loadActivity(walletAddress),
      ]);
      
      // Load rewards after purchases and earnings are loaded
      await loadRewards(walletAddress);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [loadPurchases, loadUserModels, loadEarnings, loadActivity, loadRewards]);

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
    loadAllUserData,
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