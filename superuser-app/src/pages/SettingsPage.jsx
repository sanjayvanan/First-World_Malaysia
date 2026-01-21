import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, Building2, CreditCard, Banknote, MapPin } from 'lucide-react';

// --- FIXED: Component defined OUTSIDE the main component ---
const InputGroup = ({ label, name, value, onChange, icon: Icon, placeholder }) => (
  <div className="group">
    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider group-focus-within:text-sr-gold transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-sr-gold transition-colors">
        <Icon size={18} />
      </div>
      <input
        name={name}
        value={value}         // Passed as prop
        onChange={onChange}   // Passed as prop
        placeholder={placeholder}
        className="w-full bg-sr-blue/50 border border-sr-gold/20 text-white rounded-xl py-3 pl-12 pr-4 
                   focus:border-sr-gold focus:ring-1 focus:ring-sr-gold outline-none transition-all duration-300 
                   placeholder-gray-600 hover:border-sr-gold/40 shadow-inner"
      />
    </div>
  </div>
);

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    bank_account_name: '',
    bank_account_number: '',
    bank_name: '',
    bank_ifsc: '',
    bank_branch: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      // Ensure we don't have undefined values
      setFormData(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/settings', formData);
      setMessage('Configuration updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide mb-2 flex items-center gap-3">
            <span className="p-2 bg-sr-gold/10 rounded-lg border border-sr-gold/20 text-sr-gold">
              <Building2 size={24} />
            </span>
            System Configuration
          </h1>
          <p className="text-gray-400 text-sm ml-1">Manage global settings and payment details</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-sr-panel border border-sr-gold/20 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] overflow-hidden relative">
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sr-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-sr-gold mb-6 pb-4 border-b border-sr-gold/10 flex items-center gap-2">
            Bank Transfer Details
          </h2>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg flex items-center gap-2 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <InputGroup 
                label="Account Holder Name" 
                name="bank_account_name" 
                value={formData.bank_account_name} 
                onChange={handleChange}
                icon={Building2} 
                placeholder="e.g. SR First World Foundation"
              />

              <InputGroup 
                label="Account Number" 
                name="bank_account_number" 
                value={formData.bank_account_number}
                onChange={handleChange}
                icon={CreditCard} 
                placeholder="e.g. 925010050119618"
              />

              <InputGroup 
                label="Bank Name" 
                name="bank_name" 
                value={formData.bank_name}
                onChange={handleChange}
                icon={Banknote} 
                placeholder="e.g. Axis Bank"
              />

              <InputGroup 
                label="IFSC Code" 
                name="bank_ifsc" 
                value={formData.bank_ifsc}
                onChange={handleChange}
                icon={MapPin} 
                placeholder="e.g. UTIB0000534"
              />

              <div className="md:col-span-2">
                <InputGroup 
                  label="Branch Location" 
                  name="bank_branch" 
                  value={formData.bank_branch}
                  onChange={handleChange}
                  icon={MapPin} 
                  placeholder="e.g. Kancheepuram Branch"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-sr-gold/10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-sr-gold to-sr-gold-light text-sr-blue font-bold rounded-xl 
                           hover:shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:scale-[1.02] active:scale-[0.98] 
                           transition-all duration-300 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {loading ? 'Saving Changes...' : 'Save Configuration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;