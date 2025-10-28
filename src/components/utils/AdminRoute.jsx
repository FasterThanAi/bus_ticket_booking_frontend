import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // If logged in but NOT an admin, redirect to homepage
    return <Navigate to="/" replace />;
  }

  // If logged in AND an admin, show the page
  return children ? children : <Outlet />;
}

export default AdminRoute;