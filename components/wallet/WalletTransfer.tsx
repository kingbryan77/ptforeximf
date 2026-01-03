import React, { useState } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import WalletLayout from './WalletLayout';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';

const WalletTransfer: React.FC = () => {
  const { transfer, balance, isLoadingTransactions } = useTransactions();
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<{type:'success'|'error', text:string}|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    const num = parseFloat(amount);
    if (!email) { setMsg({type:'error', text: 'Email required'}); return; }
    if (!num || num <= 0) { setMsg({type:'error', text: 'Invalid amount'}); return; }
    
    const res = await transfer(email, num);
    if (res.success) {
        setMsg({type:'success', text: res.message});
        setAmount('');
        setEmail('');
    } else {
        setMsg({type:'error', text: res.message});
    }
  };

  return (
    <WalletLayout>
        <div className="max-w-xl mx-auto bg-darkblue2 border border-borderGray rounded-lg p-6">
            <div className="flex items-center mb-6">
                <div className="p-2 bg-primary/20 rounded mr-3">
                    <ArrowsRightLeftIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-white text-lg font-medium">Internal Transfer</h3>
                    <p className="text-gray-500 text-xs">Send funds to another user instantly.</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                     <label className="block text-gray-400 text-xs mb-1">Available Balance</label>
                     <p className="text-white font-sans tabular-nums text-lg">Rp {balance.toLocaleString('id-ID')}</p>
                </div>

                <div>
                    <label className="block text-gray-400 text-xs mb-1">Recipient Email</label>
                    <input 
                        type="email" 
                        className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary"
                        placeholder="user@example.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-gray-400 text-xs mb-1">Amount (IDR)</label>
                    <input 
                        type="number" 
                        className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-white outline-none focus:border-primary font-sans tabular-nums"
                        placeholder="0"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                <button disabled={isLoadingTransactions} className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded font-medium">
                    {isLoadingTransactions ? 'Sending...' : 'Confirm Transfer'}
                </button>

                {msg && (
                    <div className={`p-3 rounded text-sm text-center ${msg.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {msg.text}
                    </div>
                )}
            </form>
        </div>
    </WalletLayout>
  );
};

export default WalletTransfer;