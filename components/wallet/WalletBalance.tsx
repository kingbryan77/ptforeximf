import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import WalletLayout from './WalletLayout';
import { BanknotesIcon } from '@heroicons/react/24/outline';

const WalletBalance: React.FC = () => {
  const { balance } = useTransactions();

  return (
    <WalletLayout>
        <div className="bg-darkblue2 border border-gray-800 rounded-xl p-12 text-center shadow-lg font-sans">
            <div className="inline-block p-5 bg-primary/10 rounded-full mb-6 border border-primary/20">
                <BanknotesIcon className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-gray-500 text-lg mb-2 font-medium">Total Saldo Tersedia</h3>
            <h1 className="text-5xl text-white font-bold font-sans mb-8">Rp {balance.toLocaleString('id-ID')}</h1>
            <div className="max-w-md mx-auto p-4 bg-darkblue rounded-lg border border-gray-800">
                <p className="text-gray-400 text-sm leading-relaxed">
                    Saldo ini dapat digunakan untuk perdagangan, investasi, atau ditarik ke rekening bank terdaftar Anda secara instan.
                </p>
            </div>
        </div>
    </WalletLayout>
  );
};

export default WalletBalance;