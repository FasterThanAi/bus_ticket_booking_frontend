import React, { createContext, useContext, useState, useEffect } from 'react';

// The URL of your backend
const API_URL = 'http://localhost:8080/api/auth';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider (a component that wraps your app)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // This runs when the app first loads
  useEffect(() => {
    // Check if user data is in localStorage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(JSON.parse(storedToken));
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Auth Functions ---

  // Login Function
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Save to state
      setUser(data.user);
      setToken(data.token);

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', JSON.stringify(data.token));
      return data.user; // <-- ADD THIS LINE

    } catch (error) {
      console.error('Login Error:', error);
      // Re-throw the error so the login page can catch it
      throw error;
    }
  };

  // Logout Function
  const logout = () => {
    // Clear from state
    setUser(null);
    setToken(null);

    // Clear from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
    // Register Function
  const register = async (name, email, password, phone) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      if (!response.ok) {
        // Handle errors like "User already exists"
        const errData = await response.json();
        throw new Error(errData.message || 'Registration failed');
      }

      // After registering, you can either:
      // 1. Send them to the login page to log in.
      // 2. Automatically log them in (we'll do this later, it's more complex).
      // For now, we'll just return success.
      return { success: true };

    } catch (error) {
      console.error('Registration Error:', error);
      throw error; // Re-throw so the register page can catch it
    }
  };
  // 3. The "value" is what all components will get
  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAdmin: user && user.userType === 'Admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Create a custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};
