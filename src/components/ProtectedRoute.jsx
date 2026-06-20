import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import Loading from './ui/Loading';

const ProtectedRoute = ({ children, roles = [], adminOnly = false, validatorOnly = false, developerOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const { connected, profile: walletProfile } = useWallet();
  const location = useLocation();

  // Show loading while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // Accept wallet profile as fallback while WalletAuthSync is still running
  const effectivelyAuthenticated = isAuthenticated || (connected && !!walletProfile);
  const effectiveRole = user?.role || walletProfile?.role || walletProfile?.primaryRole;

  // Redirect to wallet connection page if not authenticated
  if (!effectivelyAuthenticated) {
    return <Navigate to="/connect-wallet" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (adminOnly && effectiveRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (validatorOnly && effectiveRole !== 'validator' && effectiveRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (developerOnly && effectiveRole !== 'developer' && effectiveRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific roles if provided
  if (roles.length > 0 && !roles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;