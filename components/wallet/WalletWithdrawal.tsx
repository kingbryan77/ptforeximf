import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { E_WALLET_OPTIONS, BANK_OPTIONS } from '../../constants';
import { TransactionStatus } from '../../types';
import Button from '../common/Button';
import WalletLayout from './WalletLayout';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

const WalletWithdrawal: React.FC = () => {
  const { user } = useAuth();
  const { balance, withdraw, isLoadingTransactions, withdrawalHistory, accountMode } = useTransactions();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'bank' | 'e-wallet'>('bank');
  const [bankOrEwalletName, setBankOrEwalletName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const isLowBalance = balance <= 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (accountMode === 'demo') {
         setMessage({ type: 'error', text: 'Demo mode active.' });
         return;
    }

    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
        setMessage({ type: 'error', text: 'Invalid amount.' });
        return;
    }

    const fullMethodName = method === 'bank' ? `Bank (${bankOrEwalletName})` : `E-Wallet (${bankOrEwalletName})`;
    const success = await withdraw(numAmount, fullMethodName, bankOrEwalletName, accountNumber, accountHolderName);

    if (success) {
      setMessage({ type: 'success', text: 'Withdrawal submitted.' });
      setAmount('');
      setAccountNumber('');
    } else {
      setMessage({ type: 'error', text: 'Withdrawal failed. Check balance.' });
    }
  };

  return (
    <WalletLayout>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left Column: Withdrawal Form */}
           <div className="lg:col-span-1">
               <div className="bg-darkblue2 border border-borderGray rounded-lg p-0 overflow-hidden">
                   <div className="p-4 border-b border-borderGray">
                       <h3 className="text-gray-300 text-lg">Withdrawal</h3>
                   </div>
                   
                   <form onSubmit={handleSubmit} className="p-4 space-y-4">
                       
                       {/* Available Balance Section */}
                       <div>
                           <label className="block text-gray-500 text-xs mb-1">Available Balance</label>
                           <div className="flex">
                               <div className="bg-[#1E2329] text-gray-400 text-sm px-3 py-2 border border-gray-700 rounded-l w-16 flex items-center justify-center">IDR</div>
                               <div className={`flex-1 ${isLowBalance ? 'bg-danger text-white' : 'bg-success text-white'} text-sm px-3 py-2 rounded-r font-bold font-sans tabular-nums flex items-center`}>
                                   {isLowBalance ? 'No Balance' : balance.toLocaleString('id-ID')}
                               </div>
                           </div>
                       </div>

                       {/* Currency (Fixed) */}
                       <div>
                           <label className="block text-gray-500 text-xs mb-1">Withdrawal Currency</label>
                           <div className="bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm">
                               IDR (Indonesia Rupiah)
                           </div>
                       </div>

                       {/* Withdrawal To */}
                       <div>
                           <label className="block text-gray-500 text-xs mb-1">Withdrawal To</label>
                           <select 
                                className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm outline-none focus:border-primary"
                                value={bankOrEwalletName}
                                onChange={(e) => setBankOrEwalletName(e.target.value)}
                           >
                               <option value="">Select Bank / E-Wallet</option>
                               <optgroup label="Banks">
                                   {BANK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                               </optgroup>
                               <optgroup label="E-Wallets">
                                    {E_WALLET_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                               </optgroup>
                           </select>
                           
                           {/* Extra inputs for account details */}
                           <input 
                                type="text"
                                placeholder="Account Number"
                                className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm outline-none focus:border-primary mt-2 font-sans tabular-nums"
                                value={accountNumber}
                                onChange={e => setAccountNumber(e.target.value)}
                           />
                           <input 
                                type="text"
                                placeholder="Account Holder Name"
                                className="w-full bg-[#1E2329] border border-gray-700 rounded px-3 py-2 text-gray-300 text-sm outline-none focus:border-primary mt-2"
                                value={accountHolderName}
                                onChange={e => setAccountHolderName(e.target.value)}
                           />
                       </div>

                       {/* Amount */}
                       <div>
                           <label className="block text-gray-500 text-xs mb-1">Amount Withdrawal</label>
                           <div className="flex">
                               <div className="bg-[#1E2329] text-gray-400 text-sm px-3 py-2 border border-gray-700 rounded-l w-16 flex items-center justify-center">IDR</div>
                               <input 
                                    type="text"
                                    placeholder="Amount Withdrawal"
                                    className="flex-1 bg-[#1E2329] border border-gray-700 border-l-0 rounded-r px-3 py-2 text-white text-sm outline-none focus:border-primary font-sans tabular-nums"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                               />
                           </div>
                       </div>

                       <div className="pt-2">
                           <button type="submit" disabled={isLoadingTransactions} className="bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded text-sm transition-colors">
                               {isLoadingTransactions ? 'Processing...' : 'Submit'}
                           </button>
                       </div>

                       {/* Notice Box */}
                       <div className="bg-[#00C0EF] p-4 rounded text-white text-xs mt-4">
                           <div className="flex items-start">
                               <InformationCircleIcon className="w-4 h-4 mr-1 mt-0.5" />
                               <div>
                                   <span className="font-bold block mb-1">Notice:</span>
                                   <p>Min Rp 10, Max Rp 500,000,000, Fee 0%.</p>
                               </div>
                           </div>
                       </div>
                       
                       {message && (
                           <div className={`p-2 rounded text-xs ${message.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                               {message.text}
                           </div>
                       )}

                   </form>
               </div>
           </div>

           {/* Right Column: History Table */}
           <div className="lg:col-span-2">
               <div className="bg-darkblue2 border border-borderGray rounded-lg p-0 h-full flex flex-col">
                    <div className="p-4 border-b border-borderGray">
                       <h3 className="text-gray-300 text-lg">Withdrawal History</h3>
                    </div>
                    
                    <div className="p-4">
                        <div className="flex space-x-2 mb-4">
                            <button className="bg-primary text-white text-xs px-3 py-1.5 rounded">DF</button>
                            <button className="bg-primary text-white text-xs px-3 py-1.5 rounded">Print</button>
                        </div>
                        
                        <div className="mb-4">
                            <input type="text" className="w-full bg-white text-black p-1 text-sm border rounded" />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-y border-gray-700 text-gray-500 text-xs">
                                        <th className="p-3 font-normal border-r border-gray-700">Fee</th>
                                        <th className="p-3 font-normal border-r border-gray-700">Received</th>
                                        <th className="p-3 font-normal border-r border-gray-700">Berita</th>
                                        <th className="p-3 font-normal">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {withdrawalHistory.map(wd => (
                                        <tr key={wd.id} className="border-b border-gray-700 text-xs">
                                            <td className="p-3 text-gray-400 border-r border-gray-700 font-sans tabular-nums">Rp 0</td>
                                            <td className="p-3 text-gray-300 border-r border-gray-700 font-sans tabular-nums">Rp {wd.amount.toLocaleString('id-ID')}</td>
                                            <td className="p-3 text-gray-400 border-r border-gray-700 max-w-xs">
                                                <div className="font-bold text-gray-300">Withdrawal IDR Balance</div>
                                                <div>To: {wd.method.includes('Bank') ? 'Bank Account' : 'E-Wallet'} (USD)</div>
                                                <div className="uppercase">{wd.bankOrEwalletName}</div>
                                                <div className="font-sans tabular-nums">{wd.accountNumber}</div>
                                                <div className="uppercase">{wd.accountHolderName}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-white ${wd.status === TransactionStatus.SUCCESS ? 'bg-success' : wd.status === TransactionStatus.PENDING ? 'bg-warning' : 'bg-danger'}`}>
                                                    {wd.status === TransactionStatus.SUCCESS ? 'Done' : wd.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {withdrawalHistory.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500 text-xs">No records found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center items-center mt-4 text-xs text-gray-400 space-x-2">
                             <span>Previous</span>
                             <span className="bg-warning text-black w-5 h-5 flex items-center justify-center rounded">1</span>
                             <span>Next</span>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </WalletLayout>
  );
};

export default WalletWithdrawal;