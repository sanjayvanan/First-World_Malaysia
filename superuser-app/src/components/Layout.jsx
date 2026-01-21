import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
// 1. Added 'Settings' to the imports
import { Shield, LogOut, Edit, LayoutDashboard, Settings } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('superuser_token');
    localStorage.removeItem('superuser_user');
    navigate('/login');
  };

  // Helper to match your Gold/Blue theme dynamically
  const isActive = (path) => location.pathname === path 
    ? "text-sr-gold border-sr-gold/50 bg-sr-gold/10 shadow-[0_0_15px_rgba(197,160,89,0.1)]" 
    : "text-gray-400 border-transparent hover:text-sr-gold hover:border-sr-gold/30 hover:bg-white/5";

  return (
    <div className="min-h-screen bg-sr-blue font-sans text-gray-200 flex flex-col">
      
      {/* Navbar */}
      <nav className="bg-sr-panel border-b border-sr-gold/20 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sr-gold rounded-full flex items-center justify-center text-sr-blue font-bold shadow-[0_0_10px_rgba(197,160,89,0.4)]">
                <Shield size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-wider flex items-center">
                <span>SR</span>
                <span className="ml-2 hidden sm:inline">First World</span>
                <span className="ml-2 text-sr-gold drop-shadow-sm">ADMIN</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-3">
              <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${isActive('/')}`}>
                <LayoutDashboard size={14} /> 
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <Link to="/plans" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${isActive('/plans')}`}>
                <Edit size={14} /> 
                <span className="hidden sm:inline">Plans</span>
              </Link>

              {/* NEW SETTINGS LINK */}
              <Link to="/settings" className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-all duration-300 ${isActive('/settings')}`}>
                <Settings size={14} /> 
                <span className="hidden sm:inline">Settings</span>
              </Link>

              <div className="hidden md:block h-6 w-px bg-sr-gold/20 mx-2"></div>
              
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-200 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/20 hover:border-red-500/40">
                <LogOut size={16} /> 
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <Outlet />
      </main>

    </div>
  );
};

export default Layout;