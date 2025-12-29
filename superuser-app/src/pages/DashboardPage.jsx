import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, LogOut, UserCog, UserCheck } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]); // List for dropdown
  const [loading, setLoading] = useState(true);

  // Load Data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('superuser_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, adminsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/superuser/users', config),
        axios.get('http://localhost:5000/api/superuser/admins', config)
      ]);

      setUsers(usersRes.data);
      setAdmins(adminsRes.data);
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
  }, []);

  // Action: Change Role
  const handleRoleChange = async (userId, newRole) => {
    if(!window.confirm(`Promote this user to ${newRole}?`)) return;
    try {
      const token = localStorage.getItem('superuser_token');
      await axios.post('http://localhost:5000/api/superuser/role', 
        { userId, role: newRole }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh table
    } catch (err) {
      alert("Failed to update role");
    }
  };

  // Action: Assign Admin
  const handleAssignAdmin = async (userId, adminId) => {
    try {
      const token = localStorage.getItem('superuser_token');
      await axios.post('http://localhost:5000/api/superuser/assign', 
        { userId, adminId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData(); // Refresh table
    } catch (err) {
      alert("Failed to assign admin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superuser_token');
    localStorage.removeItem('superuser_user');
    navigate('/login');
  };

  if (loading) return <div className="p-10 text-center">Loading System...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* Navbar */}
      <nav className="bg-sr-blue text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <Shield className="text-sr-gold" size={28} />
          <div>
            <h1 className="text-lg font-bold tracking-widest uppercase">Superuser Control</h1>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-300 hover:text-white flex items-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="text-sr-blue" /> Master User List
            </h2>
            <span className="text-sm bg-white px-3 py-1 rounded shadow text-gray-500">
                Total Members: <b>{users.length}</b>
            </span>
        </div>

        {/* THE MASTER TABLE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition">
                  {/* Column 1: Info */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-[10px] text-gray-400 font-mono mt-1">ID: {user.id}</p>
                  </td>

                  {/* Column 2: Role Switcher */}
                  <td className="px-6 py-4">
                    <select 
                        className={`border rounded px-2 py-1 text-xs font-bold ${
                            user.role === 'SUPERUSER' ? 'text-purple-700 bg-purple-100 border-purple-200' :
                            user.role === 'ADMIN' ? 'text-blue-700 bg-blue-100 border-blue-200' :
                            'text-gray-600 bg-gray-100'
                        }`}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.role === 'SUPERUSER'} // Prevent locking yourself out
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPERUSER">SUPERUSER</option>
                    </select>
                  </td>

                  {/* Column 3: Assign Admin */}
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

                  {/* Column 4: Status */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        user.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                        KYC: {user.kyc_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;