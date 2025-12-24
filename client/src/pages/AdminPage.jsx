import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, AlertCircle, Activity, Shield } from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 1. Get Big Stats
        const statsRes = await axios.get('http://localhost:5000/api/superuser/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(statsRes.data);

        // 2. Get User List
        const usersRes = await axios.get('http://localhost:5000/api/superuser/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);

      } catch (err) {
        console.error("Admin Access Failed", err);
        alert("Access Denied: You are not a Superuser or Wrong Domain");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Loading God Mode...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Shield className="text-red-600" size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">SUPERUSER CONTROL</h1>
            <p className="text-xs text-gray-500">First World Administration</p>
          </div>
        </div>
        <div className="text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
          RESTRICTED ACCESS
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* 1. Big Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-3xl font-bold">{stats?.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full"><Activity size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">Total Referrals</p>
                <p className="text-3xl font-bold">{stats?.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><AlertCircle size={24} /></div>
              <div>
                <p className="text-sm text-gray-500">Pending KYC</p>
                <p className="text-3xl font-bold">{stats?.pendingKYC}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. User Master List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Master User Database</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Latest 50 Members</span>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Referral Code</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">KYC Status</th>
                <th className="px-6 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">{user.full_name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 font-mono text-xs">{user.referral_code}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.role === 'SUPERUSER' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      user.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.kyc_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
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

export default AdminPage;