
import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Landmark, DollarSign, Wallet } from 'lucide-react';
import { BankAccount } from '../types';
import { db } from '../firebase';
// Standard modular SDK imports for collection and document operations
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface AccountsProps {
  accounts: BankAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<BankAccount[]>>;
  isDemoMode: boolean;
  uid?: string;
}

const Accounts: React.FC<AccountsProps> = ({ accounts, setAccounts, isDemoMode, uid }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', bankName: '', balance: 0, color: 'bg-blue-500' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      const acc: BankAccount = { ...newAccount, id: Math.random().toString(36).substr(2, 9), currency: 'TWD' };
      setAccounts([...accounts, acc]);
    } else if (uid && db) {
      await addDoc(collection(db, 'users', uid, 'accounts'), { ...newAccount, currency: 'TWD' });
    }
    setShowAddModal(false);
    setNewAccount({ name: '', bankName: '', balance: 0, color: 'bg-blue-500' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此帳戶嗎？所有相關記錄可能會受到影響。')) return;
    if (isDemoMode) {
      setAccounts(accounts.filter(a => a.id !== id));
    } else if (uid && db) {
      await deleteDoc(doc(db, 'users', uid, 'accounts', id));
    }
  };

  const colors = [
    { name: '藍色', class: 'bg-blue-500' },
    { name: '綠色', class: 'bg-green-500' },
    { name: '橘色', class: 'bg-orange-500' },
    { name: '紫色', class: 'bg-purple-500' },
    { name: '紅色', class: 'bg-red-500' },
    { name: '石板', class: 'bg-slate-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">銀行帳戶管理</h2>
          <p className="text-gray-500">管理您的銀行、錢包與投資帳戶。</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">新增帳戶</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className={`h-2 ${acc.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <Landmark className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(acc.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{acc.bankName}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{acc.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-xs font-bold text-gray-400">TWD</span>
                <p className="text-2xl font-black text-gray-900">${acc.balance.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-6">新增銀行帳戶</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">帳戶名稱</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAccount.name}
                  onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="例如：薪資轉帳、日常消費"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">銀行機構</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAccount.bankName}
                  onChange={e => setNewAccount({...newAccount, bankName: e.target.value})}
                  placeholder="例如：國泰世華、台新銀行"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">初始餘額</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newAccount.balance}
                  onChange={e => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">卡片顏色</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c.class}
                      type="button"
                      onClick={() => setNewAccount({...newAccount, color: c.class})}
                      className={`w-8 h-8 rounded-full ${c.class} ${newAccount.color === c.class ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
