import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Crown, Users, Layers } from 'lucide-react';

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

  // --- BADGE LOGIC ---
  const getBadgeConfig = (count = 0) => {
    if (count >= 10) return { label: 'GOLD', textColor: 'text-yellow-100', gradient: 'bg-gradient-to-br from-yellow-400 via-orange-300 to-yellow-600', border: 'border-yellow-400', glow: 'shadow-[0_0_30px_rgba(250,204,21,0.6)]' };
    if (count >= 6) return { label: 'SILVER', textColor: 'text-white', gradient: 'bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400', border: 'border-gray-300', glow: 'shadow-[0_0_30px_rgba(255,255,255,0.4)]' };
    if (count >= 3) return { label: 'BRONZE', textColor: 'text-orange-50', gradient: 'bg-gradient-to-br from-orange-400 via-amber-700 to-orange-800', border: 'border-orange-500', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.4)]' };
    return { label: 'MEMBER', textColor: 'text-gray-400', gradient: 'bg-gradient-to-br from-gray-800 to-gray-900', border: 'border-gray-700', glow: 'shadow-none' };
  };

  const referralCount = stats?.direct_referrals_count || 0;
  const badge = getBadgeConfig(referralCount);

  const InfoCard = ({ title, value, colorClass = "text-sr-green" }) => (
    <div className="bg-sr-panel border border-sr-gold/30 rounded-xl p-6 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:border-sr-gold/60 transition-all duration-300 group cursor-default h-32">
      <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold mb-3 group-hover:text-sr-gold transition-colors">{title}</p>
      <p className={`text-3xl font-bold ${colorClass} drop-shadow-md`}>{value}</p>
    </div>
  );

  const LevelCard = ({ level, count, label }) => (
    <div className="bg-gradient-to-b from-sr-panel to-black/80 border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-lg">
       <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-sr-gold/10 flex items-center justify-center text-sr-gold">
            <Layers size={20} />
          </div>
          <div>
             <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">{label}</p>
             <p className="text-white text-lg font-bold">Level {level}</p>
          </div>
       </div>
       <div className="text-2xl font-bold text-sr-gold">{count}</div>
    </div>
  );

  if (loading) return <div className="text-sr-gold animate-pulse text-2xl font-serif tracking-widest text-center mt-20">Entering the Kingdom...</div>;

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* SECTION 1: Top Cards & Badge */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Info Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="CLIENT NAME" value={user.fullName || "User"} colorClass="text-sr-gold" />
          <InfoCard title="TOTAL DONATE" value="$0" colorClass="text-sr-green" /> 
          <InfoCard title="REFERRAL DONATE" value="$0" colorClass="text-sr-green" />
        </div>

        {/* Right: Dynamic Status Badge */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end items-center">
           <div className={`relative w-32 h-32 rounded-full p-1 flex items-center justify-center border-4 ${badge.gradient} ${badge.border} ${badge.glow} transition-all duration-700`}>
              <div className="absolute inset-1 rounded-full border-2 border-white/40 dashed animate-spin-slow" />
              <div className="text-center z-10">
                 <Crown className={`mx-auto mb-1 drop-shadow-sm ${badge.textColor}`} size={24} />
                 <p className="text-[10px] font-extrabold text-black/60 uppercase tracking-widest">STATUS</p>
                 <p className={`text-xl font-black ${badge.textColor} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`}>{badge.label}</p>
              </div>
           </div>
        </div>
      </div>

      {/* SECTION 2: Network Stats (RESTORED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-serif italic text-xl mb-4 flex items-center gap-2">
               <Users className="text-sr-gold" size={20}/> Network Growth
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <LevelCard level="1" count={stats?.level_1_count || 0} label="Direct Network" />
               <LevelCard level="2" count={stats?.level_2_count || 0} label="Extended Network" />
            </div>
         </div>
      </div>

      {/* SECTION 3: The Main Image */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-3xl rounded-xl border-2 border-sr-gold/50 bg-black shadow-[0_0_40px_rgba(197,160,89,0.1)] overflow-hidden group">
            <div className="absolute inset-0 bg-sr-gold/5 blur-[80px] pointer-events-none" />
            <img src="/v2.jpg" alt="Sai Baba" className="w-full h-auto max-h-[400px] object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-3 border border-sr-gold/20 rounded-lg pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;