import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

const KycPage = () => {
  const [fileFront, setFileFront] = useState(null);
  const [fileBack, setFileBack] = useState(null);
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileFront || !fileBack) return alert("Please select both files");

    setStatus('loading');
    const formData = new FormData();
    formData.append('idFront', fileFront);
    formData.append('idBack', fileBack);

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/kyc/submit', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-6">Identity Verification</h2>
        
        {status === 'success' ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded shadow-lg flex items-center">
            <CheckCircle className="mr-4" size={40} />
            <div>
              <p className="font-bold">Documents Submitted!</p>
              <p>Your ID is being reviewed. This usually takes 24 hours.</p>
            </div>
          </div>
        ) : (
          <div className="bg-maxso-card border border-white/10 p-8 rounded-xl shadow-2xl">
            <p className="text-gray-400 mb-8">
              To withdraw funds and refer more than 10 people, we need to verify your identity.
              Please upload a clear photo of your Government ID.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Front ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Card (Front)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:border-maxso-glow transition bg-black/20">
                  <Upload className="text-gray-500 mb-2" />
                  <input 
                    type="file" 
                    onChange={(e) => setFileFront(e.target.files[0])}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maxso-glow file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Back ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">ID Card (Back)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center hover:border-maxso-glow transition bg-black/20">
                  <Upload className="text-gray-500 mb-2" />
                  <input 
                    type="file" 
                    onChange={(e) => setFileBack(e.target.files[0])}
                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-maxso-glow file:text-white hover:file:bg-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-maxso-glow to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                {status === 'loading' ? 'Uploading...' : 'Submit Documents'}
              </button>
            </form>
          </div>
        )}
      </div>
  );
};

export default KycPage;