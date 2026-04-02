// ATC Platform - Login Page
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Loader2 } from 'lucide-react';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-500/30">
            <span className="text-slate-900 font-black text-2xl">ATC</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Achieve Together Care
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">
            Enterprise Management Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 p-10 shadow-2xl">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-8 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
              <p className="text-red-400 text-sm font-bold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Daniel Hayward"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    required={!isLogin}
                    data-testid="register-name-input"
                  />
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  required
                  data-testid="login-email-input"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 pl-12 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  required
                  data-testid="login-password-input"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="login-submit-btn"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                  {isLogin ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={loginWithGoogle}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3"
            data-testid="google-login-btn"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle */}
          <p className="text-center mt-8 text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-teal-400 font-bold hover:underline"
              data-testid="toggle-auth-mode"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Demo Credentials</p>
          <p className="text-slate-400 text-sm">
            <span className="text-teal-400">admin@achievetogethercare.com.au</span> / ATCAdmin2026!
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
