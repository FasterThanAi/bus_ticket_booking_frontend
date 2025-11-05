import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/utils/ProtectedRoute';
import AdminRoute from './components/utils/AdminRoute';
import SearchPage from './pages/SearchPage';
import PassengerDetailsPage from './pages/PassengerDetailsPage';
import TicketPage from './pages/TicketPage';
import ProfilePage from './pages/ProfilePage'; // <-- 1. IMPORT NEW PAGE

function App() {
  return (
    // We remove min-h-screen from here and let pages handle their own layout
    <div className="bg-gray-100"> 
      
      {/* --- 2. NAVBAR IS NOW STICKY --- */}
      <div className="print:hidden">
        <Navbar /> 
      </div>
      
      {/* Main content area will scroll underneath the navbar */}
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          
          {/* Protected Routes (Customers) */}
          <Route 
            path="/bookings" 
            element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} 
          />
          <Route 
            path="/book/passengers" 
            element={<ProtectedRoute><PassengerDetailsPage /></ProtectedRoute>}
          />
          <Route
            path="/ticket/:bookingId"
            element={<ProtectedRoute><TicketPage /></ProtectedRoute>}
          />
          {/* --- 3. ADD NEW PROFILE ROUTE --- */}
          <Route
            path="/profile"
            element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
          />

          {/* Protected Routes (Admin) */}
          <Route 
            path="/admin" 
            element={<AdminRoute><AdminDashboard /></AdminRoute>} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;