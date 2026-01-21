import React, { useEffect, useState } from 'react';
import { CreditCard, Building2, User, MapPin } from 'lucide-react';
import api from '../api/axios'; // This now includes the token automatically!

const DonatePage = () => {
  // Default state (Loading placeholder)
  const [bankDetails, setBankDetails] = useState({
    bank_account_name: 'Loading...',
    bank_account_number: '...',
    bank_name: 'Loading...',
    bank_ifsc: '...',
    bank_branch: '...'
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get('/api/settings'); // Calls the backend
        if (res.data && Object.keys(res.data).length > 0) {
            setBankDetails(res.data);
        }
      } catch (err) {
        console.error("Could not load bank details", err);
      }
    };
    fetchDetails();
  }, []);

  return (
    <div className="w-full max-w-4xl p-4 pt-0 text-white">
      {/* Header */}
      <div className="mb-4 text-left">
        <h1 className="text-3xl md:text-5xl font-serif text-sr-gold mb-1 tracking-wide">
          Contribution
        </h1>
        <p className="text-gray-400 text-sm tracking-widest uppercase">
          Support the First World Vision
        </p>
      </div>

      {/* Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-sr-gold/20 to-sr-green/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        
        <div className="relative bg-sr-panel border border-sr-gold/20 rounded-2xl p-6 md:p-8 overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sr-gold/5 rounded-full blur-3xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Title */}
            <div>
               <h2 className="text-xl font-serif text-white mb-2">Bank Transfer</h2>
               <p className="text-gray-400 text-xs leading-relaxed">
                 Please use the following details to make your contribution directly to our official bank account.
               </p>
            </div>

            {/* Dynamic Details */}
            <div className="space-y-3">
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-sr-gold">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account Name</p>
                  <p className="text-base font-medium text-white tracking-wide">
                    {bankDetails.bank_account_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-sr-gold">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Account Number</p>
                  <p className="text-lg font-mono text-sr-gold tracking-widest">
                    {bankDetails.bank_account_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-black/40 border border-white/5 text-sr-gold">
                  <Building2 size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Bank Details</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white">{bankDetails.bank_name}</p>
                    <span className="text-gray-600">|</span>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                       <MapPin size={10} /> {bankDetails.bank_branch}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 mt-1">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">IFSC Code</p>
                  <p className="text-sm font-mono text-white font-bold bg-white/5 px-2 py-1 rounded">
                    {bankDetails.bank_ifsc}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;