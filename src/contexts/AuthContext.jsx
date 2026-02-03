/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Auth Context
const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload,
        error: null 
      };
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false, 
        user: null,
        error: action.payload 
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialAuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = async (walletAddress, profile) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Use wallet address and profile from WalletContext
      if (!walletAddress || !profile) {
        throw new Error('Wallet not connected or profile not found');
      }

      const user = {
        id: walletAddress,
        name: profile.displayName,
        email: profile.email || '',
        role: profile.role,
        avatar: profile.avatar,
        walletAddress: walletAddress,
        bio: profile.bio,
        username: profile.username,
      };

      const token = `wallet-${walletAddress}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      return { success: false, error: error.message };
    }
  };

  const register = async (walletAddress, profile) => {
    // Same as login for wallet-based auth
    return login(walletAddress, profile);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};