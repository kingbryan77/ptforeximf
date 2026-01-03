import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { BanknotesIcon, WalletIcon, BuildingLibraryIcon, IdentificationIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { E_WALLET_OPTIONS, BANK_OPTIONS } from '../../constants';
import { TransactionStatus } from '../../types';

const WithdrawalForm: React.FC = () => {
  const { user } = useAuth();
  const { balance, withdraw, isLoadingTransactions, transactionError, accountMode, withdrawalHistory } = useTransactions();
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'bank' | 'e-wallet'>('bank');
  const [bankOrEwalletName, setBankOrEwalletName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [withdrawalSuccessMessage, setWithdrawalSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (transactionError) {
      setErrors(prev => ({ ...prev, api: transactionError }));
    } else {
      setErrors(prev => ({ ...prev, api: undefined }));
    }
  }, [transactionError]);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const parsedAmount = parseFloat(amount);

    if (accountMode === 'demo') {
      newErrors.api = 'Withdrawals are disabled in Demo mode.';
    }

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    } else if (parsedAmount < 50000) { // Example minimum withdrawal
      newErrors.amount = 'Minimum withdrawal amount is Rp 50,000.';
    } else if (balance < parsedAmount) {
      newErrors.amount = 'Insufficient balance.';
    }

    if (!bankOrEwalletName) newErrors.bankOrEwalletName = `${method === 'bank' ? 'Bank' : 'E-Wallet'} name is required.`;
    if (!accountNumber) newErrors.accountNumber = 'Account number is required.';
    if (!accountHolderName) newErrors.accountHolderName = 'Account holder name is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) {
      return;
    }

    setWithdrawalSuccessMessage(null);
    const fullMethodName = method === 'bank' ? `Bank Transfer (${bankOrEwalletName})` : `E-Wallet (${bankOrEwalletName})`;

    const success = await withdraw(
      parseFloat(amount),
      fullMethodName,
      bankOrEwalletName,
      accountNumber,
      accountHolderName,
    );

    if (success) {
      setWithdrawalSuccessMessage(`Withdrawal of Rp ${parseFloat(amount).toLocaleString('id-ID')} submitted successfully and your balance has been adjusted. It is now pending admin approval.`);
      setAmount('');
      setBankOrEwalletName('');
      setAccountNumber('');
      setAccountHolderName('');
      setErrors({});
    } else {
      setErrors(prev => ({ ...prev, api: transactionError || 'Failed to submit withdrawal. Please try again.' }));
    }
  };

  const formatCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue, 10).toLocaleString('id-ID');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    setAmount(numericValue);
    setErrors(prev => ({ ...prev, amount: undefined, api: undefined }));
  };

  const getStatusClass = (status: TransactionStatus): string => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return 'bg-success/20 text-success';
      case TransactionStatus.PENDING:
        return 'bg-warning/20 text-warning';
      case TransactionStatus.REJECTED:
      case TransactionStatus.FAILED:
      case TransactionStatus.CANCELLED:
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Withdraw Funds</h2>

      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        {errors.api && (
          <div className="bg-danger/20 text-danger p-3 rounded-md mb-4 text-sm">
            {errors.api}
          </div>
        )}
        {withdrawalSuccessMessage && (
          <div className="bg-success/20 text-success p-3 rounded-md mb-4 text-sm">
            {withdrawalSuccessMessage}
          </div>
        )}

        <p className="text-gray-300 mb-4">
          Saldo Tersedia - {user?.fullName}: <span className="font-semibold text-white">Rp {balance.toLocaleString('id-ID')}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            id="withdrawalAmount"
            label="Amount (Rp)"
            type="text"
            placeholder="e.g., 50.000"
            icon={<BanknotesIcon />}
            value={formatCurrencyInput(amount)}
            onChange={handleAmountChange}
            error={errors.amount}
            inputMode="numeric"
            disabled={accountMode === 'demo'}
          />

          <div className="mb-4">
            <label htmlFor="withdrawalMethod" className="block text-gray-300 text-sm font-medium mb-1">
              Withdrawal Method
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="bank"
                  checked={method === 'bank'}
                  onChange={() => {
                    setMethod('bank');
                    setBankOrEwalletName('');
                    setErrors(prev => ({ ...prev, bankOrEwalletName: undefined }));
                  }}
                  className="form-radio text-primary bg-darkblue2 border-gray-700 focus:ring-primary"
                  disabled={accountMode === 'demo'}
                />
                <span className="ml-2 text-white">Bank Transfer</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="method"
                  value="e-wallet"
                  checked={method === 'e-wallet'}
                  onChange={() => {
                    setMethod('e-wallet');
                    setBankOrEwalletName('');
                    setErrors(prev => ({ ...prev, bankOrEwalletName: undefined }));
                  }}
                  className="form-radio text-primary bg-darkblue2 border-gray-700 focus:ring-primary"
                  disabled={accountMode === 'demo'}
                />
                <span className="ml-2 text-white">E-Wallet</span>
              </label>
            </div>
          </div>

          {method === 'bank' ? (
            <div className="mb-4">
              <label htmlFor="bankName" className="block text-gray-300 text-sm font-medium mb-1">
                Bank Name
              </label>
              <div className="relative">
                <BuildingLibraryIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="bankName"
                  className={`block w-full pl-10 pr-4 py-2 bg-darkblue2 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.bankOrEwalletName ? 'border-danger focus:ring-danger' : ''}`}
                  value={bankOrEwalletName}
                  onChange={(e) => {
                    setBankOrEwalletName(e.target.value);
                    setErrors(prev => ({ ...prev, bankOrEwalletName: undefined }));
                  }}
                  disabled={accountMode === 'demo'}
                >
                  <option value="">Select Bank</option>
                  {BANK_OPTIONS.map((bank) => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>
              {errors.bankOrEwalletName && <p className="mt-1 text-sm text-danger">{errors.bankOrEwalletName}</p>}
            </div>
          ) : (
            <div className="mb-4">
              <label htmlFor="eWalletName" className="block text-gray-300 text-sm font-medium mb-1">
                E-Wallet Provider
              </label>
              <div className="relative">
                <WalletIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="eWalletName"
                  className={`block w-full pl-10 pr-4 py-2 bg-darkblue2 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.bankOrEwalletName ? 'border-danger focus:ring-danger' : ''}`}
                  value={bankOrEwalletName}
                  onChange={(e) => {
                    setBankOrEwalletName(e.target.value);
                    setErrors(prev => ({ ...prev, bankOrEwalletName: undefined }));
                  }}
                  disabled={accountMode === 'demo'}
                >
                  <option value="">Select E-Wallet</option>
                  {E_WALLET_OPTIONS.map((ewallet) => (
                    <option key={ewallet} value={ewallet}>{ewallet}</option>
                  ))}
                </select>
              </div>
              {errors.bankOrEwalletName && <p className="mt-1 text-sm text-danger">{errors.bankOrEwalletName}</p>}
            </div>
          )}

          <Input
            id="accountNumber"
            label={`${method === 'bank' ? 'Bank Account Number' : 'E-Wallet Phone Number'}`}
            type="text"
            placeholder={`Enter your ${method === 'bank' ? 'bank account number' : 'e-wallet phone number'}`}
            icon={<CreditCardIcon />}
            value={accountNumber}
            onChange={(e) => { setAccountNumber(e.target.value); setErrors(prev => ({ ...prev, accountNumber: undefined })); }}
            error={errors.accountNumber}
            disabled={accountMode === 'demo'}
          />
          <Input
            id="accountHolderName"
            label="Account Holder Name"
            type="text"
            placeholder="Enter your account holder name"
            icon={<IdentificationIcon />}
            value={accountHolderName}
            onChange={(e) => { setAccountHolderName(e.target.value); setErrors(prev => ({ ...prev, accountHolderName: undefined })); }}
            error={errors.accountHolderName}
            disabled={accountMode === 'demo'}
          />

          <div className="mt-8">
            <Button type="submit" fullWidth isLoading={isLoadingTransactions} disabled={isLoadingTransactions || accountMode === 'demo'}>
              Submit Withdrawal Request
            </Button>
          </div>
        </form>

        {/* Recent Withdrawal History */}
        {withdrawalHistory.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Withdrawals</h3>
            <div className="space-y-4">
              {withdrawalHistory.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="bg-darkblue p-4 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Rp {transaction.amount.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-400">{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-400">View your full withdrawal history <Link to="/withdrawal-history" className="text-primary hover:underline">here</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalForm;