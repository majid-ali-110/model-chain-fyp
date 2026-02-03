import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { getContracts, USER_REGISTRY_ABI } from '../contracts';
import { uploadProfile, fetchFromIPFS } from '../services/ipfs';

// Wallet Context
const WalletContext = createContext();

// User roles mapping
export const USER_ROLES = {
  BUYER: 0,
  DEVELOPER: 1,
  VALIDATOR: 2
};

export const ROLE_NAMES = {
  0: 'buyer',
  1: 'developer',
  2: 'validator'
};

const walletReducer = (state, action) => {
  switch (action.type) {
    case 'WALLET_CONNECTING':
      return { ...state, connecting: true, error: null };
    case 'WALLET_CONNECTED':
      return {
        ...state,
        connecting: false,
        connected: true,
        address: action.payload.address,
        provider: action.payload.provider,
        signer: action.payload.signer,
        balance: action.payload.balance,
        chainId: action.payload.chainId,
        error: null,
      };
    case 'PROFILE_LOADED':
      return {
        ...state,
        profile: action.payload.profile,
        isRegistered: action.payload.isRegistered,
        needsOnboarding: !action.payload.isRegistered,
      };
    case 'PROFILE_CREATED':
      return {
        ...state,
        profile: action.payload.profile,
        isRegistered: true,
        needsOnboarding: false,
      };
    case 'WALLET_DISCONNECTED':
      return {
        ...state,
        connected: false,
        address: null,
        provider: null,
        signer: null,
        balance: '0',
        chainId: null,
        profile: null,
        isRegistered: false,
        needsOnboarding: false,
        connecting: false,
        error: null,
      };
    case 'WALLET_ERROR':
      return {
        ...state,
        connecting: false,
        error: action.payload,
      };
    case 'BALANCE_UPDATED':
      return {
        ...state,
        balance: action.payload,
      };
    case 'CHAIN_CHANGED':
      return {
        ...state,
        chainId: action.payload,
      };
    case 'SET_NEEDS_ONBOARDING':
      return {
        ...state,
        needsOnboarding: action.payload,
      };
    default:
      return state;
  }
};

const initialWalletState = {
  connected: false,
  connecting: false,
  address: null,
  provider: null,
  signer: null,
  balance: '0',
  chainId: null,
  profile: null,
  isRegistered: false,
  needsOnboarding: false,
  error: null,
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialWalletState);

  // Get UserRegistry contract instance
  const getUserRegistryContract = useCallback((signerOrProvider) => {
    if (!state.chainId) return null;
    
    const contracts = getContracts(parseInt(state.chainId));
    if (!contracts.UserRegistry) {
      console.warn('UserRegistry contract not deployed on this network');
      return null;
    }
    
    return new ethers.Contract(
      contracts.UserRegistry,
      USER_REGISTRY_ABI,
      signerOrProvider
    );
  }, [state.chainId]);

  // Check if user is registered on blockchain
  const checkUserRegistration = useCallback(async (address, provider) => {
    try {
      const chainId = (await provider.getNetwork()).chainId.toString();
      const contracts = getContracts(parseInt(chainId));
      
      // First check localStorage for development
      const localProfile = localStorage.getItem(`user_profile_${address}`);
      if (localProfile) {
        const profile = JSON.parse(localProfile);
        dispatch({
          type: 'PROFILE_LOADED',
          payload: { profile, isRegistered: true }
        });
        return { isRegistered: true, profile };
      }
      
      if (!contracts.UserRegistry) {
        // Contract not deployed, simulate new user
        dispatch({
          type: 'PROFILE_LOADED',
          payload: { profile: null, isRegistered: false }
        });
        return { isRegistered: false, profile: null };
      }

      const contract = new ethers.Contract(
        contracts.UserRegistry,
        USER_REGISTRY_ABI,
        provider
      );

      const isRegistered = await contract.isUserRegistered(address);
      
      if (isRegistered) {
        // Fetch user profile from blockchain
        const profileData = await contract.getUserProfile(address);
        const [ipfsHash, primaryRole, isDeveloper, isValidator, registeredAt, reputation, totalTransactions, isActive] = profileData;
        
        // Fetch full profile from IPFS
        let fullProfile = null;
        if (ipfsHash) {
          try {
            fullProfile = await fetchFromIPFS(ipfsHash);
          } catch (e) {
            console.warn('Could not fetch profile from IPFS:', e);
          }
        }

        const profile = {
          ...fullProfile,
          ipfsHash,
          primaryRole: ROLE_NAMES[primaryRole] || 'buyer',
          isDeveloper,
          isValidator,
          registeredAt: Number(registeredAt) * 1000,
          reputation: Number(reputation),
          totalTransactions: Number(totalTransactions),
          isActive,
          walletAddress: address
        };

        dispatch({
          type: 'PROFILE_LOADED',
          payload: { profile, isRegistered: true }
        });
        
        return { isRegistered: true, profile };
      } else {
        dispatch({
          type: 'PROFILE_LOADED',
          payload: { profile: null, isRegistered: false }
        });
        return { isRegistered: false, profile: null };
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
      dispatch({
        type: 'PROFILE_LOADED',
        payload: { profile: null, isRegistered: false }
      });
      return { isRegistered: false, profile: null };
    }
  }, []);

  // Register new user
  const registerUser = useCallback(async (profileData) => {
    if (!state.signer || !state.address) {
      throw new Error('Wallet not connected');
    }

    try {
      // 1. Upload profile to IPFS
      const ipfsResult = await uploadProfile({
        ...profileData,
        walletAddress: state.address
      });

      // 2. Get role number
      const roleMap = {
        'buyer': USER_ROLES.BUYER,
        'developer': USER_ROLES.DEVELOPER,
        'validator': USER_ROLES.VALIDATOR
      };
      const roleNumber = roleMap[profileData.role] || USER_ROLES.BUYER;

      // 3. Build profile object
      const profile = {
        ...profileData,
        ipfsHash: ipfsResult.hash,
        primaryRole: profileData.role,
        isDeveloper: profileData.role === 'developer',
        isValidator: profileData.role === 'validator',
        registeredAt: Date.now(),
        reputation: 500,
        totalTransactions: 0,
        isActive: true,
        walletAddress: state.address
      };

      // 4. Try to register on blockchain
      const contract = getUserRegistryContract(state.signer);
      
      if (contract) {
        try {
          const tx = await contract.registerUser(ipfsResult.hash, roleNumber);
          await tx.wait();
          profile.txHash = tx.hash;
        } catch (e) {
          console.warn('Blockchain registration failed, storing locally:', e);
        }
      }

      // Store in localStorage as backup
      localStorage.setItem(`user_profile_${state.address}`, JSON.stringify(profile));
      
      dispatch({
        type: 'PROFILE_CREATED',
        payload: { profile }
      });

      return { success: true, profile, ipfsHash: ipfsResult.hash };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }, [state.signer, state.address, getUserRegistryContract]);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!state.signer || !state.address) {
      throw new Error('Wallet not connected');
    }

    try {
      const ipfsResult = await uploadProfile({
        ...state.profile,
        ...profileData,
        walletAddress: state.address,
        updatedAt: new Date().toISOString()
      });

      const contract = getUserRegistryContract(state.signer);
      
      if (contract) {
        try {
          const tx = await contract.updateProfile(ipfsResult.hash);
          await tx.wait();
        } catch (e) {
          console.warn('Profile update on blockchain failed:', e);
        }
      }

      const updatedProfile = {
        ...state.profile,
        ...profileData,
        ipfsHash: ipfsResult.hash
      };

      localStorage.setItem(`user_profile_${state.address}`, JSON.stringify(updatedProfile));

      dispatch({
        type: 'PROFILE_CREATED',
        payload: { profile: updatedProfile }
      });

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [state.signer, state.address, state.profile, getUserRegistryContract]);

  // Upgrade to developer
  const upgradeToDeveloper = useCallback(async () => {
    if (!state.signer || !state.profile) {
      throw new Error('Wallet not connected or profile not loaded');
    }

    try {
      const updatedProfileData = {
        ...state.profile,
        role: 'developer',
        isDeveloper: true,
        primaryRole: 'developer'
      };

      const ipfsResult = await uploadProfile(updatedProfileData);
      
      const contract = getUserRegistryContract(state.signer);
      if (contract) {
        try {
          const tx = await contract.upgradeToDeveloper(ipfsResult.hash);
          await tx.wait();
        } catch (e) {
          console.warn('Developer upgrade on blockchain failed:', e);
        }
      }

      const updatedProfile = {
        ...updatedProfileData,
        ipfsHash: ipfsResult.hash
      };

      localStorage.setItem(`user_profile_${state.address}`, JSON.stringify(updatedProfile));

      dispatch({
        type: 'PROFILE_CREATED',
        payload: { profile: updatedProfile }
      });

      return { success: true, profile: updatedProfile };
    } catch (error) {
      console.error('Error upgrading to developer:', error);
      throw error;
    }
  }, [state.signer, state.address, state.profile, getUserRegistryContract]);

  // Stake as validator
  const stakeAsValidator = useCallback(async (amount) => {
    if (!state.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = getUserRegistryContract(state.signer);
      if (!contract) {
        throw new Error('Contract not available');
      }

      const tx = await contract.stakeAsValidator({
        value: ethers.parseEther(amount.toString())
      });
      await tx.wait();

      // Update local profile
      const updatedProfile = {
        ...state.profile,
        isValidator: true,
        stakedAmount: (parseFloat(state.profile?.stakedAmount || 0) + parseFloat(amount)).toString()
      };
      
      localStorage.setItem(`user_profile_${state.address}`, JSON.stringify(updatedProfile));
      
      dispatch({
        type: 'PROFILE_CREATED',
        payload: { profile: updatedProfile }
      });

      return { success: true, txHash: tx.hash };
    } catch (error) {
      console.error('Error staking as validator:', error);
      throw error;
    }
  }, [state.signer, state.address, state.profile, getUserRegistryContract]);

  const setNeedsOnboarding = (value) => {
    dispatch({ type: 'SET_NEEDS_ONBOARDING', payload: value });
  };

  // Check for existing connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      checkConnection();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();
          
          dispatch({
            type: 'WALLET_CONNECTED',
            payload: {
              address,
              provider,
              signer,
              balance: ethers.formatEther(balance),
              chainId: network.chainId.toString(),
            },
          });

          // Check user registration after connection
          await checkUserRegistration(address, provider);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      dispatch({
        type: 'WALLET_ERROR',
        payload: 'MetaMask not installed. Please install MetaMask to continue.',
      });
      return { success: false, error: 'MetaMask not installed' };
    }

    dispatch({ type: 'WALLET_CONNECTING' });

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      dispatch({
        type: 'WALLET_CONNECTED',
        payload: {
          address,
          provider,
          signer,
          balance: ethers.formatEther(balance),
          chainId: network.chainId.toString(),
        },
      });

      // Check if user is registered
      const { isRegistered, profile } = await checkUserRegistration(address, provider);

      return { success: true, profile, isRegistered, needsOnboarding: !isRegistered };
    } catch (error) {
      dispatch({
        type: 'WALLET_ERROR',
        payload: error.message || 'Failed to connect wallet',
      });
      return { success: false, error: error.message };
    }
  };

  const disconnectWallet = () => {
    dispatch({ type: 'WALLET_DISCONNECTED' });
  };

  const updateBalance = async () => {
    if (state.provider && state.address) {
      try {
        const balance = await state.provider.getBalance(state.address);
        dispatch({
          type: 'BALANCE_UPDATED',
          payload: ethers.formatEther(balance),
        });
      } catch (error) {
        console.error('Error updating balance:', error);
      }
    }
  };

  const switchNetwork = async (chainId) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${parseInt(chainId).toString(16)}` }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      dispatch({ type: 'WALLET_DISCONNECTED' });
    } else {
      // Reconnect with new account
      checkConnection();
    }
  };

  const handleChainChanged = (chainId) => {
    dispatch({
      type: 'CHAIN_CHANGED',
      payload: parseInt(chainId, 16).toString(),
    });
  };

  const handleDisconnect = () => {
    dispatch({ type: 'WALLET_DISCONNECTED' });
  };

  const value = {
    ...state,
    connectWallet,
    disconnectWallet,
    updateBalance,
    switchNetwork,
    registerUser,
    updateProfile,
    upgradeToDeveloper,
    stakeAsValidator,
    setNeedsOnboarding,
    checkUserRegistration,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;