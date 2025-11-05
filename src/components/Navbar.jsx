import React from 'react';
// 1. Use NavLink for active link styling
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// 2. Import the new UserIcon
import { UserCircleIcon, TicketIcon, CogIcon, UserIcon } from '@heroicons/react/24/solid';

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 3. This function now styles the active link with a "ring"
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-white font-medium";
    if (isActive) {
      // Active: A subtle background and a clear red border
      return `${baseClasses} bg-white/10 ring-2 ring-red-400`;
    }
    // Inactive: Just a hover effect
    return `${baseClasses} hover:bg-white/20`;
  };

  const renderLinks = () => {
    // 4. FIXED: User is Logged Out (now two separate links)
    if (!user) {
      return (
        <>
          <NavLink to="/login" className={getNavLinkClass}>
            <UserCircleIcon className="w-5 h-5" />
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            <UserIcon className="w-5 h-5" />
            Register
          </NavLink>
        </>
      );
    }

    // 5. User is an Admin
    if (isAdmin) {
      return (
        <>
          <NavLink to="/admin" className={getNavLinkClass}>
            <CogIcon className="w-6 h-6" />
            Admin Dashboard
          </NavLink>
          <button onClick={handleLogout} className="ml-4 bg-white text-red-600 font-bold py-1 px-3 rounded-md hover:bg-gray-100">
            Logout
          </button>
        </>
      );
    }

    // 6. User is a regular Customer (now with Profile link)
    return (
      <>
        <NavLink to="/bookings" className={getNavLinkClass}>
          <TicketIcon className="w-6 h-6" />
          My Bookings
        </NavLink>
        <NavLink to="/profile" className={getNavLinkClass}>
          <UserIcon className="w-6 h-6" />
          Profile
        </NavLink>
        <div className="flex items-center gap-2 p-2">
          <UserCircleIcon className="w-6 h-6" />
          <span>Hi, {user.name}</span>
          <button onClick={handleLogout} className="ml-2 text-xs text-gray-200 hover:underline">(Logout)</button>
        </div>
      </>
    );
  };

  return (
    // 7. UPDATED: Sticky, "glassmorphism" styles
    <nav className="sticky top-0 z-50 bg-red-700/75 text-white shadow-lg backdrop-blur-md border-b border-white/20">
      <div className="container flex items-center justify-between max-w-7xl mx-auto p-4">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <Link to={isAdmin ? "/admin" : "/"} className="text-3xl font-bold text-white">
            BusBooking
          </Link>
          <div className="flex items-center gap-2">
            {/* The 'end' prop ensures this isn't active on /search, etc. */}
            <NavLink to="/" end className={getNavLinkClass}>
              Bus Tickets
            </NavLink>
          </div>
        </div>
        
        {/* Right Side */}
        <div className="flex items-center gap-2 text-sm font-semibold">
          {renderLinks()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;