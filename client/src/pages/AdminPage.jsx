import React, { useEffect, useState } from 'react';
import api from '../api/axios'; 
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, LogOut, Search, Calendar, Mail, CheckCircle, Clock, FileText } from 'lucide-react';

const AdminPage = () => {
  // 1. UPDATED STATE to match new backend response
  const [stats, setStats] = useState({ totalAssigned: 0, submittedKYC: 0, approvedKYC: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 2. ADDED FILTER STATE
  const [kycFilter, setKycFilter] = useState('ALL'); 
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchData();
  }, [page, search, kycFilter]); // <--- Refetch when filter changes

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 3. CONSTRUCT QUERY with Filter
      let query = `?page=${page}&limit=10`;
      if (search) query += `&search=${search}`;
      if (kycFilter !== 'ALL') query += `&kycStatus=${kycFilter}`;

      const [statsRes, usersRes] = await Promise.all([
        api.get('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/api/admin/my-users${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.data);
      setTotalPages(usersRes.data.pagination.totalPages);

    } catch (err) {
      console.error("Failed to fetch admin data", err);
      if(err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // 4. UPDATED STAT CARD (Added onClick & Active State)
  const StatCard = ({ title, value, icon: Icon, colorClass, filterType }) => (
    <div 
      onClick={() => { setKycFilter(filterType); setPage(1); }}
      className={`bg-sr-panel border ${kycFilter === filterType ? 'border-sr-gold' : 'border-sr-gold/20'} p-6 rounded-xl shadow-lg flex items-center justify-between relative overflow-hidden group cursor-pointer transition-all hover:bg-white/5`}
    >
        <div className="absolute top-0 right-0 w-20 h-20 bg-sr-gold/5 rounded-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
        <div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{title}</h3>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-black/30 border border-sr-gold/10 ${colorClass}`}>
            <Icon size={24} />
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sr-blue font-sans text-gray-200">
      <nav className="bg-sr-panel border-b border-sr-gold/20 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sr-gold rounded-full flex items-center justify-center text-sr-blue font-bold">
                <Shield size={18} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wider">
                MANAGER <span className="text-sr-gold">PORTAL</span>
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-200 px-4 py-2 rounded-lg text-sm transition-all border border-red-500/20">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* 5. UPDATED CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
                title="All Clients" 
                value={stats.totalAssigned} 
                icon={Users} 
                colorClass="text-blue-400" 
                filterType="ALL"
            />
            {/* Shows 'SUBMITTED' Count, Filters for 'SUBMITTED' */}
            <StatCard 
                title="Needs Review" 
                value={stats.submittedKYC} 
                icon={FileText} 
                colorClass="text-orange-400" 
                filterType="SUBMITTED"
            />
            <StatCard 
                title="Verified" 
                value={stats.approvedKYC} 
                icon={CheckCircle} 
                colorClass="text-green-400" 
                filterType="APPROVED"
            />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-white">Client List</h2>
                {kycFilter !== 'ALL' && (
                    <span className="px-3 py-1 bg-sr-gold text-black text-xs font-bold rounded-full uppercase">
                        Showing: {kycFilter}
                    </span>
                )}
            </div>
            <div className="relative w-full md:w-auto">
                <input 
                    type="text" 
                    placeholder="Search name, email..." 
                    className="pl-10 pr-4 py-2 bg-black/40 border border-sr-gold/30 rounded-lg text-white focus:border-sr-gold focus:outline-none w-full md:w-80 transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
        </div>

        <div className="bg-sr-panel border border-sr-gold/20 rounded-xl shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700/50">
                <thead className="bg-black/30">
                    <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">User Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">Date Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">KYC Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-sr-gold uppercase tracking-wider">Referred By</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading...</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No {kycFilter === 'ALL' ? '' : kycFilter.toLowerCase()} clients found.</td></tr>
                    ) : (
                        users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-sr-gold/10 border border-sr-gold/30 flex items-center justify-center text-sr-gold font-bold">
                                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-white">{user.full_name}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Mail size={10} /> {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`flex items-center w-fit gap-1 px-2 py-1 text-[10px] uppercase tracking-wide font-bold rounded-full border ${
                                    user.kyc_status === 'APPROVED' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                                    user.kyc_status === 'SUBMITTED' ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' :
                                    user.kyc_status === 'PENDING' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' : 'bg-gray-800 text-gray-400 border-gray-600'
                                }`}>
                                    {user.kyc_status === 'APPROVED' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                                    {user.kyc_status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {user.referred_by_name || <span className="opacity-50">-</span>}
                            </td>
                        </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>
            
            <div className="bg-black/20 px-4 py-3 flex items-center justify-between border-t border-sr-gold/10 sm:px-6">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-xs font-bold text-sr-gold disabled:opacity-30">Previous</button>
                <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-xs font-bold text-sr-gold disabled:opacity-30">Next</button>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;