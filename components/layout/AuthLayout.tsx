import React from 'react';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-[#0B0E11] overflow-hidden text-white p-4 font-sans">
      
      {/* 4K 3D Candlestick Background */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1642390237575-f93d18084a7a?q=80&w=3840&auto=format&fit=crop" 
            alt="3D Trading Chart 4K" 
            className="w-full h-full object-cover opacity-70"
            style={{
                animation: 'slowZoom 60s infinite alternate ease-in-out'
            }}
        />
         {/* Layered Overlays for Cinematic Look */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
        <div className="absolute inset-0 bg-[#0B0E11]/40 backdrop-blur-[2px]"></div>
        
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#2962FF 0.5px, transparent 0.5px), linear-gradient(90deg, #2962FF 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Login Card - Ultra Glassmorphism */}
      <div className="w-full max-w-md bg-[#151922]/70 backdrop-blur-3xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-8 sm:p-12 border border-white/10 relative z-10 transition-all">
        {/* Subtle top light effect */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        
        {children}
      </div>

      {/* Minimal Footer */}
      <div className="mt-12 text-gray-500 text-[10px] tracking-[0.3em] uppercase relative z-10 font-bold">
        Secure & Licensed Trading Portal
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;