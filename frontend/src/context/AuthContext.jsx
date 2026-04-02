// ATC Platform - Auth Context
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, formatApiErrorDetail } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Three states: null (checking), user object (authenticated), false (not authenticated)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAuth = useCallback(async () => {
    try {
      const userData = await authAPI.me();
      setUser(userData);
    } catch (err) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authAPI.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMessage = formatApiErrorDetail(err.response?.data?.detail) || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (email, password, name, role = 'staff') => {
    try {
      setError(null);
      const data = await authAPI.register(email, password, name, role);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMessage = formatApiErrorDetail(err.response?.data?.detail) || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(false);
  };

  const loginWithGoogle = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const exchangeGoogleSession = async (sessionId) => {
    try {
      setError(null);
      const data = await authAPI.googleSession(sessionId);
      setUser(data.user);
      return data;
    } catch (err) {
      const errorMessage = formatApiErrorDetail(err.response?.data?.detail) || err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    exchangeGoogleSession,
    checkAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
