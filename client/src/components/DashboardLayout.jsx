import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react'; 
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-sr-blue text-white font-sansBW flex overflow-hidden selection:bg-sr-gold selection:text-black relative">
      
      {/* FIX: Background Gradient moved here with 'fixed'. 
        It now acts as a global wallpaper that covers the entire viewport 
        and stays put while you scroll.
      */}
      <div className="fixed inset-0 bg-blue-gradient opacity-50 pointer-events-none z-0" />

      {/* SIDEBAR (Responsive) */}
      {/* Added z-20 to ensure sidebar sits above the background */}
      <div className="relative z-20 h-full flex-shrink-0">
        <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 bg-transparent scroll-smooth">
        
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
          
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