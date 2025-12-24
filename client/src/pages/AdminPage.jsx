import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, AlertCircle, Activity, Shield, X, Eye } from 'lucide-react';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the "Review Modal"
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const statsRes = await axios.get('http://localhost:5000/api/superuser/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersRes = await axios.get('http://localhost:5000/api/superuser/users', {
          headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Function to handle Approval/Rejection
  const handleReview = async (status) => {
    if (!selectedUser) return;
    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/kyc/review', {
            userId: selectedUser.id,
            status: status // 'APPROVED' or 'REJECTED'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        alert(`User ${status}`);
        setSelectedUser(null); // Close modal
        fetchAllData(); // Refresh list
    } catch (err) {
        alert("Action failed");
    }
  };

  // Helper to fix Windows paths for the browser (uploads\file -> uploads/file)
  const getImageUrl = (path) => {
      if (!path) return '';
      // Replace backslashes with forward slashes and prepend server URL
      const cleanPath = path.replace(/\\/g, '/');
      return `http://localhost:5000/${cleanPath}`;
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading God Mode...</div>;

return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 relative">
      
      {/* 1. Navbar */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <div className="flex items-center space-x-3">
          <Shield className="text-red-600" size={32} />
          <div>
            <h1 className="text-xl font-black tracking-tight text-gray-900">SUPERUSER CONTROL</h1>
            <p className="text-xs text-gray-500">First World Administration</p>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* 2. Stats Grid (Now with 4 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalUsers || 0}</p>
            </div>
          </div>

          {/* Card 2: Total Referrals */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Activity size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Referrals</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalReferrals || 0}</p>
            </div>
          </div>

          {/* Card 3: Pending KYC (Action Needed) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-orange-500 flex items-center space-x-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Action Required</p>
              <p className="text-3xl font-bold text-orange-600">{stats?.pendingKYC || 0}</p>
              <p className="text-xs text-orange-400">Pending KYC</p>
            </div>
          </div>

          {/* Card 4: Verified Users (NEW) */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-l-4 border-l-green-500 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><Shield size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Verified Citizens</p>
              <p className="text-3xl font-bold text-green-600">{stats?.approvedKYC || 0}</p>
              <p className="text-xs text-green-400">Approved IDs</p>
            </div>
          </div>

        </div>

        {/* 3. User List with Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h3 className="font-bold text-gray-700">Recent Registrations</h3>
             <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded">Live Data</span>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">KYC Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/50 transition duration-150">
                  <td className="px-6 py-4 font-bold text-gray-800">{user.full_name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        user.role === 'SUPERUSER' 
                        ? 'bg-purple-100 text-purple-700 border-purple-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.kyc_status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                      user.kyc_status === 'SUBMITTED' ? 'bg-orange-100 text-orange-800 animate-pulse' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.kyc_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.kyc_status === 'SUBMITTED' && (
                        <button 
                            onClick={() => setSelectedUser(user)}
                            className="inline-flex items-center space-x-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition shadow-sm text-xs font-bold"
                        >
                            <Eye size={14} /> <span>Review</span>
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. The "Review" Modal (Same as before, ensure it closes correctly) */}
      {selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all scale-100">
                  <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Review Identity</h2>
                        <p className="text-sm text-gray-500">{selectedUser.full_name} ({selectedUser.email})</p>
                      </div>
                      <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50">
                      {/* Front ID */}
                      <div>
                          <p className="font-bold mb-2 text-gray-700">ID Front Side</p>
                          <div className="bg-white rounded-lg p-2 border shadow-sm h-64 flex items-center justify-center overflow-hidden">
                            {selectedUser.details?.kyc_docs?.front ? (
                                <img 
                                    src={getImageUrl(selectedUser.details.kyc_docs.front)} 
                                    alt="ID Front" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : <p className="text-red-500 font-bold">No Image Uploaded</p>}
                          </div>
                      </div>

                      {/* Back ID */}
                      <div>
                          <p className="font-bold mb-2 text-gray-700">ID Back Side</p>
                          <div className="bg-white rounded-lg p-2 border shadow-sm h-64 flex items-center justify-center overflow-hidden">
                            {selectedUser.details?.kyc_docs?.back ? (
                                <img 
                                    src={getImageUrl(selectedUser.details.kyc_docs.back)} 
                                    alt="ID Back" 
                                    className="max-w-full max-h-full object-contain"
                                />
                            ) : <p className="text-red-500 font-bold">No Image Uploaded</p>}
                          </div>
                      </div>
                  </div>

                  <div className="p-6 border-t bg-white flex justify-end space-x-4 sticky bottom-0">
                      <button 
                        onClick={() => handleReview('REJECTED')}
                        className="px-6 py-2 border border-red-200 text-red-700 font-bold rounded hover:bg-red-50 transition"
                      >
                        Reject Application
                      </button>
                      <button 
                        onClick={() => handleReview('APPROVED')}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded shadow-lg hover:shadow-green-500/30 hover:scale-105 transition transform"
                      >
                        Approve & Verify
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AdminPage;