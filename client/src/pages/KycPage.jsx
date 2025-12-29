import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Shield, FileText } from 'lucide-react';
import axios from 'axios';

const KycPage = () => {
  const [fileFront, setFileFront] = useState(null);
  const [fileBack, setFileBack] = useState(null);
  const [status, setStatus] = useState('PENDING'); // PENDING, SUBMITTED, VERIFIED, REJECTED
  const [loading, setLoading] = useState(false);

  // --- HANDLE SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileFront || !fileBack) return alert("Please upload both front and back of your ID.");

    setLoading(true);
    const formData = new FormData();
    formData.append('idFront', fileFront);
    formData.append('idBack', fileBack);

    try {
      const token = localStorage.getItem('token');
      // Restored the actual API Call
      await axios.post('http://localhost:5000/api/kyc/submit', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setStatus('SUBMITTED');
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reusable Component for File Input to keep code clean
  const FileUploadBox = ({ label, file, setFile }) => (
    <div className="space-y-2">
      <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">{label}</label>
      <div className={`
        border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 relative group cursor-pointer
        ${file ? 'border-sr-gold bg-sr-gold/10' : 'border-sr-gold/30 bg-black/20 hover:border-sr-gold'}
      `}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <FileText className="text-sr-gold mb-2" size={32} />
            <p className="text-white font-bold truncate w-full px-4">{file.name}</p>
            <p className="text-xs text-sr-gold mt-1">Ready to upload</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="text-gray-500 group-hover:text-sr-gold transition-colors mb-3" size={32} />
            <p className="text-gray-400 group-hover:text-white transition-colors">
              Click or Drag & Drop
            </p>
            <p className="text-xs text-gray-600 mt-2">JPG, PNG or PDF</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-sr-gold/10 rounded-full flex items-center justify-center mx-auto border border-sr-gold/30 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
          <Shield className="text-sr-gold" size={32} />
        </div>
        <h2 className="text-3xl font-serif text-white tracking-wide">Identity Verification</h2>
        <p className="text-gray-400">Complete your KYC to unlock full withdrawal limits.</p>
      </div>

      {/* Status Card */}
      <div className="bg-sr-panel border border-sr-gold/20 rounded-xl p-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          {status === 'VERIFIED' ? (
            <CheckCircle className="text-green-500" size={28} />
          ) : status === 'SUBMITTED' ? (
            <CheckCircle className="text-blue-400" size={28} />
          ) : (
            <AlertCircle className="text-sr-gold" size={28} />
          )}
          
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Current Status</p>
            <p className={`text-xl font-bold ${
              status === 'VERIFIED' ? 'text-green-400' : 
              status === 'SUBMITTED' ? 'text-blue-400' : 'text-sr-gold'
            }`}>
              {status === 'PENDING' && 'Pending Verification'}
              {status === 'SUBMITTED' && 'Under Review'}
              {status === 'VERIFIED' && 'Verified'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      {status === 'PENDING' && (
        <form onSubmit={handleSubmit} className="bg-sr-panel border border-sr-gold/20 rounded-xl p-8 space-y-8 shadow-xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadBox label="Government ID (Front)" file={fileFront} setFile={setFileFront} />
            <FileUploadBox label="Government ID (Back)" file={fileBack} setFile={setFileBack} />
          </div>

          <button 
            type="submit" 
            disabled={!fileFront || !fileBack || loading}
            className={`
              w-full py-4 rounded-lg font-bold text-sm tracking-widest uppercase transition-all duration-300
              ${(!fileFront || !fileBack || loading)
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                : 'bg-sr-gold text-black border border-sr-gold shadow-[0_0_20px_rgba(197,160,89,0.3)] hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]'
              }
            `}
          >
            {loading ? 'Uploading Documents...' : 'Submit Documents'}
          </button>
        </form>
      )}

      {status === 'SUBMITTED' && (
        <div className="text-center p-8 bg-sr-panel border border-sr-gold/20 rounded-xl animate-pulse">
            <p className="text-sr-gold font-serif text-lg">Your documents are being reviewed by our team.</p>
            <p className="text-gray-500 text-sm mt-2">This usually takes 24-48 hours.</p>
        </div>
      )}
    </div>
  );
};

export default KycPage;