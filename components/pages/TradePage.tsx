import React, { useEffect, useRef, useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { ChevronDownIcon, ClockIcon } from '@heroicons/react/24/outline';

interface TradeHistoryItem {
  id: string;
  date: string;
  market: string;
  trx: string;
  package: string;
  amount: number;
  rateStake: number;
  rateEnd: number;
  status: 'Win' | 'Loss' | 'Pending';
}

// Mock data to show how it looks with rows
const MOCK_TRADE_HISTORY: TradeHistoryItem[] = [
  // Example row if needed, but keeping empty for now to match the "No records" feel if that's what's intended
  /*
  {
    id: '1',
    date: '18/12/2025 00:26',
    market: 'ETH/BTC',
    trx: 'BUY',
    package: 'Basic',
    amount: 50,
    rateStake: 0.03311,
    rateEnd: 0.03328,
    status: 'Win'
  }
  */
];

const TradePage: React.FC = () => {
  const { balance } = useTransactions();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stakeAmount, setStakeAmount] = useState('50');
  const [tradeTime, setTradeTime] = useState('3 Hour');

  useEffect(() => {
    if (containerRef.current) {
        if (containerRef.current.querySelector('script')) return;

        const widgetContainer = document.createElement('div');
        widgetContainer.className = 'tradingview-widget-container__widget';
        widgetContainer.style.height = '100%';
        widgetContainer.style.width = '100%';
        containerRef.current.appendChild(widgetContainer);

        const script = document.createElement('script');
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
          "autosize": true,
          "symbol": "BINANCE:ETHBTC",
          "interval": "1",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": false,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "container_id": "tradingview_chart",
          "show_popup_button": true,
          "popup_width": "1000",
          "popup_height": "650",
          "support_host": "https://www.tradingview.com"
        });
        containerRef.current.appendChild(script);
    }
    
    return () => {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
    };
  }, []);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#0B0E11] space-y-4 p-1 sm:p-2 lg:p-4">
      
      {/* 1. Trading Terminal Card */}
      <div className="bg-[#1C1C1C] rounded-lg overflow-hidden border border-[#2B2B2B] flex flex-col shadow-2xl">
          
          {/* Chart Header */}
          <div className="p-4 border-b border-[#2B2B2B] bg-[#1C1C1C] flex items-center justify-between">
              <div className="flex items-center space-x-2 cursor-pointer group">
                  <h2 className="text-white text-lg font-bold">ETH/BTC</h2>
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
          </div>

          {/* Chart Body */}
          <div className="relative h-[450px] sm:h-[550px] lg:h-[650px]">
              <div 
                id="tradingview_chart"
                className="tradingview-widget-container w-full h-full" 
                ref={containerRef}
              >
              </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="p-4 bg-[#1C1C1C] border-t border-[#2B2B2B] flex flex-wrap lg:flex-nowrap items-center gap-3">
               
               <div className="flex items-center bg-[#151922] border border-[#333] rounded overflow-hidden w-full sm:w-auto flex-grow lg:max-w-[200px]">
                   <div className="px-3 py-2.5 text-gray-400 text-sm font-medium border-r border-[#333]">IDR</div>
                   <input 
                        type="text" 
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-transparent w-full px-3 py-2.5 text-white text-sm outline-none font-sans tabular-nums"
                   />
               </div>

               <div className="flex items-center bg-[#151922] border border-[#333] rounded overflow-hidden w-full sm:w-auto flex-grow lg:max-w-[180px] cursor-pointer hover:border-gray-600 transition-colors">
                   <div className="px-3 py-2.5 text-gray-500 border-r border-[#333]">
                       <ClockIcon className="w-4 h-4" />
                   </div>
                   <div className="flex-grow flex items-center justify-between px-3 py-2.5">
                       <span className="text-gray-300 text-sm">{tradeTime}</span>
                       <ChevronDownIcon className="w-3 h-3 text-gray-500" />
                   </div>
               </div>

               <button className="flex-grow lg:flex-1 bg-[#00C098] hover:bg-[#00D8AB] text-white font-bold py-3 px-6 rounded flex items-center justify-center space-x-2 transition-all active:scale-95">
                   <div className="bg-white/20 p-1 rounded-full">
                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                   </div>
                   <span className="text-base tracking-wide">Buy 99%</span>
               </button>

               <button className="flex-grow lg:flex-1 bg-[#FF8A65] hover:bg-[#FF9D7E] text-white font-bold py-3 px-6 rounded flex items-center justify-center space-x-2 transition-all active:scale-95">
                   <div className="bg-white/20 p-1 rounded-full rotate-180">
                       <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                   </div>
                   <span className="text-base tracking-wide">Sell 99%</span>
               </button>
          </div>
      </div>

      {/* 2. History Card - EXACTLY LIKE SCREENSHOT */}
      <div className="bg-[#1C1C1C] rounded-lg border border-[#2B2B2B] overflow-hidden shadow-2xl mt-4">
          <div className="px-6 py-5 border-b border-[#2B2B2B]">
              <h2 className="text-2xl font-medium text-white/90">History</h2>
          </div>
          
          <div className="overflow-x-auto min-h-[250px]">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                      <tr className="border-b border-[#2B2B2B]">
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider">Date</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider">Market</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider">Trx</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider">Package</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider">Amount</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider text-center">Rate Stake</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider text-center">Rate End</th>
                          <th className="px-6 py-6 text-sm font-semibold text-gray-500 tracking-wider text-center">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {MOCK_TRADE_HISTORY.map((item) => (
                          <tr key={item.id} className="border-b border-[#2B2B2B]/50 hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 text-sm text-gray-400 font-sans tabular-nums">{item.date}</td>
                              <td className="px-6 py-4 text-sm text-white font-medium">{item.market}</td>
                              <td className="px-6 py-4">
                                  <span className={`text-xs font-bold ${item.trx === 'BUY' ? 'text-success' : 'text-danger'}`}>
                                      {item.trx}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-400">{item.package}</td>
                              <td className="px-6 py-4 text-sm text-white font-sans tabular-nums font-bold">
                                  {item.amount.toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-400 text-center font-sans tabular-nums">{item.rateStake.toFixed(5)}</td>
                              <td className="px-6 py-4 text-sm text-gray-400 text-center font-sans tabular-nums">{item.rateEnd.toFixed(5)}</td>
                              <td className="px-6 py-4 text-center">
                                  <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                      item.status === 'Win' ? 'bg-success/20 text-success' : 
                                      item.status === 'Loss' ? 'bg-danger/20 text-danger' : 'bg-warning/20 text-warning'
                                  }`}>
                                      {item.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {MOCK_TRADE_HISTORY.length === 0 && (
                          <tr>
                              <td colSpan={8} className="py-20 text-center text-gray-600 text-sm">
                                  No transaction records found.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      <div className="pt-8 pb-4 text-center">
          <p className="text-[#333] text-[9px] uppercase tracking-[0.4em] font-bold">
              Institutional Grade Execution Environment &copy; 2025
          </p>
      </div>

    </div>
  );
};

export default TradePage;