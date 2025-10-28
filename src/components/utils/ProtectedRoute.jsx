import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // If user is not logged in, redirect them to the /login page
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, show the page they were trying to access
  return children ? children : <Outlet />;
}

export default ProtectedRoute;