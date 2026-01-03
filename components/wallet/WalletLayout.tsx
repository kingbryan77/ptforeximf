import React from 'react';
import { HomeIcon } from '@heroicons/react/24/solid';

interface WalletLayoutProps {
  children: React.ReactNode;
}

const WalletLayout: React.FC<WalletLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
         {/* IDR Wallet Header Box */}
         <div className="bg-darkblue2 border border-gray-800 p-4 rounded-t-xl shadow-lg">
             <h2 className="text-xl text-white font-bold">IDR Wallet</h2>
         </div>
         {/* Breadcrumb Box */}
         <div className="bg-darkblue border-x border-b border-gray-800 p-3 px-4 rounded-b-xl flex items-center text-xs text-gray-500 font-semibold">
             <HomeIcon className="w-3 h-3 mr-2 text-gray-600" /> 
             <span>Beranda</span> 
             <span className="mx-2 text-gray-700 font-light">/</span> 
             <span className="text-primary">Dompet IDR</span>
         </div>
      </div>
      
      {children}
    </div>
  );
};

export default WalletLayout;