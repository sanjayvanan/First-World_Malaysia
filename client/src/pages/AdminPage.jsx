import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Users, Search, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react'; // Added ArrowLeft

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchMyUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/my-users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(res.data)) {
            setUsers(res.data);
        } else {
            console.error("API Error: Expected list but got:", res.data);
            setUsers([]);
        }

      } catch (err) {
        console.error("Access Error", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-sr-blue flex items-center justify-center text-sr-gold animate-pulse">Loading Manager Portal...</div>;

  return (
    <div className="min-h-screen bg-sr-blue font-sans text-gray-100">
      
      {/* Top Navbar */}
      <nav className="bg-sr-panel border-b border-sr-gold/20 px-8 py-4 flex justify-between items-center shadow-lg">
        
        {/* Left Side: Title & User Info */}
        <div className="flex items-center space-x-4">
          <ShieldCheck className="text-sr-gold" size={28} />
          <div>
            <h1 className="text-lg font-bold tracking-widest uppercase text-white">Manager Dashboard</h1>
            <p className="text-[10px] text-gray-400">LOGGED IN AS: <span className="text-sr-gold">{adminUser.fullName}</span></p>
          </div>
        </div>

        {/* Right Side: Actions (Back + Logout) */}
        <div className="flex items-center space-x-6">
            
            {/* NEW: Back to Dashboard Button */}
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-400 hover:text-sr-gold transition-colors duration-300 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to App</span>
            </button>

            <div className="h-6 w-px bg-white/10"></div> {/* Divider */}

            <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-400 flex items-center gap-2 transition"
            >
                <LogOut size={18} /> 
                <span className="text-sm">Sign Out</span>
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold italic tracking-wide text-white drop-shadow-md">My Assigned Team</h2>
                <p className="text-gray-400 text-sm mt-1">Manage the users assigned specifically to you.</p>
            </div>
            <div className="bg-sr-panel border border-sr-gold/30 px-6 py-2 rounded-lg shadow-[0_0_15px_rgba(197,160,89,0.1)]">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Total Members</span>
                <span className="text-2xl font-bold text-sr-gold">{users?.length || 0}</span>
            </div>
        </div>

        {/* User Table */}
        <div className="bg-sr-panel border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            
            <div className="p-4 border-b border-white/5 flex items-center bg-black/20">
                <Search size={18} className="text-gray-500 mr-3" />
                <input 
                    type="text" 
                    placeholder="Search your users..." 
                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-600"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/30 text-gray-400 uppercase text-xs tracking-wider font-medium">
                        <tr>
                            <th className="px-6 py-4">Client Name</th>
                            <th className="px-6 py-4">Referral ID</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {!Array.isArray(users) || users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-10 text-center text-gray-500 italic">
                                    No users have been assigned to you yet.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition duration-200">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-white">{user.full_name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sr-gold text-xs">
                                        {user.referral_code}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                            user.kyc_status === 'APPROVED' 
                                                ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                                                : 'bg-yellow-900/20 border-yellow-500/30 text-yellow-400'
                                        }`}>
                                            {user.kyc_status || 'PENDING'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;