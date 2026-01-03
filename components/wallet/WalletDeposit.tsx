import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import WalletLayout from './WalletLayout';
import { InformationCircleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const WalletDeposit: React.FC = () => {
  const { deposit, companyBankInfoList, isLoadingTransactions } = useTransactions();
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<{type:'success'|'error', text:string}|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount.replace(/\D/g, ''));
    if (!num || num <= 0) {
        setMsg({type:'error', text: 'Invalid amount'});
        return;
    }
    const success = await deposit(num);
    if(success) {
        setMsg({type:'success', text: 'Deposit request created. Please transfer to bank below.'});
        setAmount('');
    } else {
        setMsg({type:'error', text: 'Deposit failed.'});
    }
  };

  return (
    <WalletLayout>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-darkblue2 border border-borderGray rounded-lg p-6">
                <h3 className="text-white text-lg mb-4">Add Balance</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-xs mb-1">Amount (IDR)</label>
                        <input 
                            type="text" 
                            className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary font-sans tabular-nums"
                            placeholder="e.g. 1,000,000"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                    <button disabled={isLoadingTransactions} className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded font-medium">
                        {isLoadingTransactions ? 'Processing...' : 'Submit Deposit'}
                    </button>
                    {msg && (
                        <div className={`p-2 rounded text-xs ${msg.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                            {msg.text}
                        </div>
                    )}
                </form>
            </div>

            <div className="bg-darkblue2 border border-borderGray rounded-lg p-6">
                <h3 className="text-white text-lg mb-4">Transfer Destination</h3>
                <div className="space-y-4">
                    {companyBankInfoList.map((info, idx) => (
                        <div key={idx} className="bg-[#1E2329] p-3 rounded border border-gray-700 flex justify-between items-center">
                            <div>
                                <p className="text-primary font-bold text-sm">{info.bankName}</p>
                                <p className="text-white text-lg tracking-wider font-sans tabular-nums my-1">{info.accountNumber}</p>
                                <p className="text-gray-500 text-xs uppercase">{info.accountHolderName}</p>
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="bg-warning/10 text-warning p-3 rounded text-xs mt-4 flex">
                    <InformationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p>Please transfer the exact amount. Your balance will be updated automatically after admin verification.</p>
                </div>
            </div>
        </div>
    </WalletLayout>
  );
};

export default WalletDeposit;