import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NetworkPage = () => {
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/referrals/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(res.data);
        } catch(e) { console.error(e); }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-sr-panel/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-2xl animate-fade-in">
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
              <div className="absolute top-20 left-1/2 w-0.5 h-10 bg-gradient-to-b from-sr-gold to-white/10 -translate-x-1/2 z-0"></div>
            </div>

            {/* TREE: Directs Container */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 relative z-10 w-full max-w-3xl shadow-inner">
                <div className="flex flex-wrap justify-center gap-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs border-2 transition-all ${i < (stats?.direct_referrals_count || 0) ? 'bg-sr-green border-green-400 text-black font-extrabold' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                      {i < (stats?.direct_referrals_count || 0) ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
            </div>
            
            <div className="mt-2 px-6 py-2 bg-black/60 border border-sr-gold/50 rounded-full text-sr-gold font-mono text-base tracking-[0.2em]">
                {user.referralCode || user.referral_code}
            </div>
        </div>
    </div>
  );
};

export default NetworkPage;