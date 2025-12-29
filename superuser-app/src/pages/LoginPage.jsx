import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Call the Main Backend
      const res = await axios.post('http://localhost:5000/api/auth/login', { 
        email, 
        password 
      });

      // 2. STRICT CHECK: Is this a Superuser?
      if (res.data.user.role !== 'SUPERUSER') {
        setError("ACCESS DENIED: You do not have Administrator privileges.");
        return;
      }

      // 3. Success: Save Token
      localStorage.setItem('superuser_token', res.data.token);
      localStorage.setItem('superuser_user', JSON.stringify(res.data.user));
      navigate('/');

    } catch (err) {
      setError(err.response?.data?.error || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-sr-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-sr-panel border border-sr-gold/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sr-gold to-transparent" />

        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-sr-blue rounded-full flex items-center justify-center border-2 border-sr-gold shadow-[0_0_20px_rgba(197,160,89,0.2)] mb-4">
                <Shield className="text-sr-gold" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Superuser Control</h1>
            <p className="text-sr-gold text-xs tracking-[0.3em] mt-2">SR FIRST WORLD</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm text-center flex items-center justify-center gap-2">
                <Lock size={14} /> {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black/40 border border-sr-gold/20 rounded px-4 py-3 text-white focus:border-sr-gold focus:outline-none transition-colors"
              placeholder="admin@maxso.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-black/40 border border-sr-gold/20 rounded px-4 py-3 text-white focus:border-sr-gold focus:outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-sr-gold text-black font-bold py-3 rounded hover:bg-white hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all duration-300 transform hover:-translate-y-1"
          >
            ENTER SYSTEM
          </button>
        </form>

        <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-600 uppercase">Restricted Access • Unauthorized access is monitored</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;