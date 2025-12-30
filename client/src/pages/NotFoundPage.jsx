import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-9xl font-bold text-blue-200">404</h1>
      
      <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
      
      <p className="text-gray-500 mt-2 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved. 
        Don't worry, you are still logged in.
      </p>

      <button 
        onClick={() => navigate('/dashboard')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-blue-600/30"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;