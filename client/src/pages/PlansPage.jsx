import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STYLE MAPPING (Includes new 'Earth' style) ---
  const getStyle = (element) => {
    const styles = {
      'Water': {
        icon: (
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 30 50 Q 40 35, 50 50 T 70 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 35 60 Q 45 50, 50 60 T 65 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="35" r="3" fill="currentColor"/>
          </svg>
        ),
        gradient: 'from-cyan-500 via-blue-500 to-blue-600',
        cardBg: 'bg-gradient-to-br from-cyan-900/20 via-blue-900/30 to-blue-950/40',
        borderColor: 'border-cyan-500/30',
        hoverBorder: 'hover:border-cyan-400/60',
        textColor: 'text-cyan-400',
        bulletBg: 'bg-cyan-500/20',
        bulletColor: 'text-cyan-400',
        shadowColor: 'cyan'
      },
      'Fire': {
        icon: (
           <svg viewBox="0 0 100 100" className="w-20 h-20">
            <path d="M 50 20 Q 45 35, 50 50 Q 55 35, 50 20 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M 40 45 Q 38 55, 45 65 Q 50 70, 55 65 Q 62 55, 60 45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M 35 60 Q 30 70, 35 80 L 45 75 Q 50 85, 55 75 L 65 80 Q 70 70, 65 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
        gradient: 'from-orange-500 via-red-500 to-red-600',
        cardBg: 'bg-gradient-to-br from-orange-900/20 via-red-900/30 to-red-950/40',
        borderColor: 'border-orange-500/30',
        hoverBorder: 'hover:border-orange-400/60',
        textColor: 'text-orange-400',
        bulletBg: 'bg-orange-500/20',
        bulletColor: 'text-orange-400',
        shadowColor: 'orange'
      },
      'Air': {
         icon: (
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <circle cx="50" cy="35" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="35" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="65" cy="55" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 43 Q 40 48, 35 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 50 43 Q 60 48, 65 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 35 63 Q 42 70, 50 72" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 65 63 Q 58 70, 50 72" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ),
        gradient: 'from-indigo-500 via-purple-500 to-purple-600',
        cardBg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/30 to-purple-950/40',
        borderColor: 'border-indigo-500/30',
        hoverBorder: 'hover:border-indigo-400/60',
        textColor: 'text-indigo-400',
        bulletBg: 'bg-indigo-500/20',
        bulletColor: 'text-indigo-400',
        shadowColor: 'indigo'
      },
      'Earth': {
        icon: (
          <svg viewBox="0 0 100 100" className="w-20 h-20">
            <path d="M 50 20 L 80 80 L 20 80 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
            <rect x="35" y="45" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M 50 35 L 50 60 M 35 60 L 65 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
        gradient: 'from-emerald-500 via-green-500 to-green-600',
        cardBg: 'bg-gradient-to-br from-emerald-900/20 via-green-900/30 to-green-950/40',
        borderColor: 'border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-400/60',
        textColor: 'text-emerald-400',
        bulletBg: 'bg-emerald-500/20',
        bulletColor: 'text-emerald-400',
        shadowColor: 'emerald'
      }
    };
    return styles[element] || styles['Water'];
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/api/plans');
        setPlans(res.data);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0B1F3F] flex items-center justify-center text-white">Loading Plans...</div>;

  return (
    // --- LAYOUT FIX: Reduced py-12 to pt-4 pb-12 ---
    <div className="min-h-screen bg-[#0B1F3F] pt-4 pb-12 px-4">
      
      {/* Header Section */}
      {/* --- LAYOUT FIX: Reduced mb-12 to mb-6, space-y-4 to space-y-2 --- */}
      <div className="max-w-4xl mx-auto text-center mb-6 space-y-2">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-wide mb-2">
          Membership
        </h1>
        <p className="text-gray-400 italic text-sm">
          Your contribution. Your element. Your journey.
        </p>
        {/* Reduced top margin mt-6 to mt-2 */}
        <p className="text-gray-500 text-xs max-w-2xl mx-auto leading-relaxed mt-2">
          Every member of SR First World embodies one of the five sacred elements— Earth, Water, Fire, Air, and Ether.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {plans.map((plan) => {
          const style = getStyle(plan.element);
          
          return (
            <div 
              key={plan.id}
              className={`rounded-xl overflow-hidden border ${style.borderColor} ${style.hoverBorder} ${style.cardBg} backdrop-blur-sm transition-all duration-500 flex flex-col hover:scale-[1.02] hover:shadow-2xl`}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${style.gradient} p-6 text-white text-center relative overflow-hidden`}>
                 <div className="absolute inset-0 opacity-20"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    {style.icon}
                  </div>
                  <h2 className="text-2xl font-bold tracking-wider mb-2">{plan.name}</h2>
                  <p className="text-xs uppercase tracking-widest opacity-90 mb-1">{plan.element}</p>
                  <p className="text-[10px] uppercase tracking-widest font-light opacity-75">{plan.tagline}</p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col bg-[#0B1F3F]/60 backdrop-blur-sm">
                <p className="text-gray-300 italic text-xs mb-2">{plan.subtitle}</p>
                <p className="text-gray-400 text-[11px] mb-6 leading-relaxed">{plan.description}</p>

                {/* Price */}
                <div className="mb-6 pb-4 border-b border-gray-700/50">
                  <div className={`text-3xl font-serif ${style.textColor}`}>{plan.price}</div>
                  <div className="text-gray-500 text-[10px] uppercase tracking-wide mt-1">One-time contribution</div>
                </div>

                {/* Benefits */}
                <div className="mb-6 flex-1">
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-semibold">Membership Benefits</h3>
                  <ul className="space-y-2">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300 text-xs">
                        <span className={`${style.bulletBg} ${style.bulletColor} rounded-full p-0.5 mt-0.5 flex-shrink-0`}>
                          <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="6" cy="6" r="5"/>
                            <circle cx="6" cy="6" r="2" fill="currentColor"/>
                          </svg>
                        </span>
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-3 rounded-lg bg-gradient-to-r ${style.gradient} text-white font-semibold uppercase tracking-widest text-[10px] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-${style.shadowColor}-500/50`}>
                  Select {plan.element}
                </button>
              </div>

              {/* Certificate Footer */}
              <div className="bg-black/30 px-6 py-3 border-t border-gray-700/50">
                <p className="text-center text-gray-500 text-[10px] italic">
                  Signed, The Founder and Trustees
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlansPage;