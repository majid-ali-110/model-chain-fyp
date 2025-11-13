import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './ui/Loading';

const ProtectedRoute = ({ children, roles = [], adminOnly = false, validatorOnly = false, developerOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (validatorOnly && user?.role !== 'validator' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  if (developerOnly && user?.role !== 'developer' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Check specific roles if provided
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has required permissions
  return children;
};

export default ProtectedRoute;