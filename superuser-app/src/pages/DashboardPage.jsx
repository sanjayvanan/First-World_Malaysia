import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, UserCheck, Activity, Search, LogOut, CheckCircle, Clock } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ totalUsers: 0, totalReferrals: 0, pendingKYC: 0, approvedKYC: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem('superuser_token');

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [page, searchTerm, token]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/superuser/stats', config),
        axios.get(`http://localhost:5000/api/superuser/users?page=${page}&limit=10&search=${searchTerm}`, config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.data);
      setTotalPages(usersRes.data.pagination.totalPages);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response && err.response.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdminVisibility = async (userId, currentStatus) => {
    setActionLoading(userId);
    try {
      const newStatus = !currentStatus;
      await axios.post('http://localhost:5000/api/superuser/assign', { userId, assign: newStatus }, config);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_shown_to_admin: newStatus } : u));
    } catch (err) {
      alert("Failed to update visibility");
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superuser_token');
    localStorage.removeItem('superuser_user');
    navigate('/login');
  };

  // --- Components ---
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-sr-panel border border-sr-gold/20 p-6 rounded-xl shadow-lg flex items-center justify-between relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-sr-gold/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
      <div>
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-black/30 border border-sr-gold/10 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sr-blue font-sans text-gray-200">
      
      {/* Navbar */}
      <nav className="bg-sr-panel border-b border-sr-gold/20 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sr-gold rounded-full flex items-center justify-center text-sr-blue font-bold">
                <Shield size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-wider">MAXSO <span className="text-sr-gold">ADMIN</span></span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:block text-xs text-sr-gold uppercase tracking-widest">Superuser Access</div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-200 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/20"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="text-blue-400" />
          <StatCard title="Referrals" value={stats.totalReferrals} icon={Activity} color="text-purple-400" />
          <StatCard title="Pending KYC" value={stats.pendingKYC} icon={Clock} color="text-orange-400" />
          <StatCard title="Verified" value={stats.approvedKYC} icon={CheckCircle} color="text-green-400" />
        </div>

        {/* User Management Panel */}
        <div className="bg-sr-panel border border-sr-gold/20 rounded-xl shadow-2xl overflow-hidden">
          
          <div className="p-6 border-b border-sr-gold/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/20">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <UserCheck size={20} className="text-sr-gold" /> 
                User Database
              </h2>
            </div>
            <div className="relative w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Search database..." 
                className="pl-10 pr-4 py-2 bg-black/40 border border-sr-gold/30 rounded-lg text-white focus:border-sr-gold focus:outline-none w-full md:w-80 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-black/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">User Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">System Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">KYC Status</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-sr-gold uppercase tracking-wider">Admin Visibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Connecting to database...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No records found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-sr-gold/10 border border-sr-gold/30 flex items-center justify-center text-sr-gold font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{user.full_name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      
                      {/* --- MODIFIED: STATIC ROLE BADGE (NO EDITING) --- */}
                      <td className="px-6 py-4 whitespace-nowrap">
                         <span className={`text-xs font-bold px-3 py-1 rounded border border-gray-600 ${
                             user.role === 'ADMIN' 
                               ? 'bg-purple-900/30 text-purple-300 border-purple-500/30' 
                               : 'bg-black/40 text-gray-300'
                         }`}>
                            {user.role}
                         </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border ${
                          user.kyc_status === 'APPROVED' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                          user.kyc_status === 'PENDING' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' : 'bg-gray-800 text-gray-400 border-gray-600'
                        }`}>
                          {user.kyc_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.role !== 'ADMIN' ? (
                          <button
                            onClick={() => handleToggleAdminVisibility(user.id, user.is_shown_to_admin)}
                            disabled={actionLoading === user.id}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              user.is_shown_to_admin ? 'bg-sr-gold' : 'bg-gray-700'
                            }`}
                          >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                user.is_shown_to_admin ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 uppercase">System Admin</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-black/20 px-4 py-3 flex items-center justify-between border-t border-sr-gold/10 sm:px-6">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1} 
                className="text-xs font-bold text-sr-gold hover:text-white disabled:opacity-30 uppercase tracking-wider"
            >
                Previous
            </button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages} 
                className="text-xs font-bold text-sr-gold hover:text-white disabled:opacity-30 uppercase tracking-wider"
            >
                Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;