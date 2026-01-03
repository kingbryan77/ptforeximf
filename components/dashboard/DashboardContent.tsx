import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { MOCK_NEWS } from '../../constants';
import { 
    HomeIcon, 
    UserGroupIcon, 
    GiftIcon, 
    ChartBarIcon, 
    WalletIcon, 
    NewspaperIcon, 
    InformationCircleIcon,
    ClipboardIcon
} from '@heroicons/react/24/solid';

const WaveSvg = ({ color }: { color: string }) => (
    <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full h-16 sm:h-20 opacity-10 pointer-events-none">
        <path fill={color} fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
);

const StatCard = ({ title, value, subtext, icon: Icon, colorClass, waveColor }: any) => (
    <div className="bg-darkblue2 rounded-xl relative overflow-hidden h-40 border border-gray-800 shadow-lg group transition-all duration-300 hover:border-primary/50">
        <div className="p-5 z-10 relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`w-8 h-8 ${colorClass}`} />
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                    </div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-semibold">{subtext}</p>
                </div>
                <div className="bg-darkblue p-1.5 rounded cursor-pointer hover:bg-primary/20 transition-colors border border-gray-800">
                    <span className="text-primary text-[10px] font-bold">Detail</span>
                </div>
            </div>
            <div>
               <h4 className={`text-2xl font-bold text-white font-sans tabular-nums`}>{value}</h4>
            </div>
        </div>
        <WaveSvg color={waveColor} />
    </div>
);

const DashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { balance, notifications } = useTransactions();
  const forexRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState('Salin Link Reff');

  const referralLink = user ? `http://FOREXimf.com/?reff=${user.username}` : 'Memuat...';

  const handleCopy = () => {
      navigator.clipboard.writeText(referralLink);
      setCopyStatus('Tersalin!');
      setTimeout(() => setCopyStatus('Salin Link Reff'), 2000);
  };

  useEffect(() => {
    if (forexRef.current) {
        if (forexRef.current.querySelector('script')) return;
        const widgetDiv = document.createElement('div');
        widgetDiv.className = 'tradingview-widget-container__widget';
        forexRef.current.appendChild(widgetDiv);
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
          "width": "100%",
          "height": "100%", 
          "currencies": ["EUR", "USD", "JPY", "GBP", "CHF", "AUD", "CAD", "NZD"],
          "isTransparent": false,
          "colorTheme": "dark",
          "locale": "id"
        });
        forexRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex flex-col space-y-6">
       
       {/* 1. HEADER RINGKASAN */}
       <div className="bg-darkblue2 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center border border-gray-800 shadow-md">
            <h1 className="text-2xl font-bold text-white mb-2 md:mb-0">
                Ringkasan <span className="text-gray-500 font-normal text-lg ml-2">Panel Kontrol</span>
            </h1>
            <div className="flex items-center text-xs text-gray-500 bg-darkblue px-3 py-1.5 rounded-full border border-gray-800">
                <HomeIcon className="w-3 h-3 mr-2 text-gray-400" />
                <span className="hover:text-primary cursor-pointer transition-colors">Beranda</span>
                <span className="mx-2">/</span>
                <span className="text-white font-semibold">Dashboard</span>
            </div>
       </div>

       {/* 2. IKHTISAR PASAR (PINDAH KE SINI) */}
       <div className="w-full bg-darkblue2 rounded-xl overflow-hidden border border-gray-800 shadow-lg">
             <div className="bg-darkblue p-4 border-b border-gray-800 flex items-center">
                 <ChartBarIcon className="w-5 h-5 text-gray-500 mr-2" />
                 <span className="text-gray-300 font-bold text-sm">Ikhtisar Pasar</span>
             </div>
             <div className="w-full h-[500px]" ref={forexRef}></div>
       </div>

       {/* 3. REFERRAL LINK BAR */}
       <div className="flex flex-col md:flex-row shadow-lg rounded-xl overflow-hidden border border-gray-800 bg-darkblue2">
            <div className="flex-grow p-4 text-gray-400 text-sm flex items-center bg-darkblue border-b md:border-b-0 md:border-r border-gray-800">
                <span className="truncate">{referralLink}</span>
            </div>
            <button 
                onClick={handleCopy}
                className="bg-headerBlue hover:bg-cyan-600 text-white font-bold px-8 py-4 text-sm transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
                <ClipboardIcon className="w-4 h-4" />
                <span>{copyStatus}</span>
            </button>
       </div>

       {/* 4. STAT CARDS (REFERRAL, BONUS, PROFIT, WALLET) */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Referral" subtext="total member" value="0 member" icon={UserGroupIcon} colorClass="text-headerBlue" waveColor="#00C0EF" />
            <StatCard title="Bonus" subtext="total bonus" value="Rp 0" icon={GiftIcon} colorClass="text-warning" waveColor="#F0B90B" />
            <StatCard title="Profit" subtext="total profit" value="Rp 0" icon={ChartBarIcon} colorClass="text-accent" waveColor="#3B82F6" />
            <StatCard title="IDR Wallet" subtext="Saldo Anda" value={`Rp ${balance.toLocaleString('id-ID')}`} icon={WalletIcon} colorClass="text-orange-500" waveColor="#F97316" />
       </div>

       {/* 5. NEWS & NOTIFICATIONS */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-darkblue2 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
               <div className="bg-darkblue p-4 border-b border-gray-800 flex items-center justify-between">
                   <h3 className="text-lg text-white font-bold">Berita Terbaru</h3>
                   <span className="text-primary text-xs cursor-pointer hover:underline font-semibold">Lihat Semua</span>
               </div>
               <div className="divide-y divide-gray-800">
                   {MOCK_NEWS.map((news) => (
                       <div key={news.id} className="p-5 flex items-start space-x-4 hover:bg-gray-800 transition-colors cursor-pointer group">
                           <div className={`p-2.5 rounded ${news.bgColor} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                               <NewspaperIcon className={`w-6 h-6 ${news.iconColor}`} />
                           </div>
                           <div>
                               <h4 className="text-gray-200 text-sm font-bold group-hover:text-primary transition-colors">{news.title}</h4>
                               <p className="text-gray-500 text-[10px] mt-1.5 flex items-center uppercase tracking-wide font-semibold">
                                   <ChartBarIcon className="w-3 h-3 mr-1" />
                                   {news.date}
                               </p>
                           </div>
                       </div>
                   ))}
               </div>
           </div>

           <div className="bg-darkblue2 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
               <div className="bg-darkblue p-4 border-b border-gray-800 flex items-center justify-between">
                   <h3 className="text-lg text-white font-bold">Notifikasi</h3>
                   <span className="text-primary text-xs cursor-pointer hover:underline font-semibold" onClick={() => {}}>Bersihkan</span>
               </div>
               <div className="divide-y divide-gray-800">
                   {notifications.slice(0, 5).map((notif) => (
                       <div key={notif.id} className="p-5 flex items-start space-x-4 hover:bg-gray-800 transition-colors cursor-pointer group">
                           <div className="p-2.5 rounded bg-blue-500/10 flex-shrink-0">
                               <InformationCircleIcon className="w-6 h-6 text-blue-500" />
                           </div>
                           <div className="flex-1">
                               <h4 className="text-gray-300 text-sm font-medium leading-relaxed">{notif.message}</h4>
                               <p className="text-gray-500 text-[10px] mt-1.5 uppercase tracking-wide font-semibold">{new Date(notif.date).toLocaleString()}</p>
                           </div>
                       </div>
                   ))}
                   {notifications.length === 0 && (
                       <div className="p-12 text-center flex flex-col items-center justify-center">
                           <InformationCircleIcon className="w-12 h-12 text-gray-700 mb-2" />
                           <p className="text-gray-500 text-sm">Tidak ada notifikasi baru.</p>
                       </div>
                   )}
               </div>
           </div>
       </div>

       <div className="text-center md:text-left pt-8 border-t border-gray-800">
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                Hak Cipta © 2025 <span className="text-gray-400 font-black">FOREXimf Pro</span>. Seluruh Hak Dilindungi.
            </p>
       </div>
    </div>
  );
};

export default DashboardContent;