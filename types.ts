import React from 'react';

export enum AuthStatus {
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  AUTHENTICATED = 'AUTHENTICATED',
  LOADING = 'LOADING',
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  isVerified: boolean;
  balance: number;
  notifications: NotificationItem[];
  profilePictureUrl?: string;
}

export interface UserProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER', // Added Transfer
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface DepositTransaction {
  id: string;
  userId: string;
  type: TransactionType.DEPOSIT;
  amount: number;
  method: string;
  status: TransactionStatus;
  date: string;
  proofImageUrl?: string;
  companyBankInfoList?: CompanyBankInfo[];
}

export interface WithdrawalTransaction {
  id: string;
  userId: string;
  type: TransactionType.WITHDRAWAL;
  amount: number;
  method: string;
  bankOrEwalletName: string;
  accountNumber: string;
  accountHolderName: string;
  status: TransactionStatus;
  date: string;
}

export interface TransferTransaction {
    id: string;
    userId: string;
    type: TransactionType.TRANSFER;
    amount: number;
    recipientEmail: string;
    status: TransactionStatus;
    date: string;
    method: 'Internal Transfer';
}

export type Transaction = DepositTransaction | WithdrawalTransaction | TransferTransaction;

export interface CompanyBankInfo {
  id?: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
  children?: MenuItem[]; // Added for submenu support
}