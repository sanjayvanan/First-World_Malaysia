import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Connect to your Backend Login API
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // 1. Save the Token (Your "Passport")
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // 2. Redirect based on Role
      if (res.data.user.role === 'SUPERUSER') {
        // FIXED: Navigate to the Admin Page instead of alerting
        navigate('/admin'); 
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed. Check backend console.');
    }
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
            className="w-full bg-sairam-gold text-white font-bold py-3 rounded hover:bg-yellow-600 transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;