import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Crown } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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

  const InfoCard = ({ title, value, colorClass = "text-sr-green" }) => (
    <div className="bg-sr-panel border border-sr-gold/30 rounded-xl p-6 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:border-sr-gold/60 transition-all duration-300 group cursor-default h-32">
      <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold mb-3 group-hover:text-sr-gold transition-colors">{title}</p>
      <p className={`text-3xl font-bold ${colorClass} drop-shadow-md`}>{value}</p>
    </div>
  );

  if (loading) return (
    <DashboardLayout>
       <div className="flex items-center justify-center h-[60vh]">
         <div className="text-sr-gold animate-pulse text-2xl font-serif tracking-widest">Entering the Kingdom...</div>
       </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      
      {/* SECTION 1: Top Cards & Badge */}
      <div className="flex flex-col lg:flex-row gap-8 mb-10">
        {/* Left: Info Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="CLIENT NAME" value={user.fullName || "User"} colorClass="text-sr-gold" />
          <InfoCard title="TOTAL DONATE" value="$0" colorClass="text-sr-green" /> 
          <InfoCard title="REFERRAL DONATE" value="$0" colorClass="text-sr-green" />
        </div>

        {/* Right: Status Badge */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center">
           <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 p-1 shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center border-4 border-gray-500">
              {/* Inner Ring */}
              <div className="absolute inset-1 rounded-full border-2 border-white/40 dashed" />
              <div className="text-center z-10">
                 <Crown className="mx-auto text-gray-700 mb-1 drop-shadow-sm" size={24} />
                 <p className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">STATUS</p>
                 <p className="text-xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">SILVER</p>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 2: The Main Image (Clean & Sized Correctly) */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-3xl rounded-xl border-2 border-sr-gold/50 bg-black shadow-[0_0_40px_rgba(197,160,89,0.1)] overflow-hidden group">
            
            {/* Golden Glow Effect behind image */}
            <div className="absolute inset-0 bg-sr-gold/5 blur-[80px] pointer-events-none" />

            {/* THE IMAGE: Adjusted sizing to match reference */}
            <img 
                src="/v2.jpg"
                alt="Sai Baba" 
                className="w-full h-auto max-h-[400px] object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700"
            />
            
            {/* Decorative Gold Frame Inner */}
            <div className="absolute inset-3 border border-sr-gold/20 rounded-lg pointer-events-none" />
        </div>
      </div>

      {/* SECTION 3: The Spiritual Network Tree */}
      <div className="bg-sr-panel/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-2xl">
        
        {/* Top Gradient Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sr-gold/70 to-transparent" />

        <div className="flex flex-col items-center space-y-8">
            <h3 className="text-xl font-serif text-white tracking-[0.2em] uppercase border-b border-white/10 pb-4">
              Your Spiritual Network
            </h3>

            {/* TREE: YOU Node */}
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-full bg-sr-blue border-[3px] border-sr-gold shadow-[0_0_30px_rgba(197,160,89,0.3)] flex items-center justify-center text-lg font-bold text-white z-20 relative">
                YOU
              </div>
              {/* Connector Line */}
              <div className="absolute top-20 left-1/2 w-0.5 h-10 bg-gradient-to-b from-sr-gold to-white/10 -translate-x-1/2 z-0"></div>
            </div>

            {/* TREE: Directs Container */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative z-10 w-full max-w-3xl shadow-inner">
                <div className="flex flex-wrap justify-center gap-3">
                  {[...Array(10)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border-2 transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                        i < (stats?.direct_referrals_count || 0)
                          ? 'bg-sr-green border-green-400 text-black font-extrabold shadow-[0_0_15px_rgba(46,204,113,0.6)]' 
                          : 'bg-white/5 border-white/10 text-gray-600 hover:border-white/30'
                      }`}
                    >
                      {i < (stats?.direct_referrals_count || 0) ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5 px-2">
                  <span className="text-gray-400 text-[10px] tracking-wider">GENERATION 1</span>
                  <span className="text-sr-gold text-[10px] font-bold">{stats?.direct_referrals_count || 0} / 10 ACTIVE</span>
                </div>
            </div>

            {/* TREE: Deeper Levels Stats */}
            <div className="grid grid-cols-2 gap-6 text-center w-full max-w-xl mt-2">
                <div className="p-4 bg-gradient-to-b from-sr-panel to-black rounded-xl border border-white/10 shadow-lg group hover:border-sr-gold/30 transition">
                  <p className="text-3xl font-bold text-white mb-1 group-hover:text-sr-gold transition">{stats?.level_1_count || 0}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Level 1 Members</p>
                </div>
                <div className="p-4 bg-gradient-to-b from-sr-panel to-black rounded-xl border border-white/10 shadow-lg group hover:border-sr-gold/30 transition">
                  <p className="text-3xl font-bold text-white mb-1 group-hover:text-sr-gold transition">{stats?.level_2_count || 0}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">Level 2 Members</p>
                </div>
            </div>

            {/* User Code */}
            <div className="mt-2 px-6 py-2 bg-black/60 border border-sr-gold/50 rounded-full text-sr-gold font-mono text-base tracking-[0.2em] shadow-[0_0_15px_rgba(197,160,89,0.2)]">
                {user.referralCode || user.referral_code}
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;