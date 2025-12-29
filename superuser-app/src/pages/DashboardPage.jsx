import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Users, LogOut, UserCog, ChevronLeft, ChevronRight,
  CheckCircle, Clock, Activity, Search 
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]); 
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({ totalUsers: 0, approvedKYC: 0, pendingKYC: 0 });

  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('superuser_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Pass search param to users endpoint
      const [usersRes, adminsRes, statsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/superuser/users?page=${page}&limit=20&search=${debouncedSearch}`, config),
        axios.get('http://localhost:5000/api/superuser/admins', config),
        axios.get('http://localhost:5000/api/superuser/stats', config)
      ]);

      if (usersRes.data.data) {
        setUsers(usersRes.data.data);
        setTotalPages(usersRes.data.pagination.totalPages);
        setTotalItems(usersRes.data.pagination.totalItems);
      } else {
        setUsers([]);
      }

      setAdmins(adminsRes.data);
      if(statsRes.data) setStats(statsRes.data);

    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch]); 

  const handleRoleChange = async (userId, newRole) => {
    if(!window.confirm(`Promote this user to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('superuser_token');
      await axios.post('http://localhost:5000/api/superuser/role', 
        { userId, role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); 
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleAssignAdmin = async (userId, adminId) => {
    try {
      const token = localStorage.getItem('superuser_token');
      await axios.post('http://localhost:5000/api/superuser/assign', 
        { userId, adminId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert("Failed to assign admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superuser_token');
    localStorage.removeItem('superuser_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      <nav className="bg-sr-blue text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <Shield className="text-sr-gold" size={28} />
          <h1 className="text-lg font-bold tracking-widest uppercase">Superuser Control</h1>
        </div>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white flex items-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-[1600px] mx-auto p-8">
        
        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><Users size={32} /></div>
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="p-4 bg-green-50 text-green-600 rounded-full"><CheckCircle size={32} /></div>
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">KYC Verified</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.approvedKYC}</h3>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4">
                <div className="p-4 bg-yellow-50 text-yellow-600 rounded-full"><Clock size={32} /></div>
                <div>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">KYC Pending</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.pendingKYC}</h3>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Activity className="text-sr-blue" /> Master User List
            </h2>
            <span className="text-sm bg-white px-3 py-1 rounded shadow text-gray-500">
                Found {totalItems} users
            </span>
        </div>

        {/* THE MASTER TABLE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          
          {/* SEARCH BAR */}
          <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
             <Search size={18} className="text-gray-400 mr-3" />
             <input 
                type="text" 
                placeholder="Search master database (Name, Email, ID)..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
                <div className="p-10 text-center text-gray-500 italic">Loading data...</div>
            ) : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 border-b uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Role Control</th>
                        <th className="px-6 py-4">Assigned Admin (Manager)</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {users.length > 0 ? users.map((user) => (
                        <tr key={user.id} className="hover:bg-blue-50/30 transition">
                        <td className="px-6 py-4">
                            <p className="font-bold text-gray-800">{user.full_name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {user.id}</p>
                        </td>
                        <td className="px-6 py-4">
                            <select 
                                className={`border rounded px-2 py-1 text-xs font-bold ${
                                    user.role === 'SUPERUSER' ? 'text-purple-700 bg-purple-100 border-purple-200' :
                                    user.role === 'ADMIN' ? 'text-blue-700 bg-blue-100 border-blue-200' :
                                    'text-gray-600 bg-gray-100'
                                }`}
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                disabled={user.role === 'SUPERUSER'} 
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="SUPERUSER">SUPERUSER</option>
                            </select>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                                <UserCog size={16} className="text-gray-400" />
                                <select 
                                    className="border border-gray-300 rounded px-2 py-1 text-xs w-48 focus:border-sr-gold outline-none"
                                    value={user.assigned_admin_id || ''}
                                    onChange={(e) => handleAssignAdmin(user.id, e.target.value)}
                                >
                                    <option value="">-- No Admin Assigned --</option>
                                    {admins.map(admin => (
                                        <option key={admin.id} value={admin.id}>
                                            {admin.full_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                user.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                user.kyc_status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-500'
                            }`}>
                                KYC: {user.kyc_status}
                            </span>
                        </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                No users found matching "{debouncedSearch}"
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
                <button 
                    className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-gray-600"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    className="p-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white text-gray-600"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    <ChevronRight size={16} />
                </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;