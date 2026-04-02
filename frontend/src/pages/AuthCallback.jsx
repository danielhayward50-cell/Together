// ATC Platform - Auth Callback for Google OAuth
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exchangeGoogleSession } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const sessionId = new URLSearchParams(hash.slice(1)).get('session_id');

        if (!sessionId) {
          console.error('No session_id found in URL');
          navigate('/login');
          return;
        }

        // Exchange session_id for user data
        await exchangeGoogleSession(sessionId);
        
        // Navigate to dashboard
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login');
      }
    };

    processCallback();
  }, [location.hash, exchangeGoogleSession, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mx-auto mb-6" />
        <p className="text-white text-xl font-bold">Authenticating...</p>
        <p className="text-slate-400 text-sm mt-2">Please wait while we log you in</p>
      </div>
    </div>
  );
}

export default AuthCallback;
