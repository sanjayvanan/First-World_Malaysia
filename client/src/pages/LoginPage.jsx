import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Use Redux Hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
        if (user.role === 'SUPERUSER') navigate('/admin');
        else navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    // Dispatch the action
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sairam-beige font-serif">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-sairam-gold">
        <h2 className="text-3xl font-bold text-center text-sairam-text mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Sign in to Sai Ram / Maxso</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-sairam-gold outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-sairam-gold outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sairam-gold text-white font-bold py-3 rounded hover:bg-yellow-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;