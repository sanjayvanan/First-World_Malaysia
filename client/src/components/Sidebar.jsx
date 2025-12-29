import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Home, Users, DollarSign, Settings, HelpCircle, Layers, LogOut, Shield, ShieldCheck, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'ADMIN';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const NavItem = ({ icon: Icon, label, path, isSpecial = false }) => {
    const isActive = location.pathname === path;
    
    return (
      <button 
        onClick={() => {
            navigate(path);
            if (window.innerWidth < 768) onClose(); // Auto-close on mobile click
        }}
        className={`
          w-full flex items-center space-x-3 px-6 py-4 mb-2 transition-all duration-300 relative group overflow-hidden
          ${isActive 
            ? 'text-sr-gold bg-gradient-to-r from-sr-gold/20 to-transparent border-l-4 border-sr-gold shadow-[0_0_25px_rgba(197,160,89,0.15)]' 
            : isSpecial 
                ? 'text-sr-gold border-l-4 border-sr-gold/50 bg-sr-gold/5 hover:bg-sr-gold/20' 
                : 'text-gray-400 hover:text-sr-gold hover:bg-gradient-to-r hover:from-sr-gold/10 hover:to-transparent border-l-4 border-transparent'
          }
        `}
      >
        <Icon 
          size={20} 
          className={`transition-all duration-300 relative z-10 ${isActive ? "drop-shadow-[0_0_8px_rgba(197,160,89,0.8)]" : "group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.6)]"}`} 
        />
        <span className={`font-medium tracking-wide z-10 transition-all ${isActive ? "font-bold drop-shadow-[0_0_5px_rgba(197,160,89,0.4)]" : "group-hover:drop-shadow-[0_0_5px_rgba(197,160,89,0.4)]"}`}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* MOBILE BACKDROP OVERLAY */}
      <div 
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={`
          fixed md:relative top-0 left-0 z-50 h-full w-72 bg-sr-panel border-r border-sr-gold/20 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out flex-shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        
        {/* Header */}
        <div className="p-8 border-b border-sr-gold/10 flex-shrink-0 flex justify-between items-center">
          <h1 className="text-2xl lg:text-3xl font-bold italic text-white tracking-wider drop-shadow-md">
            SR FIRST <span className="text-sr-gold drop-shadow-[0_0_10px_rgba(197,160,89,0.5)]">WORLD</span>
          </h1>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-8 overflow-y-auto custom-scrollbar px-2 space-y-1">
          {isAdmin && (
            <div className="mb-6 mx-4 p-1 rounded border border-sr-gold/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-sr-gold/10 animate-pulse pointer-events-none" />
                <button 
                    onClick={() => navigate('/admin')}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-black/40 hover:bg-sr-gold hover:text-black transition-all duration-300 text-sr-gold font-bold uppercase tracking-wider text-xs"
                >
                    <ShieldCheck size={16} />
                    <span>Manager Portal</span>
                </button>
            </div>
          )}

          <NavItem icon={Home} label="Dashboard" path="/dashboard" />
          <NavItem icon={Users} label="Your Spritual Network" path="/dashboard/network" /> 
          <NavItem icon={DollarSign} label="Donate" path="/dashboard/donate" />
          <NavItem icon={Layers} label="Plans" path="/dashboard/plans" />
          <NavItem icon={Shield} label="Verify Identity" path="/dashboard/kyc" />
          <NavItem icon={Settings} label="Settings" path="/dashboard/settings" />
          <NavItem icon={HelpCircle} label="Help" path="/dashboard/help" />
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-sr-gold/10 flex-shrink-0 bg-black/20">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-400 transition hover:translate-x-1"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;