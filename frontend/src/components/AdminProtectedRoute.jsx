import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Protected Route for Admin
 * Redirects to admin login if not authenticated as admin
 */
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth);

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
