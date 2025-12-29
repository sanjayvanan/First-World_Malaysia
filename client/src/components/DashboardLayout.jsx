import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Import Menu Icon
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-sr-blue text-white font-sans flex overflow-hidden selection:bg-sr-gold selection:text-black">
      
      {/* SIDEBAR (Responsive) */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto relative bg-sr-blue scroll-smooth">
         <div className="absolute inset-0 bg-blue-gradient opacity-50 pointer-events-none fixed" />
        
        <div className="p-4 md:p-8 relative z-10 max-w-[1600px] mx-auto">
          
          {/* HEADER: Contains Hamburger (Mobile) + Title */}
          <header className="mb-6 md:mb-10 flex items-center justify-between border-b border-white/5 pb-4">
             
             {/* Left: Mobile Toggle + Title */}
             <div className="flex items-center gap-4">
               {/* Mobile Toggle Button */}
               <button 
                 onClick={() => setIsSidebarOpen(true)}
                 className="md:hidden p-2 text-sr-gold hover:bg-white/10 rounded-lg transition"
               >
                 <Menu size={28} />
               </button>

               <h2 className="text-xl md:text-3xl font-bold italic tracking-wide text-white drop-shadow-md">
                  SR FIRST WORLD <span className="hidden md:inline">DASHBOARD</span>
               </h2>
             </div>

          </header>

          {/* DYNAMIC CONTENT */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;