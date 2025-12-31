import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import api from '../api/axios';
import { Lock, Mail, User, Gift, ArrowRight, ShieldCheck } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '', // <--- NEW Field
    referredByCode: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validation: Check Passwords Match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // 2. Call Register API
      // We exclude confirmPassword from the payload sent to backend
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        referredByCode: formData.referredByCode
      };

      const res = await api.post('/api/auth/register', payload);
      
      // 3. AUTO LOGIN: Extract User & Token from response
      const { user, token } = res.data;

      if (token && user) {
        // Update Redux State
        dispatch(setCredentials({ user, token }));
        
        // Update LocalStorage (Backup)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // 4. Redirect directly to Dashboard
        navigate('/dashboard');
      } else {
        // Fallback if no token (shouldn't happen with new backend)
        alert('Registration Successful! Please login.');
        navigate('/login');
      }

    } catch (err) {
      console.error(err);
      alert('Registration Failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sr-gold/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sr-green/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-sr-panel border border-sr-gold/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 backdrop-blur-sm">
        <div className="text-center mb-6">
           <h1 className="text-4xl font-serif text-white tracking-tighter mb-2">
             MAX<span className="text-sr-gold">SO</span>
           </h1>
           <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">New Member Registration</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Full Name */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="enter@email.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Confirm Password (NEW) */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldCheck size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="password"
                name="confirmPassword"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">Referral Code (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Gift size={18} className="text-gray-600 group-focus-within:text-sr-gold transition-colors" />
              </div>
              <input
                type="text"
                name="referredByCode"
                value={formData.referredByCode}
                onChange={handleChange}
                className="w-full bg-black/40 border border-gray-800 text-white rounded-lg py-3 pl-10 pr-4 focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all placeholder-gray-600"
                placeholder="MAX-XXXXX"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sr-gold text-black font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.3)] hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Creating Account...' : (
              <>
                Join Kingdom <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account? <Link to="/login" className="text-sr-gold cursor-pointer hover:underline">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;