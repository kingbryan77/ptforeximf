import React from 'react';
import {
  MenuItem,
} from './types';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  BellIcon,
  BanknotesIcon,
  UserCircleIcon,
  WalletIcon,
  ArrowsRightLeftIcon,
  DocumentPlusIcon,
  ArrowDownTrayIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

// --- Constants for UI ---

// Dashboard Sidebar Menu Items
export const DASHBOARD_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: React.createElement(ChartBarIcon, { className: "w-5 h-5" }), path: '/' },
  { id: 'wallet', 
    name: 'Wallet', 
    icon: React.createElement(WalletIcon, { className: "w-5 h-5" }), 
    path: '/wallet',
    children: [
        { id: 'balance', name: 'Balance', icon: React.createElement(BanknotesIcon, { className: "w-4 h-4" }), path: '/wallet/balance' },
        { id: 'add_balance', name: 'Add Balance', icon: React.createElement(DocumentPlusIcon, { className: "w-4 h-4" }), path: '/wallet/add-balance' },
        { id: 'transfer', name: 'Transfer', icon: React.createElement(ArrowsRightLeftIcon, { className: "w-4 h-4" }), path: '/wallet/transfer' },
        { id: 'withdrawal', name: 'Withdrawal', icon: React.createElement(ArrowDownTrayIcon, { className: "w-4 h-4" }), path: '/wallet/withdrawal' },
    ]
  },
  { id: 'trade', name: 'Trade', icon: React.createElement(CurrencyDollarIcon, { className: "w-5 h-5" }), path: '/trade' },
  { id: 'investment', name: 'Investment', icon: React.createElement(BanknotesIcon, { className: "w-5 h-5" }), path: '/investment' },
  { id: 'funds', name: 'Funds', icon: React.createElement(CreditCardIcon, { className: "w-5 h-5" }), path: '/funds' },
  { id: 'kyc', name: 'KYC', icon: React.createElement(UserCircleIcon, { className: "w-5 h-5" }), path: '/kyc' },
  { id: 'security', name: 'Security', icon: React.createElement(ShieldCheckIcon, { className: "w-5 h-5" }), path: '/security' },
  { id: 'setting', name: 'Setting', icon: React.createElement(Cog6ToothIcon, { className: "w-5 h-5" }), path: '/setting' },
  { id: 'faq', name: 'FAQ', icon: React.createElement(QuestionMarkCircleIcon, { className: "w-5 h-5" }), path: '/faq' },
  { id: 'admin', name: 'Admin Panel', icon: React.createElement(BellIcon, { className: "w-5 h-5" }), path: '/admin' },
];

// --- Mock Market Data for Chart (UI Only) ---
export const MOCK_MARKET_DATA = [
  { name: 'Jan', value: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', value: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', value: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', value: 2780, pv: 3908, amt: 2000 },
  { name: 'May', value: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', value: 2390, pv: 3800, amt: 2500 },
  { name: 'Jul', value: 3490, pv: 4300, amt: 2100 },
  { name: 'Aug', value: 4200, pv: 2400, amt: 2400 },
  { name: 'Sep', value: 3800, pv: 1398, amt: 2210 },
  { name: 'Oct', value: 2500, pv: 9800, amt: 2290 },
  { name: 'Nov', value: 3100, pv: 3908, amt: 2000 },
  { name: 'Dec', value: 3900, pv: 4800, amt: 2181 },
];

// --- Mock OHLC Data for Candlestick Chart (UI Only) ---
export const MOCK_OHLC_DATA = Array.from({ length: 30 }, (_, i) => {
  const basePrice = 17000 + Math.sin(i * 0.2) * 1000;
  const volatility = 200;
  const open = basePrice + (Math.random() - 0.5) * volatility;
  const close = basePrice + (Math.random() - 0.5) * volatility;
  const high = Math.max(open, close) + Math.random() * 100;
  const low = Math.min(open, close) - Math.random() * 100;
  
  return {
    time: `T${i}`,
    open,
    high,
    low,
    close,
  };
});

// Mock News Data
export const MOCK_NEWS = [
    {
        id: 1,
        title: "GIVE AWAY END OF THE YEAR",
        date: "04-Mar-2023, 18:24:56",
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-500/20"
    },
    {
        id: 2,
        title: "PUM Coin Go Turkiye",
        date: "27-Feb-2023, 07:57:23",
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-500/20"
    },
    {
        id: 3,
        title: "Technical Analysis at DailyFX",
        date: "10-Aug-2022, 14:37:34",
        iconColor: "text-yellow-500",
        bgColor: "bg-yellow-500/20"
    }
];

// E-Wallet Options
export const E_WALLET_OPTIONS = [
  'OVO',
  'GoPay',
  'DANA',
  'LinkAja',
  'ShopeePay',
];

// Bank Options
export const BANK_OPTIONS = [
  'Bank Central Asia (BCA)',
  'Bank Mandiri',
  'Bank Rakyat Indonesia (BRI)',
  'Bank Negara Indonesia (BNI)',
  'Bank Syariah Indonesia (BSI)',
  'CIMB Niaga',
  'PermataBank',
  'BTN',
  'OCBC NISP',
  'DBS Indonesia',
  'Maybank Indonesia',
];
