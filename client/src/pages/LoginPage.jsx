import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // <--- Added Link
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import api from '../api/axios';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      const user = res.data.user;
      const token = res.data.token;

      dispatch(setCredentials({ user, token }));

      // Redundant backup (Redux handles this now, but safe to keep)
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'ADMIN') {
        navigate('/admin'); 
      } else {
        navigate('/dashboard'); 
      }

    } catch (err) {
      console.error(err);
      alert('Login Failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sr-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sr-green/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-sr-panel border border-sr-gold/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
           <h1 className="text-4xl font-serif text-white tracking-tighter mb-2">
             SR<span className="text-sr-gold">First World</span>
           </h1>
           <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Member Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="enter@email.com"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sr-gold text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Accessing...' : (
              <>
                Enter Kingdom <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {/* --- CHANGED: Link to /register --- */}
          <p className="text-gray-600 text-sm">
            Don't have an account? <Link to="/register" className="text-sr-gold cursor-pointer hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;