import React, { useState } from 'react';
import api from '../api/axios'; // <--- IMPORT YOUR NEW FILE
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ChevronRight, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // <--- CHANGED: No more 'http://localhost:5000'
      const res = await api.post('/api/auth/login', { 
        email, 
        password 
      });

      if (res.data.user.role !== 'SUPERUSER') {
        setError("Access Denied: Insufficient Privileges");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('superuser_token', res.data.token);
      localStorage.setItem('superuser_user', JSON.stringify(res.data.user));
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || "Authentication Failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050914] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#C5A059]/5 rounded-full blur-[120px]" />
      
      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0F1629]/80 backdrop-blur-xl border border-[#C5A059]/20 p-8 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6)] relative z-10 animate-fade-in-up">
        
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-b from-[#1a233a] to-[#0F1629] border border-[#C5A059]/30 shadow-inner mb-4 group">
            <Shield className="text-[#C5A059] w-8 h-8 drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
            SR First World <span className="text-[#C5A059]">Superuser</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
            <div className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse" />
            <p className="text-[10px] text-[#C5A059] tracking-[0.3em] uppercase">Secure Gateway</p>
            <div className="w-1 h-1 rounded-full bg-[#C5A059] animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-200 text-sm animate-shake">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Admin Identity</label>
            <div className="relative group">
              <input 
                type="email" 
                required
                className="w-full bg-[#050914] border border-[#2a3655] rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 focus:outline-none transition-all duration-300 pl-10"
                placeholder="admin@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[#C5A059] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Secure Passkey</label>
            <div className="relative group">
              <input 
                type="password" 
                required
                className="w-full bg-[#050914] border border-[#2a3655] rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 focus:outline-none transition-all duration-300 pl-10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="w-4 h-4 absolute left-3.5 top-4 text-gray-500 group-focus-within:text-[#C5A059] transition-colors" />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-[#050914] font-bold py-3.5 rounded-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#050914] border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>INITIATE SESSION</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-gray-800 pt-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Restricted System • IP Logged & Monitored
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;