import React from 'react';

const PlansPage = () => {
  const plans = [
    {
      id: 1,
      name: 'SR JAL',
      element: 'Water',
      tagline: 'BE LIKE WATER',
      subtitle: 'The flow that moves through all spaces',
      description: 'Symbolizes emotional flow, cleansing, intuition, and adaptability in human life.',
      price: '₹15,000',
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
      benefits: [
        'Lifetime Membership Card with free entrance and meals',
        'Sai Baba Pendant (gold dust infused)',
        'SR First World Passport with Certificate',
        'Access to all facilities',
        '50% discount on Villas & Ayurvedic treatments',
        'Individual Name & Photograph on Guinness Donor Wall',
        'Membership transferable upon trust approval'
      ]
    },
    {
      id: 2,
      name: 'SR AGNI',
      element: 'Fire',
      tagline: 'IGNITE YOUR PURPOSE',
      subtitle: 'The energy that drives vision into reality',
      description: 'Embodies transformation, energy, passion, and the drive for action.',
      price: '₹15,000',
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
      benefits: [
        'Lifetime Membership Card with free entrance and meals',
        'Sai Baba Pendant (gold dust infused)',
        'SR First World Passport with Certificate',
        'Access to all facilities',
        '70% discount on Villas & Ayurvedic treatments',
        'Individual Name & Photograph on Guinness Donor Wall',
        'Membership transferable upon trust approval'
      ]
    },
    {
      id: 3,
      name: 'SR VAYU',
      element: 'Air',
      tagline: 'MOVE WITH CLARITY',
      subtitle: 'The breath that moves through all spaces',
      description: 'Signifies elevation, communication, influence and the power of thought.',
      price: '₹15,000',
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
      benefits: [
        'Lifetime Membership Card with free entrance and meals',
        'Sai Baba Pendant (Gold dust infused)',
        'SR First World Passport with Certificate',
        'Access to all facilities',
        '100% discount on Villas & Ayurvedic Treatments',
        'Individual Name & Photograph on Guinness Donor Wall',
        'Membership transferable upon trust approval',
        'Education Loans worldwide, interest-free'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1F3F] py-12 px-4">
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide mb-3">
          Membership
        </h1>
        <p className="text-gray-400 italic text-lg">
          Your contribution. Your element. Your journey.
        </p>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed mt-6">
          Every member of SR First World embodies one of the five sacred elements— Earth, Water, Fire, Air, and Ether.
          Each element carries its own unique essence, wisdom, and transformative power in the cycle of creation.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`rounded-xl overflow-hidden border ${plan.borderColor} ${plan.hoverBorder} ${plan.cardBg} backdrop-blur-sm transition-all duration-500 flex flex-col hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Card Header with Element Icon */}
            <div className={`bg-gradient-to-br ${plan.gradient} p-8 text-white text-center relative overflow-hidden`}>
              {/* Animated background effect */}
              <div className="absolute inset-0 opacity-20">
                {plan.id === 1 && (
                  <div className="absolute inset-0 animate-pulse" style={{
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                  }}></div>
                )}
                {plan.id === 2 && (
                  <>
                    <div className="absolute inset-0 animate-pulse" style={{
                      background: 'radial-gradient(ellipse at 50% 30%, rgba(255,200,0,0.4) 0%, transparent 60%)',
                      animationDuration: '2s'
                    }}></div>
                    <div className="absolute inset-0 animate-pulse" style={{
                      background: 'radial-gradient(ellipse at 50% 70%, rgba(255,100,0,0.3) 0%, transparent 50%)',
                      animationDuration: '3s'
                    }}></div>
                  </>
                )}
                {plan.id === 3 && (
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 2px)',
                    backgroundSize: '40px 40px'
                  }}></div>
                )}
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-center mb-4">
                  {plan.icon}
                </div>
                <h2 className="text-3xl font-bold tracking-wider mb-2">{plan.name}</h2>
                <p className="text-sm uppercase tracking-widest opacity-90 mb-1">{plan.element}</p>
                <p className="text-xs uppercase tracking-widest font-light opacity-75">{plan.tagline}</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 flex-1 flex flex-col bg-[#0B1F3F]/60 backdrop-blur-sm">
              <p className="text-gray-300 italic text-sm mb-2">{plan.subtitle}</p>
              <p className="text-gray-400 text-xs mb-6 leading-relaxed">{plan.description}</p>

              {/* Price */}
              <div className="mb-8 pb-6 border-b border-gray-700/50">
                <div className={`text-4xl font-serif ${plan.textColor}`}>{plan.price}</div>
                <div className="text-gray-500 text-xs uppercase tracking-wide mt-1">One-time contribution</div>
              </div>

              {/* Benefits */}
              <div className="mb-8 flex-1">
                <h3 className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-semibold">Membership Benefits</h3>
                <ul className="space-y-3">
                  {plan.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className={`${plan.bulletBg} ${plan.bulletColor} rounded-full p-1 mt-0.5 flex-shrink-0`}>
                        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
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
              <button className={`w-full py-4 rounded-lg bg-gradient-to-r ${plan.gradient} text-white font-semibold uppercase tracking-widest text-xs hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-${plan.id === 1 ? 'cyan' : plan.id === 2 ? 'orange' : 'indigo'}-500/50`}>
                Select {plan.element}
              </button>
            </div>

            {/* Certificate Footer */}
            <div className="bg-black/30 px-8 py-4 border-t border-gray-700/50">
              <p className="text-center text-gray-500 text-xs italic">
                Signed, The Founder and Trustees
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Philosophy Section */}
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-gray-600 text-xs uppercase tracking-[0.3em] font-light">
          Love All, Serve All
        </p>
      </div>

    </div>
  );
};

export default PlansPage;