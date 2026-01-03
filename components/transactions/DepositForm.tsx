import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { BanknotesIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';

const DepositForm: React.FC = () => {
  const { user } = useAuth();
  const { deposit, companyBankInfoList, isLoadingTransactions, transactionError, addNotification } = useTransactions();
  const [amount, setAmount] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; api?: string }>({});
  const [depositSuccessMessage, setDepositSuccessMessage] = useState<string | null>(null);

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

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0.';
    } else if (parsedAmount < 10000) { // Example minimum deposit
      newErrors.amount = 'Minimum deposit amount is Rp 10,000.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !validate()) {
      return;
    }

    setDepositSuccessMessage(null);
    const success = await deposit(parseFloat(amount));

    if (success) {
      setDepositSuccessMessage(`Deposit of Rp ${parseFloat(amount).toLocaleString('id-ID')} submitted successfully. Please transfer funds to one of the company's bank accounts shown below. Your deposit will be approved by admin.`);
      setAmount('');
      setErrors({});
    } else {
      setErrors(prev => ({ ...prev, api: transactionError || 'Failed to submit deposit. Please try again.' }));
    }
  };

  const formatCurrencyInput = (value: string): string => {
    // Remove non-numeric characters first
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';

    // Format as Rupiah
    return parseInt(numericValue, 10).toLocaleString('id-ID');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Store only numeric value in state for calculation, display formatted value in input
    const numericValue = rawValue.replace(/\D/g, '');
    setAmount(numericValue);
    setErrors(prev => ({ ...prev, amount: undefined, api: undefined }));
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Deposit Funds</h2>

      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        {errors.api && (
          <div className="bg-danger/20 text-danger p-3 rounded-md mb-4 text-sm">
            {errors.api}
          </div>
        )}
        {depositSuccessMessage && (
          <div className="bg-success/20 text-success p-3 rounded-md mb-4 text-sm">
            {depositSuccessMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="depositAmount"
            label="Amount (Rp)"
            type="text" // Use text to allow custom formatting
            placeholder="e.g., 100.000"
            icon={<BanknotesIcon />}
            value={formatCurrencyInput(amount)}
            onChange={handleAmountChange}
            error={errors.amount}
            inputMode="numeric"
          />

          <h3 className="text-xl font-semibold text-white mt-8 mb-4">Company Bank Account Details</h3>
          <div className="space-y-4">
            {companyBankInfoList.map((info, index) => (
              <div key={index} className="bg-darkblue p-4 rounded-md border border-gray-700">
                <p className="text-gray-300 flex items-center mb-2">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-gray-400" />
                  <span className="font-medium text-white">{info.bankName}</span>
                </p>
                <p className="text-gray-300 flex items-center mb-2">
                  <span className="font-medium mr-2">Account No:</span> {info.accountNumber}
                </p>
                <p className="text-gray-300 flex items-center">
                  <span className="font-medium mr-2">Account Name:</span> {info.accountHolderName}
                </p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Please transfer the exact amount to one of the accounts above. Your deposit will be processed upon verification.
          </p>

          <div className="mt-8">
            <Button type="submit" fullWidth isLoading={isLoadingTransactions} disabled={isLoadingTransactions}>
              Submit Deposit Request
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">View your deposit history <a href="/#/deposit-history" className="text-primary hover:underline">here</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;