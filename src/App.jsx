import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import ProtectedRoute from './components/utils/ProtectedRoute';

// --- Imports for Admin ---
import AdminDashboard from './pages/AdminDashboard'; // <-- IMPORT
import AdminRoute from './components/utils/AdminRoute'; // <-- IMPORT

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> 
          
          {/* Protected Routes */}
          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute>
                <BookingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          {/* We will add more admin routes like /admin/add-bus later */}
          
        </Routes>
      </main>
    </div>
  );
}

export default App;