import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = isAuthenticated();
  
  if (!auth) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;