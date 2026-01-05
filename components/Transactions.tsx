
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  MoreVertical,
  Calendar,
  Tag,
  CreditCard
} from 'lucide-react';
import { Transaction, TransactionType, BankAccount, Category } from '../types';
import { db } from '../firebase';
// Standard modular SDK imports for collection handling and document adding
import { collection, addDoc } from 'firebase/firestore';

interface TransactionsProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  categories: Category[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  isDemoMode: boolean;
  uid?: string;
}

const Transactions: React.FC<TransactionsProps> = ({ 
  transactions, accounts, categories, setTransactions, isDemoMode, uid 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newT, setNewT] = useState<Omit<Transaction, 'id'>>({
    accountId: accounts[0]?.id || '',
    categoryId: categories[0]?.id || '',
    amount: 0,
    type: TransactionType.EXPENSE,
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setTransactions([{ ...newT, id: Math.random().toString(36).substr(2, 9) }, ...transactions]);
    } else if (uid && db) {
      await addDoc(collection(db, 'users', uid, 'transactions'), newT);
    }
    setShowAddModal(false);
  };

  const getCategory = (id: string) => categories.find(c => c.id === id);
  const getAccount = (id: string) => accounts.find(a => a.id === id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">收支紀錄</h2>
          <p className="text-gray-500">追蹤您的每一筆財務流動。</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-100"
        >
          <Plus className="w-5 h-5" />
          <span className="font-bold">紀錄收支</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">日期</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">類別</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">帳戶</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">備註</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">金額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.sort((a, b) => b.date.localeCompare(a.date)).map((t) => {
                const cat = getCategory(t.categoryId);
                const acc = getAccount(t.accountId);
                return (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">{t.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {cat?.name || '未分類'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${acc?.color || 'bg-gray-400'}`} />
                        <span className="text-sm text-gray-700">{acc?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                      {t.note || '-'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-black ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-6">新增收支紀錄</h3>
            <form onSubmit={handleAdd} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setNewT({...newT, type: TransactionType.EXPENSE})}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newT.type === TransactionType.EXPENSE ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 text-gray-400'}`}
                >
                  支出
                </button>
                <button 
                  type="button"
                  onClick={() => setNewT({...newT, type: TransactionType.INCOME})}
                  className={`py-3 rounded-xl border-2 font-bold transition-all ${newT.type === TransactionType.INCOME ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}
                >
                  收入
                </button>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">金額</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-2xl font-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newT.amount}
                  onChange={e => setNewT({...newT, amount: Number(e.target.value)})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">帳戶</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    value={newT.accountId}
                    onChange={e => setNewT({...newT, accountId: e.target.value})}
                  >
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">類別</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200"
                    value={newT.categoryId}
                    onChange={e => setNewT({...newT, categoryId: e.target.value})}
                  >
                    {categories.filter(c => c.type === newT.type).map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">日期</label>
                <input 
                  type="date" required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={newT.date}
                  onChange={e => setNewT({...newT, date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">備註</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                  value={newT.note}
                  onChange={e => setNewT({...newT, note: e.target.value})}
                  rows={2}
                  placeholder="補充說明這筆交易..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-gray-500 hover:bg-gray-50"
                >
                  取消
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
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

export default Transactions;
