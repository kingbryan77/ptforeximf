
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  DepositTransaction,
  WithdrawalTransaction,
  TransactionStatus,
  NotificationItem,
  CompanyBankInfo,
  Transaction,
  User,
} from '../types';
import * as transactionService from '../services/transactionService';
import * as authService from '../services/authService';
import { useAuth } from './AuthContext';

interface TransactionContextType {
  balance: number;
  accountMode: 'real' | 'demo';
  toggleAccountMode: () => void;
  depositHistory: DepositTransaction[];
  withdrawalHistory: WithdrawalTransaction[];
  notifications: NotificationItem[];
  companyBankInfoList: CompanyBankInfo[];
  isLoadingTransactions: boolean;
  transactionError: string | null;
  addNotification: (message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number, method: string, bankOrEwalletName: string, accountNumber: string, accountHolderName: string) => Promise<boolean>;
  transfer: (recipientEmail: string, amount: number) => Promise<{ success: boolean; message: string }>;
  updateDepositStatus: (depositId: string, status: TransactionStatus) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: TransactionStatus) => void;
  setCompanyBankInfoList: (info: CompanyBankInfo[]) => void;
  adminUpdateUserBalance: (userId: string, amount: number, type: 'set' | 'add') => void;
  adminCreateUser: (userData: Omit<User, 'id' | 'username' | 'notifications'> & { password: string }) => Promise<boolean>;
  getAllTransactions: () => Promise<Transaction[]>;
  getAllUsers: () => Promise<User[]>;
  updateUserVerification: (userId: string, isVerified: boolean) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [accountMode, setAccountMode] = useState<'real' | 'demo'>('real');
  const [depositHistory, setDepositHistory] = useState<DepositTransaction[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalTransaction[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [companyBankInfoList, setCompanyBankInfoListState] = useState<CompanyBankInfo[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (user) {
      setIsLoadingTransactions(true);
      setBalance(user.balance);
      const deposits = await transactionService.getDepositHistory(user.id);
      const withdrawals = await transactionService.getWithdrawalHistory(user.id);
      setDepositHistory(deposits);
      setWithdrawalHistory(withdrawals);
      setNotifications(user.notifications);
      setIsLoadingTransactions(false);
    } else {
      setBalance(0);
      setDepositHistory([]);
      setWithdrawalHistory([]);
      setNotifications([]);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const loadBankInfo = async () => {
      const info = await transactionService.getCompanyBankInfoList();
      setCompanyBankInfoListState(info);
    };
    loadBankInfo();
  }, []);

  const toggleAccountMode = () => {
    setAccountMode(prevMode => (prevMode === 'real' ? 'demo' : 'real'));
  };

  const displayedBalance = accountMode === 'real' ? balance : 0;

  const addNotification = async (message: string) => {
    if (user) {
      await authService.addUserNotification(user.id, message);
      refreshUser();
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    if (user) {
      await authService.updateUserNotification(user.id, notificationId, true);
      refreshUser();
    }
  };

  const deposit = async (amount: number): Promise<boolean> => {
    if (accountMode === 'demo') {
      setTransactionError('Deposits are disabled in Demo mode.');
      return false;
    }
    if (!user) {
      setTransactionError('You must be logged in to deposit.');
      return false;
    }
    setIsLoadingTransactions(true);
    setTransactionError(null);
    const success = await transactionService.deposit(user.id, amount);
    if (success) {
      refreshUser();
      fetchTransactions();
    } else {
      setTransactionError('Deposit failed.');
    }
    setIsLoadingTransactions(false);
    return success;
  };

  const withdraw = async (
    amount: number,
    method: string,
    bankOrEwalletName: string,
    accountNumber: string,
    accountHolderName: string,
  ): Promise<boolean> => {
    if (accountMode === 'demo') {
      setTransactionError('Withdrawals are disabled in Demo mode.');
      return false;
    }
    if (!user) {
      setTransactionError('You must be logged in to withdraw.');
      return false;
    }
    if (user.balance < amount) {
      setTransactionError('Insufficient balance.');
      return false;
    }

    setIsLoadingTransactions(true);
    setTransactionError(null);
    const success = await transactionService.withdraw(
      user.id,
      amount,
      method,
      bankOrEwalletName,
      accountNumber,
      accountHolderName,
    );
    if (success) {
      refreshUser();
      fetchTransactions();
    } else {
      setTransactionError('Withdrawal failed.');
    }
    setIsLoadingTransactions(false);
    return success;
  };

  const transfer = async (recipientEmail: string, amount: number): Promise<{ success: boolean; message: string }> => {
    if (accountMode === 'demo') {
        return { success: false, message: 'Transfer disabled in Demo mode.' };
    }
    if (!user) {
        return { success: false, message: 'Login required.' };
    }
    setIsLoadingTransactions(true);
    const result = await transactionService.transfer(user.id, recipientEmail, amount);
    if (result.success) {
        refreshUser();
        fetchTransactions();
    } else {
        setTransactionError(result.message);
    }
    setIsLoadingTransactions(false);
    return result;
  };
  
  const adminUpdateUserBalance = async (userId: string, amount: number, type: 'set' | 'add') => {
    const users = await authService.getAllUsers();
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
        const newBalance = type === 'set' ? amount : targetUser.balance + amount;
        await authService.updateUserBalance(userId, newBalance);
        if (user?.id === userId) {
            refreshUser();
        }
    }
  };

  const adminCreateUser = async (userData: Omit<User, 'id' | 'username' | 'notifications'> & { password: string }): Promise<boolean> => {
    setIsLoadingTransactions(true);
    const newUser = await authService.adminCreateUser(userData);
    setIsLoadingTransactions(false);
    return !!newUser;
  };

  const updateDepositStatus = async (depositId: string, status: TransactionStatus) => {
    setIsLoadingTransactions(true);
    const success = await transactionService.updateDepositStatus(depositId, status);
    if (success) {
      refreshUser();
      fetchTransactions();
    } else {
      setTransactionError('Failed to update deposit status.');
    }
    setIsLoadingTransactions(false);
  };

  const updateWithdrawalStatus = async (withdrawalId: string, status: TransactionStatus) => {
    setIsLoadingTransactions(true);
    const success = await transactionService.updateWithdrawalStatus(withdrawalId, status);
    if (success) {
      refreshUser();
      fetchTransactions();
    } else {
      setTransactionError('Failed to update withdrawal status.');
    }
    setIsLoadingTransactions(false);
  };

  const updateCompanyBankInfoList = async (infoList: CompanyBankInfo[]) => {
    await transactionService.setCompanyBankInfoList(infoList);
    setCompanyBankInfoListState(infoList);
    if(user?.isAdmin) addNotification('Company bank information updated.');
  };

  const getAllTransactions = useCallback(async () => transactionService.getAllTransactions(), []);
  const getAllUsers = useCallback(async () => authService.getAllUsers(), []);
  const updateUserVerification = async (userId: string, isVerified: boolean) => {
    await authService.updateUserInfo({ id: userId, isVerified });
    refreshUser();
  };

  const value = {
    balance: displayedBalance,
    accountMode,
    toggleAccountMode,
    depositHistory,
    withdrawalHistory,
    notifications,
    companyBankInfoList: companyBankInfoList,
    isLoadingTransactions,
    transactionError,
    addNotification,
    markNotificationAsRead,
    deposit,
    withdraw,
    transfer,
    updateDepositStatus,
    updateWithdrawalStatus,
    setCompanyBankInfoList: updateCompanyBankInfoList,
    getAllTransactions,
    getAllUsers,
    updateUserVerification,
    adminUpdateUserBalance,
    adminCreateUser,
  };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
