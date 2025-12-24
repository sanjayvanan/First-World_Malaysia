import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Copy, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/referrals/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('Referral Code Copied!');
  };

  // Helper Component for Stats Cards
  const StatCard = ({ title, value, max, color, icon: Icon }) => (
    <div className="bg-maxso-card border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/20 transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={60} />
      </div>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <div className="mt-4 flex items-baseline space-x-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-500">/ {max}</span>
      </div>
      {/* Progress Bar */}
      <div className="mt-4 h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color.replace('text-', 'bg-')}`} 
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  if (loading) return <div className="text-white p-10">Loading Power-10 System...</div>;

  return (
    <DashboardLayout>
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-gray-400 mt-1">Welcome back, {user.fullName}</p>
        </div>
        
        {/* Referral Code Box */}
        <div className="bg-gradient-to-r from-maxso-glow to-blue-600 p-[1px] rounded-lg">
          <div className="bg-maxso-dark rounded-lg px-4 py-3 flex items-center space-x-4">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Your Invite Code</p>
              <p className="text-xl font-mono font-bold text-white tracking-wider">{user.referralCode}</p>
            </div>
            <button 
              onClick={copyCode}
              className="p-2 hover:bg-white/10 rounded-full transition"
              title="Copy Code"
            >
              <Copy size={20} className="text-maxso-accent" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Direct Referrals" 
          value={stats?.direct_referrals_count || 0} 
          max={10} 
          color="text-emerald-400" 
          icon={Users}
        />
        <StatCard 
          title="Level 1 Network" 
          value={stats?.level_1_count || 0} 
          max={100} 
          color="text-blue-400" 
          icon={TrendingUp}
        />
        <StatCard 
          title="Level 2 Empire" 
          value={stats?.level_2_count || 0} 
          max={1000} 
          color="text-purple-400" 
          icon={ShieldCheck}
        />
      </div>

      {/* The Visual Tree Section */}
      <div className="bg-maxso-card border border-white/5 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-white">Your Power-10 Structure</h3>
          <span className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-400 border border-white/10">
            Current Rank: {stats?.current_tier || 'STARTER'}
          </span>
        </div>

        {/* Tree Visualizer */}
        <div className="flex flex-col items-center space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute top-10 bottom-10 w-px bg-gradient-to-b from-maxso-glow/50 to-transparent" />

          {/* Level 0: YOU */}
          <div className="z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-maxso-glow border-4 border-maxso-dark shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center text-xl font-bold text-white">
              YOU
            </div>
          </div>

          {/* Level 1: Slots */}
          <div className="z-10 w-full max-w-2xl bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-400">Generation 1 (Directs)</span>
              <span className="text-xs text-maxso-accent">{stats?.direct_referrals_count || 0} / 10 Active</span>
            </div>
            
            {/* The 10 Dots */}
            <div className="flex justify-between">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border border-black/50 transition-all ${
                    i < (stats?.direct_referrals_count || 0)
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                      : 'bg-white/5 text-gray-600'
                  }`}
                >
                  {i < (stats?.direct_referrals_count || 0) ? '✓' : i + 1}
                </div>
              ))}
            </div>
          </div>
          
          {/* Level 2 Hint */}
          <div className="z-10 px-6 py-2 bg-white/5 rounded-full border border-white/10 text-sm text-gray-400">
            Level 2 Members: <span className="text-white font-bold ml-2">{stats?.level_1_count || 0}</span>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;