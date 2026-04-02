import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import "@/App.css";
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import OwnerPortal from "./components/portals/OwnerPortal";
import { Loader2 } from 'lucide-react';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If user data was passed from AuthCallback, skip auth check
  if (location.state?.user) {
    return children;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-6" />
          <p className="text-white text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// App Router Component
function AppRouter() {
  const location = useLocation();

  // CRITICAL: Check URL fragment synchronously for session_id (Google OAuth callback)
  // This must happen before ProtectedRoute runs to prevent race conditions
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <OwnerPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <OwnerPortal />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <AppRouter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
