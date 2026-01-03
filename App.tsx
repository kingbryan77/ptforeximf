import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';

import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import DashboardContent from './components/dashboard/DashboardContent';
import AdminPanel from './components/admin/AdminPanel';
import TradePage from './components/pages/TradePage';
import InvestmentPage from './components/pages/InvestmentPage';
import KycPage from './components/pages/KycPage';
import SecurityPage from './components/pages/SecurityPage';
import SettingPage from './components/pages/SettingPage';
import FaqPage from './components/pages/FaqPage';

// Wallet Components
import WalletBalance from './components/wallet/WalletBalance';
import WalletDeposit from './components/wallet/WalletDeposit';
import WalletWithdrawal from './components/wallet/WalletWithdrawal';
import WalletTransfer from './components/wallet/WalletTransfer';


const AppRoutes: React.FC = () => {
  const { status } = useAuth();

  if (status === 'LOADING') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-indigo-950 text-white">
        <div className="text-xl font-semibold">Loading application...</div>
      </div>
    );
  }

  return (
    <Router>
      {status === 'UNAUTHENTICATED' ? (
        <AuthLayout>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthLayout>
      ) : (
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/trade" element={<TradePage />} />
            
            {/* Wallet Routes */}
            <Route path="/wallet" element={<Navigate to="/wallet/balance" replace />} />
            <Route path="/wallet/balance" element={<WalletBalance />} />
            <Route path="/wallet/add-balance" element={<WalletDeposit />} />
            <Route path="/wallet/transfer" element={<WalletTransfer />} />
            <Route path="/wallet/withdrawal" element={<WalletWithdrawal />} />
            
            <Route path="/investment" element={<InvestmentPage />} />
            <Route path="/kyc" element={<KycPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/setting" element={<SettingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            
            {/* Redirect old routes if necessary, or just catch all */}
            <Route path="/deposit" element={<Navigate to="/wallet/add-balance" />} />
            <Route path="/withdrawal" element={<Navigate to="/wallet/withdrawal" />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DashboardLayout>
      )}
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppRoutes />
      </TransactionProvider>
    </AuthProvider>
  );
};

export default App;