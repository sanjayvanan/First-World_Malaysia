import React from 'react';
import { Check, Star, Crown, Shield } from 'lucide-react';

const PlansPage = () => {
  // Configuration for the 3 Plans
  const plans = [
    {
      id: 1,
      name: 'STARTER',
      price: '₹300',
      period: '/month',
      icon: Star,
      features: ['Access to Basic Reports', 'Direct Referrals: Unlimited', 'Level 1 Commission: 5%', 'Standard Support'],
      highlight: false,
      color: 'text-gray-300',
      btnStyle: 'bg-transparent border border-gray-600 text-white hover:bg-gray-800'
    },
    {
      id: 2,
      name: 'GOLD',
      price: '₹1000',
      period: '/month',
      icon: Crown,
      features: ['Everything in Starter', 'Level 2 Commission: 10%', 'Priority Withdrawal', 'Gold Badge on Profile', '24/7 Priority Support'],
      highlight: true, // This makes it glow
      color: 'text-sr-gold',
      btnStyle: 'bg-sr-gold text-black hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
    },
    {
      id: 3,
      name: 'DIAMOND',
      price: '₹2000',
      period: '/month',
      icon: Shield,
      features: ['Everything in Gold', 'Level 3 Commission: 15%', 'Instant Withdrawals', 'Diamond Badge & NFT', 'Dedicated Manager'],
      highlight: false,
      color: 'text-blue-200',
      btnStyle: 'bg-gradient-to-r from-blue-900 to-slate-900 border border-blue-500/30 text-white hover:border-blue-400'
    }
  ];

  return (
    <div className="animate-fade-in space-y-8 pb-10">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl font-serif text-white tracking-wide">
          Choose Your <span className="text-sr-gold">Path</span>
        </h2>
        <p className="text-gray-400">
          Upgrade your tier to unlock higher referral limits, deeper network bonuses, and exclusive community badges.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 px-2 xl:px-20 items-start">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`
              relative rounded-2xl p-8 flex flex-col h-full transition-all duration-500
              ${plan.highlight 
                ? 'bg-sr-panel border-2 border-sr-gold shadow-[0_0_40px_rgba(197,160,89,0.15)] scale-105 z-10' 
                : 'bg-black/40 border border-white/10 hover:border-sr-gold/30 hover:bg-sr-panel'
              }
            `}
          >
            {/* "Most Popular" Badge for Gold */}
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-sr-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}

            {/* Icon & Title */}
            <div className="mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${plan.highlight ? 'bg-sr-gold/20' : 'bg-white/5'}`}>
                <plan.icon size={28} className={plan.color} />
              </div>
              <h3 className={`text-xl font-bold tracking-widest ${plan.color}`}>{plan.name}</h3>
            </div>

            {/* Price */}
            <div className="mb-8">
              <span className="text-4xl font-serif text-white">{plan.price}</span>
              <span className="text-gray-500 text-sm">{plan.period}</span>
            </div>

            {/* Features List */}
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check size={16} className={plan.highlight ? 'text-sr-gold' : 'text-gray-500'} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            <button className={`w-full py-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 ${plan.btnStyle}`}>
              Select Plan
            </button>

          </div>
        ))}
      </div>
      
      {/* Bottom Note */}
      <div className="text-center mt-12">
        <p className="text-gray-500 text-xs">
          * Plans can be upgraded at any time. Differences in pricing will be pro-rated.
        </p>
      </div>

    </div>
  );
};

export default PlansPage;