import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { Transaction, TransactionStatus, User, CompanyBankInfo } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
    BanknotesIcon, 
    CreditCardIcon, 
    BuildingLibraryIcon, 
    PlusIcon, 
    TrashIcon, 
    XMarkIcon, 
    CurrencyDollarIcon, 
    MagnifyingGlassIcon,
    UserPlusIcon,
    EnvelopeIcon,
    PhoneIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';


const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const {
    getAllUsers,
    updateUserVerification,
    getAllTransactions,
    updateDepositStatus,
    updateWithdrawalStatus,
    companyBankInfoList,
    setCompanyBankInfoList,
    adminUpdateUserBalance,
    adminCreateUser
  } = useTransactions();

  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'settings'>('users');
  const [bankList, setBankList] = useState<CompanyBankInfo[]>(companyBankInfoList);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [trxSearch, setTrxSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Balance Modal State
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [selectedUserForBalance, setSelectedUserForBalance] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'set'>('add');

  // Create User Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createData, setCreateData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    balance: '13000000',
    isAdmin: false,
    isVerified: true
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    setBankList(companyBankInfoList);
  }, [companyBankInfoList]);

  useEffect(() => {
    if (user?.isAdmin) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
      if (!trxSearch.trim()) {
          setFilteredTransactions(transactions);
      } else {
          const lower = trxSearch.toLowerCase();
          const filtered = transactions.filter(t => 
             t.id.toLowerCase().includes(lower) || 
             t.userId.toLowerCase().includes(lower) ||
             users.find(u => u.id === t.userId)?.email.toLowerCase().includes(lower) ||
             users.find(u => u.id === t.userId)?.fullName.toLowerCase().includes(lower)
          );
          setFilteredTransactions(filtered);
      }
  }, [trxSearch, transactions, users]);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers);
      const fetchedTransactions = await getAllTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error loading admin data", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto text-center text-danger py-10">
        Access Denied: You must be an administrator to view this page.
      </div>
    );
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateLoading(true);

    if (!createData.fullName || !createData.email || !createData.password) {
        setCreateError("Name, Email, and Password are required.");
        setCreateLoading(false);
        return;
    }

    try {
        const success = await adminCreateUser({
            fullName: createData.fullName,
            email: createData.email,
            phoneNumber: createData.phoneNumber,
            password: createData.password,
            balance: parseFloat(createData.balance) || 0,
            isAdmin: createData.isAdmin,
            isVerified: createData.isVerified
        });

        if (success) {
            setIsCreateModalOpen(false);
            setCreateData({
                fullName: '',
                email: '',
                phoneNumber: '',
                password: '',
                balance: '13000000',
                isAdmin: false,
                isVerified: true
            });
            // Re-load users after successful creation
            await loadData();
        } else {
            setCreateError("Failed to create user. Email might be taken or database connection issue.");
        }
    } catch (err) {
        setCreateError("Error during user creation.");
    } finally {
        setCreateLoading(false);
    }
  };

  const handleBankChange = (index: number, field: keyof CompanyBankInfo, value: string) => {
    const updatedList = [...bankList];
    updatedList[index][field] = value;
    setBankList(updatedList);
  };

  const addBank = () => {
    setBankList([...bankList, { bankName: '', accountNumber: '', accountHolderName: '' }]);
  };

  const removeBank = (index: number) => {
    const updatedList = bankList.filter((_, i) => i !== index);
    setBankList(updatedList);
  };

  const handleUpdateBankInfo = () => {
    setCompanyBankInfoList(bankList);
    alert('Company Bank Info Updated!');
  };

  const handleStatusChange = async (t: Transaction, newStatus: string) => {
      if (t.status === newStatus) return;
      
      const status = newStatus as TransactionStatus;
      if (t.type === 'DEPOSIT') {
          await updateDepositStatus(t.id, status);
      } else if (t.type === 'WITHDRAWAL') {
          await updateWithdrawalStatus(t.id, status);
      }
      await loadData();
  };

  const openBalanceModal = (u: User) => {
    setSelectedUserForBalance(u);
    setBalanceAmount('');
    setBalanceOperation('add');
    setIsBalanceModalOpen(true);
  };

  const handleBalanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForBalance || !balanceAmount) return;

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount)) {
        alert("Please enter a valid number");
        return;
    }

    await adminUpdateUserBalance(selectedUserForBalance.id, amount, balanceOperation);
    setIsBalanceModalOpen(false);
    setSelectedUserForBalance(null);
    setBalanceAmount('');
    loadData();
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

  const getUserDetails = (userId: string) => {
      const u = users.find(user => user.id === userId);
      return u ? `${u.fullName} (${u.email})` : userId;
  };

  return (
    <div className="container mx-auto relative font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">Admin Panel</h2>
            <p className="text-gray-500">Manage users, transactions, and company settings.</p>
        </div>
        <Button onClick={loadData} variant="ghost" className="flex items-center" isLoading={isRefreshing}>
             Refresh Data
        </Button>
      </div>

      <div className="bg-darkblue2 p-6 rounded-lg shadow-md">
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Manage Users
          </button>
          <button
            className={`ml-4 px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'transactions' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            Manage Transactions
          </button>
          <button
            className={`ml-4 px-4 py-2 text-base sm:text-lg font-medium whitespace-nowrap ${
              activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Company Settings
          </button>
        </div>

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Registered Profiles ({users.length})</h3>
                <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                    <UserPlusIcon className="w-4 h-4 mr-2" />
                    Create New User
                </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-darkblue">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verified</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Admin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((u: User) => (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-sans tabular-nums">{u.id.substring(0,8)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-medium">{u.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">{u.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-sans tabular-nums">Rp {u.balance.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isVerified ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                          {u.isVerified ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isAdmin ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-400'}`}>
                          {u.isAdmin ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openBalanceModal(u)}
                                className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/30"
                            >
                                Edit Balance
                            </Button>
                            <Button
                                variant={u.isVerified ? 'danger' : 'primary'}
                                size="sm"
                                onClick={async () => {
                                    await updateUserVerification(u.id, !u.isVerified);
                                    await loadData();
                                }}
                            >
                                {u.isVerified ? 'Deactivate' : 'Activate'}
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && !isRefreshing && (
                      <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-gray-500">No users found in database.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <h3 className="text-xl font-semibold">Transaction Management</h3>
                <div className="relative w-full sm:w-64 font-sans">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search User ID, Name, Email..." 
                        className="w-full bg-[#1E2329] border border-gray-700 rounded pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                        value={trxSearch}
                        onChange={(e) => setTrxSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-darkblue">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredTransactions.map((t: Transaction) => (
                    <tr key={t.id} className="hover:bg-white/[0.01]">
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-sans tabular-nums">{new Date(t.date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-300">
                          <div className="flex flex-col">
                              <span className="text-white font-medium">{getUserDetails(t.userId).split('(')[0]}</span>
                              <span className="text-xs text-gray-500">{getUserDetails(t.userId).split('(')[1]?.replace(')','')}</span>
                          </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider ${t.type === 'DEPOSIT' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                             {t.type}
                          </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-white font-sans tabular-nums font-bold">Rp {t.amount.toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-xs sm:text-sm font-medium">
                        {t.type !== 'TRANSFER' ? (
                          <select
                            className="bg-[#1E2329] border border-gray-600 text-white text-xs rounded p-1.5 focus:border-primary focus:outline-none cursor-pointer"
                            value={t.status}
                            onChange={(e) => handleStatusChange(t, e.target.value)}
                          >
                              <option value={TransactionStatus.PENDING}>PENDING</option>
                              <option value={TransactionStatus.SUCCESS}>DONE (Success)</option>
                              <option value={TransactionStatus.REJECTED}>REJECTED</option>
                              {t.type === 'WITHDRAWAL' && <option value={TransactionStatus.CANCELLED}>CANCELLED</option>}
                              {t.type === 'WITHDRAWAL' && <option value={TransactionStatus.FAILED}>FAILED</option>}
                          </select>
                        ) : (
                          <span className="text-gray-500 italic">Auto-Success</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                      <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No transactions match your search.</td>
                      </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Company Bank Information for Deposits</h3>
            <div className="space-y-6">
                {bankList.map((bank, index) => (
                    <div key={index} className="bg-darkblue p-4 rounded-md border border-gray-700 relative group">
                        <h4 className="font-semibold text-lg mb-4 text-white">Bank Account #{index + 1}</h4>
                        <Input
                            id={`adminBankName-${index}`}
                            label="Bank Name"
                            type="text"
                            icon={<BuildingLibraryIcon />}
                            value={bank.bankName}
                            onChange={(e) => handleBankChange(index, 'bankName', e.target.value)}
                            className="mb-4"
                        />
                        <Input
                            id={`adminAccountNumber-${index}`}
                            label="Account Number"
                            type="text"
                            icon={<CreditCardIcon />}
                            value={bank.accountNumber}
                            onChange={(e) => handleBankChange(index, 'accountNumber', e.target.value)}
                            className="mb-4 font-sans"
                        />
                        <Input
                            id={`adminAccountHolderName-${index}`}
                            label="Account Holder Name"
                            type="text"
                            icon={<BanknotesIcon />}
                            value={bank.accountHolderName}
                            onChange={(e) => handleBankChange(index, 'accountHolderName', e.target.value)}
                            className="mb-4"
                        />
                        <Button onClick={() => removeBank(index)} variant="danger" size="sm" className="absolute top-4 right-4 !p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-700 pt-6">
              <Button onClick={addBank} variant="secondary" size="md">
                  <PlusIcon className="h-5 w-5 mr-2" /> Add New Bank Account
              </Button>
              <Button onClick={handleUpdateBankInfo} variant="primary" size="lg" className="shadow-lg shadow-primary/20">
                  Save All Changes
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in font-sans">
                <div className="bg-darkblue p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold flex items-center uppercase tracking-wider">
                        <UserPlusIcon className="w-5 h-5 mr-2 text-primary" />
                        Create New User
                    </h3>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                    {createError && (
                        <div className="bg-danger/20 text-danger p-3 rounded-md text-sm border border-danger/30">
                            {createError}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            id="createFullName"
                            label="Full Name"
                            placeholder="John Doe"
                            icon={<PlusIcon />}
                            value={createData.fullName}
                            onChange={(e) => setCreateData({...createData, fullName: e.target.value})}
                        />
                        <Input 
                            id="createEmail"
                            label="Email"
                            type="email"
                            placeholder="john@example.com"
                            icon={<EnvelopeIcon />}
                            value={createData.email}
                            onChange={(e) => setCreateData({...createData, email: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            id="createPhone"
                            label="Phone Number"
                            placeholder="081234..."
                            icon={<PhoneIcon />}
                            value={createData.phoneNumber}
                            onChange={(e) => setCreateData({...createData, phoneNumber: e.target.value})}
                        />
                        <Input 
                            id="createPassword"
                            label="Password"
                            type="password"
                            icon={<LockClosedIcon />}
                            value={createData.password}
                            onChange={(e) => setCreateData({...createData, password: e.target.value})}
                        />
                    </div>

                    <Input 
                        id="createBalance"
                        label="Initial Balance (Rp)"
                        type="number"
                        icon={<CurrencyDollarIcon />}
                        value={createData.balance}
                        onChange={(e) => setCreateData({...createData, balance: e.target.value})}
                        className="font-sans"
                    />

                    <div className="flex flex-col space-y-3 pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={createData.isAdmin}
                                onChange={(e) => setCreateData({...createData, isAdmin: e.target.checked})}
                                className="w-5 h-5 bg-darkblue border-gray-700 rounded text-primary focus:ring-0"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Make Administrator</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={createData.isVerified}
                                onChange={(e) => setCreateData({...createData, isVerified: e.target.checked})}
                                className="w-5 h-5 bg-darkblue border-gray-700 rounded text-primary focus:ring-0"
                            />
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Auto-Verify Account</span>
                        </label>
                    </div>

                    <div className="mt-8 flex space-x-3 pt-4 border-t border-gray-700">
                        <Button type="button" variant="ghost" fullWidth onClick={() => setIsCreateModalOpen(false)} disabled={createLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth isLoading={createLoading} disabled={createLoading}>
                            Save & Create
                        </Button>
                    </div>
                </form>
              </div>
          </div>
      )}

      {/* Balance Edit Modal */}
      {isBalanceModalOpen && selectedUserForBalance && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-darkblue2 border border-gray-700 rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-fade-in font-sans">
                <div className="bg-darkblue p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-white text-lg font-semibold flex items-center uppercase tracking-widest">
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary" />
                        Edit User Balance
                    </h3>
                    <button onClick={() => setIsBalanceModalOpen(false)} className="text-gray-400 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleBalanceSubmit} className="p-6">
                    <div className="mb-6 bg-darkblue/50 p-4 rounded-lg border border-gray-800">
                        <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Target User</p>
                        <p className="text-white font-medium text-lg">{selectedUserForBalance.fullName}</p>
                        <p className="text-gray-400 text-sm">{selectedUserForBalance.email}</p>
                    </div>
                    
                    <div className="mb-8">
                         <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Current Balance</p>
                         <p className="text-3xl font-sans font-black text-white">Rp {selectedUserForBalance.balance.toLocaleString('id-ID')}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-500 mb-3 uppercase tracking-widest font-bold">Select Operation</label>
                            <div className="flex space-x-4">
                                <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${balanceOperation === 'add' ? 'bg-primary/20 border-primary text-white shadow-lg shadow-primary/10 scale-105' : 'border-gray-700 text-gray-500 hover:bg-gray-800'}`}>
                                    <input 
                                        type="radio" 
                                        name="operation" 
                                        value="add" 
                                        checked={balanceOperation === 'add'} 
                                        onChange={() => setBalanceOperation('add')}
                                        className="hidden" 
                                    />
                                    <PlusIcon className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Add/Deduct</span>
                                </label>
                                <label className={`flex-1 cursor-pointer border rounded-xl p-3 flex flex-col items-center justify-center transition-all ${balanceOperation === 'set' ? 'bg-warning/20 border-warning text-white shadow-lg shadow-warning/10 scale-105' : 'border-gray-700 text-gray-500 hover:bg-gray-800'}`}>
                                    <input 
                                        type="radio" 
                                        name="operation" 
                                        value="set" 
                                        checked={balanceOperation === 'set'} 
                                        onChange={() => setBalanceOperation('set')}
                                        className="hidden" 
                                    />
                                    <BanknotesIcon className="w-6 h-6 mb-1" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Set Absolute</span>
                                </label>
                            </div>
                        </div>

                        <Input 
                            id="adminBalanceInput"
                            label={balanceOperation === 'add' ? "Amount (Negative for deduction)" : "New Absolute Total"}
                            type="number"
                            placeholder="0"
                            value={balanceAmount}
                            onChange={(e) => setBalanceAmount(e.target.value)}
                            icon={<CurrencyDollarIcon />}
                            className="font-sans"
                        />
                    </div>

                    <div className="mt-10 flex space-x-3">
                        <Button type="button" variant="ghost" fullWidth onClick={() => setIsBalanceModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" fullWidth className="shadow-lg shadow-primary/20">
                            Confirm Update
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
