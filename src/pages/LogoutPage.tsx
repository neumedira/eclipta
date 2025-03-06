import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { logout } from '../utils/authService';

const LogoutPage: React.FC = () => {
  useEffect(() => {
    logout();
  }, []);
  
  return <Navigate to="/" replace />;
};

export default LogoutPage;