import React from 'react';
import { 
  TrophyIcon, 
  RocketLaunchIcon, 
  SparklesIcon, 
  ShieldCheckIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/solid';

interface InvestmentTier {
  investment: string;
  profit: string;
}

interface InvestmentPackage {
  name: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
  borderColor: string;
  shadowColor: string;
  tiers: InvestmentTier[];
}

const INVESTMENT_PACKAGES: InvestmentPackage[] = [
  {
    name: "PAKET GOLD",
    icon: <TrophyIcon className="w-12 h-12" />,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/30",
    shadowColor: "shadow-yellow-500/10",
    tiers: [
      { investment: "500.000", profit: "13.000.000" },
      { investment: "1.000.000", profit: "30.000.000" },
    ]
  },
  {
    name: "PAKET PLATINUM",
    icon: <RocketLaunchIcon className="w-12 h-12" />,
    color: "bg-gray-300",
    textColor: "text-gray-300",
    borderColor: "border-gray-300/30",
    shadowColor: "shadow-gray-300/10",
    tiers: [
      { investment: "1.500.000", profit: "50.000.000" },
      { investment: "2.500.000", profit: "80.000.000" },
      { investment: "3.500.000", profit: "110.000.000" },
    ]
  },
  {
    name: "PAKET DIAMOND",
    icon: <SparklesIcon className="w-12 h-12" />,
    color: "bg-cyan-400",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400/30",
    shadowColor: "shadow-cyan-400/10",
    tiers: [
      { investment: "4.500.000", profit: "140.000.000" },
      { investment: "5.500.000", profit: "170.000.000" },
      { investment: "6.500.000", profit: "200.000.000" },
    ]
  },
  {
    name: "PAKET VIP",
    icon: <ShieldCheckIcon className="w-12 h-12" />,
    color: "bg-purple-600",
    textColor: "text-purple-500",
    borderColor: "border-purple-500/30",
    shadowColor: "shadow-purple-500/10",
    tiers: [
      { investment: "8.000.000", profit: "235.000.000" },
      { investment: "9.000.000", profit: "275.000.000" },
      { investment: "10.000.000", profit: "295.000.000" },
    ]
  }
];

const InvestmentPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-8 animate-fade-in font-sans">
      
      {/* Header Section */}
      <div className="text-center space-y-3 py-6">
        <h2 className="text-4xl font-black text-white tracking-tight uppercase">
          PAKET <span className="text-primary">INVESTASI</span>
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium">
          Pilih paket yang sesuai dengan profil risiko Anda. Dapatkan imbal hasil maksimal dengan sistem perdagangan otomatis kami.
        </p>
      </div>

      {/* Grid Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INVESTMENT_PACKAGES.map((pkg, idx) => (
          <div 
            key={idx} 
            className={`bg-darkblue2 border ${pkg.borderColor} rounded-2xl overflow-hidden shadow-2xl ${pkg.shadowColor} transition-all duration-300 hover:scale-[1.02] hover:border-white/20 group flex flex-col`}
          >
            {/* Package Header */}
            <div className={`p-8 flex flex-col items-center space-y-4 bg-gradient-to-b from-white/[0.03] to-transparent`}>
                <div className={`${pkg.textColor} group-hover:scale-110 transition-transform duration-500`}>
                    {pkg.icon}
                </div>
                <h3 className={`text-xl font-black tracking-widest ${pkg.textColor} text-center`}>
                    {pkg.name}
                </h3>
            </div>

            {/* Tiers List */}
            <div className="px-6 py-4 flex-grow space-y-4">
                {pkg.tiers.map((tier, tIdx) => (
                  <div key={tIdx} className="bg-darkblue/50 border border-gray-800 rounded-xl p-4 space-y-2 group/item hover:bg-darkblue transition-colors">
                      <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Modal</span>
                          <span className="text-white font-sans font-bold text-sm">Rp {tier.investment}</span>
                      </div>
                      <div className="h-[1px] bg-gray-800 w-full"></div>
                      <div className="flex justify-between items-center">
                          <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">Hasil</span>
                          <span className={`${pkg.textColor} font-sans font-bold text-base`}>Rp {tier.profit}</span>
                      </div>
                  </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="p-6 mt-auto">
                <button className={`w-full ${pkg.color} text-darkblue font-black py-3 rounded-xl uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all hover:brightness-110 flex items-center justify-center`}>
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    Pilih Paket
                </button>
                <div className="mt-4 flex items-center justify-center space-x-2">
                    <CheckCircleIcon className="w-4 h-4 text-success" />
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Aktivasi Instan</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-darkblue2 border border-gray-800 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                  <ShieldCheckIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                  <h4 className="text-white font-bold text-lg italic">Keamanan Dana Terjamin</h4>
                  <p className="text-gray-500 text-sm max-w-md">
                      Sistem kami menggunakan enkripsi end-to-end dan pemisahan akun untuk memastikan modal Anda aman selama masa kontrak investasi.
                  </p>
              </div>
          </div>
          <button className="bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
              Hubungi Konsultan
          </button>
      </div>

      <div className="text-center pt-8 pb-4">
          <p className="text-gray-700 text-[9px] uppercase tracking-[0.4em] font-black">
              Official Investment Program &copy; 2025 FOREXimf
          </p>
      </div>

    </div>
  );
};

export default InvestmentPage;