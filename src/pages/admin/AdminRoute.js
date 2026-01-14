import React from 'react';
import { Navigate } from 'react-router-dom';

const isAdminLoggedIn = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

const AdminRoute = ({ children }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
