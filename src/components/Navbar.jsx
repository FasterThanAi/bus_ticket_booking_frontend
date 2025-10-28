import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const renderLinks = () => {
    // 1. User is Logged Out
    if (!user) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="hover:text-gray-200">Login</Link>
          <Link to="/register" className="px-3 py-1 bg-white rounded text-blue-600 font-medium hover:bg-gray-100">
            Register
          </Link>
        </div>
      );
    }

    // 2. User is an Admin
    if (isAdmin) {
      return (
        <div className="flex items-center space-x-4">
          <Link to="/admin" className="font-bold text-yellow-300 hover:text-yellow-100">
            Admin Dashboard
          </Link>
          <span className="font-medium">Hi, {user.name} (Admin)</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 font-medium bg-red-500 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      );
    }

    // 3. User is a regular Customer
    return (
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-200">Search Buses</Link>
        <Link to="/bookings" className="hover:text-gray-200">My Bookings</Link>
        <span className="font-medium">Hi, {user.name}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 font-medium bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className="p-4 bg-blue-600 text-white shadow-md">
      <div className="container flex items-center justify-between max-w-6xl mx-auto">
        {/* Brand/Logo - Links to the correct homepage */}
        <Link to={isAdmin ? "/admin" : "/"} className="text-2xl font-bold">
          BusBooking
        </Link>
        
        {/* Render the correct set of links */}
        {renderLinks()}
      </div>
    </nav>
  );
}

export default Navbar;
