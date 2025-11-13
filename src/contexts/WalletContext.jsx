import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ethers } from 'ethers';

// Wallet Context
const WalletContext = createContext();

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
    case 'WALLET_DISCONNECTED':
      return {
        ...state,
        connected: false,
        address: null,
        provider: null,
        signer: null,
        balance: '0',
        chainId: null,
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
  error: null,
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialWalletState);

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
      return;
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

      return { success: true };
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