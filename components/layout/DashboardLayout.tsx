import React, { useState } from 'react';
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-darkblue text-gray-100 font-sans selection:bg-primary selection:text-white">
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 ease-in-out min-w-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* 
            Padding Top Calculation:
            - Brand Bar: 50px
            - Blue Header: 60px
            - Ticker Tape: 48px
            - TOTAL: 158px
        */}
        <main className="flex-1 px-4 sm:px-6 pt-[170px] pb-8 min-w-0">
          {!user?.isVerified && (
            <div className="bg-danger/10 text-danger p-4 rounded-xl shadow-sm mb-6 flex items-start border border-danger/20">
              <InformationCircleIcon className="h-6 w-6 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-base">Verifikasi Akun</h3>
                <p className="text-sm mt-1">
                  Silakan verifikasi akun Anda untuk mengakses semua fitur perdagangan.
                </p>
              </div>
            </div>
          )}
          
          <div className="animate-fade-in w-full h-full">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;