import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Award, LogOut } from 'lucide-react';
import { Shield } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const NavItem = ({ icon: Icon, label, path }) => {
    const isActive = location.pathname === path;
    return (
      <button 
        onClick={() => navigate(path)}
        className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 border-r-4 ${
          isActive 
            ? 'border-maxso-glow bg-white/5 text-maxso-accent' 
            : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={20} />
        <span className="font-medium tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-maxso-dark text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-maxso-card border-r border-white/10 hidden md:flex flex-col z-20">
        <div className="p-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-maxso-accent to-maxso-glow bg-clip-text text-transparent">
            MAXSO
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">First World</p>
        </div>

        <nav className="flex-1 mt-6">
          <NavItem icon={LayoutDashboard} label="Overview" path="/dashboard" />
          <NavItem icon={Users} label="My Network" path="/dashboard/network" />
          <NavItem icon={Award} label="Badges" path="/dashboard/badges" />
          <NavItem icon={Shield} label="Verify Identity" path="/dashboard/kyc" />
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-maxso-glow to-blue-600 flex items-center justify-center font-bold">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.fullName}</p>
              <p className="text-xs text-maxso-accent">{user.referral_code}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-400 transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-96 bg-maxso-glow/10 blur-[100px] pointer-events-none" />
        
        <div className="p-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;