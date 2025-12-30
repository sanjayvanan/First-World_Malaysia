import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, LogOut, Search, Calendar, Mail, CheckCircle, Clock } from 'lucide-react';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    fetchAssignedUsers();
  }, [page, search]);

  const fetchAssignedUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/admin/my-users?page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch assigned users", err);
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

  return (
    <div className="min-h-screen bg-sr-blue font-sans text-gray-200">
      
      {/* --- ADMIN NAVBAR --- */}
      <nav className="bg-sr-panel border-b border-sr-gold/20 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-sr-gold rounded-full flex items-center justify-center text-sr-blue font-bold">
                <Shield size={18} />
              </div>
              <h1 className="text-xl font-bold text-white tracking-wider">
                ADMIN <span className="text-sr-gold">PORTAL</span>
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:block text-xs text-sr-gold uppercase tracking-widest">Assigned Access</div>
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

      {/* --- CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">My User List</h2>
                <p className="text-sm text-gray-400">Manage the clients specifically assigned to you.</p>
            </div>
            
            {/* Search Bar */}
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

        {/* Data Table Card */}
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
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading your clients...</td></tr>
                    ) : users.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No users assigned to you yet.</td></tr>
                    ) : (
                        users.map((user) => (
                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 rounded-full bg-sr-gold/10 border border-sr-gold/30 flex items-center justify-center text-sr-gold">
                                        <Users size={20} />
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
                                    user.kyc_status === 'PENDING' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' : 'bg-gray-800 text-gray-400 border-gray-600'
                                }`}>
                                    {user.kyc_status === 'APPROVED' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                                    {user.kyc_status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {user.referred_by_name ? (
                                    <span className="text-white bg-black/40 px-2 py-1 rounded border border-gray-700">
                                        {user.referred_by_name}
                                    </span>
                                ) : (
                                    <span className="opacity-50">-</span>
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

export default AdminPage;