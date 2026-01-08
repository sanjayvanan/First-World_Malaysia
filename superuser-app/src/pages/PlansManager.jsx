import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, Edit2, X, ArrowLeft, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlansManager = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get('/api/plans');
      setPlans(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditClick = (plan) => {
    const benefits = Array.isArray(plan.benefits) ? plan.benefits : JSON.parse(plan.benefits || '[]');
    setEditingPlan({ ...plan, benefits });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingPlan) return;
    try {
      const token = localStorage.getItem('superuser_token');
      await api.put(`/api/plans/${editingPlan.id}`, editingPlan, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      setEditingPlan(null);
      fetchPlans();
      alert('Plan updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update plan');
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...editingPlan.benefits];
    newBenefits[index] = value;
    setEditingPlan({ ...editingPlan, benefits: newBenefits });
  };

  const addBenefit = () => {
    setEditingPlan({ ...editingPlan, benefits: [...editingPlan.benefits, "New Benefit"] });
  };

  const removeBenefit = (index) => {
    const newBenefits = editingPlan.benefits.filter((_, i) => i !== index);
    setEditingPlan({ ...editingPlan, benefits: newBenefits });
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="text-gray-200">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 border-b border-sr-gold/30 pb-4">
        <button onClick={() => navigate('/')} className="p-2 bg-black/40 rounded-full hover:bg-black/60 text-sr-gold transition-colors">
            <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold text-white">Manage Membership Plans</h1>
      </div>
      
      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-sr-panel border border-sr-gold/20 rounded-xl p-6 shadow-xl relative flex flex-col group h-[500px]">
            
            {/* --- FIX: MOVED WATERMARK --- */}
            {/* Changed right-4 to right-16 to clear the Edit button */}
            <div className="absolute top-5 right-16 text-sr-gold/10 text-5xl font-bold pointer-events-none group-hover:text-sr-gold/20 transition-colors z-0">
              {plan.element.charAt(0)}
            </div>
            {/* ---------------------------- */}

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">{plan.name}</h2>
                <p className="text-sr-gold text-lg font-serif">{plan.price}</p>
              </div>
              <button onClick={() => handleEditClick(plan)} className="p-2 bg-sr-gold/10 text-sr-gold rounded-lg hover:bg-sr-gold hover:text-black transition-all shadow-lg">
                <Edit2 size={18} />
              </button>
            </div>

            <p className="text-gray-400 text-xs mb-3 italic border-l-2 border-sr-gold/50 pl-3 relative z-10">"{plan.tagline}"</p>
            <p className="text-gray-300 text-sm mb-6 line-clamp-3 h-16 relative z-10">{plan.description}</p>
            
            <div className="mt-auto flex-1 overflow-hidden flex flex-col relative z-10">
              <h4 className="text-xs uppercase text-gray-500 mb-2 font-bold tracking-wider">Included Benefits</h4>
              <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 bg-black/20 rounded p-2 border border-white/5">
                <ul className="space-y-2">
                  {Array.isArray(plan.benefits) && plan.benefits.map((b, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="text-sr-gold">•</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-sr-panel border border-sr-gold rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-sr-gold/20 flex justify-between items-center bg-black/40">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Edit2 size={20} className="text-sr-gold" />
                Editing <span className="text-sr-gold">{editingPlan.name}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-sr-gold uppercase font-bold mb-1 block">Plan Name</label>
                  <input className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white focus:border-sr-gold outline-none"
                    value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs text-sr-gold uppercase font-bold mb-1 block">Price</label>
                  <input className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white focus:border-sr-gold outline-none"
                    value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-xs text-sr-gold uppercase font-bold mb-1 block">Tagline</label>
                <input className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white focus:border-sr-gold outline-none"
                  value={editingPlan.tagline} onChange={e => setEditingPlan({...editingPlan, tagline: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-sr-gold uppercase font-bold mb-1 block">Description</label>
                <textarea className="w-full bg-black/40 border border-gray-600 rounded p-2 text-white h-24 focus:border-sr-gold outline-none resize-none"
                  value={editingPlan.description} onChange={e => setEditingPlan({...editingPlan, description: e.target.value})} />
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs text-sr-gold uppercase font-bold">Benefits List</label>
                  <button onClick={addBenefit} className="text-xs bg-sr-gold/20 text-sr-gold px-2 py-1 rounded hover:bg-sr-gold hover:text-black transition flex items-center gap-1">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                <div className="space-y-2 bg-black/20 p-4 rounded border border-gray-700/50">
                  {editingPlan.benefits.map((b, idx) => (
                    <div key={idx} className="flex gap-2 group">
                      <span className="text-gray-600 text-xs pt-2">{idx + 1}.</span>
                      <input className="flex-1 bg-transparent border-b border-gray-700 text-sm text-white py-1 focus:border-sr-gold outline-none transition-colors"
                        value={b} onChange={e => handleBenefitChange(idx, e.target.value)} />
                      <button onClick={() => removeBenefit(idx)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-sr-gold/20 bg-black/40 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-lg text-sm bg-sr-gold text-black font-bold hover:bg-yellow-500 transition shadow-lg flex items-center gap-2">
                <Check size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansManager;