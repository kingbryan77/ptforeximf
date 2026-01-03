import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { DepositTransaction, TransactionStatus } from '../../types';

const DepositHistory: React.FC = () => {
  const { user } = useAuth();
  const { depositHistory, isLoadingTransactions } = useTransactions();

  const getStatusClass = (status: TransactionStatus): string => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return 'bg-success/20 text-success';
      case TransactionStatus.PENDING:
        return 'bg-warning/20 text-warning';
      case TransactionStatus.REJECTED:
      case TransactionStatus.FAILED:
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto text-center text-gray-400">
        Please log in to view your deposit history.
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Deposit History</h2>

      <div className="bg-darkblue2 p-6 rounded-lg shadow-md overflow-x-auto">
        {isLoadingTransactions ? (
          <p className="text-center text-gray-400">Loading deposit history...</p>
        ) : depositHistory.length === 0 ? (
          <p className="text-center text-gray-400">No deposit transactions found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-darkblue">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {depositHistory.map((transaction: DepositTransaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-medium font-sans tabular-nums">
                    Rp {transaction.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                    {transaction.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-sans tabular-nums">
                    {transaction.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;