
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Transaction, BankAccount, Category, TransactionType } from '../types';

interface DashboardProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ accounts, transactions, categories }) => {
  const totalBalance = useMemo(() => accounts.reduce((sum, acc) => sum + acc.balance, 0), [accounts]);
  
  const currentMonth = new Date().getMonth();
  const monthIncome = useMemo(() => 
    transactions
      .filter(t => t.type === TransactionType.INCOME && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions, currentMonth]
  );

  const monthExpense = useMemo(() => 
    transactions
      .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date).getMonth() === currentMonth)
      .reduce((sum, t) => sum + t.amount, 0),
    [transactions, currentMonth]
  );

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        const name = cat ? cat.name : '其他';
        data[name] = (data[name] || 0) + t.amount;
      });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">財務總覽</h1>
          <p className="text-gray-500 mt-1">讓我們看看您的資產分佈與收支情況。</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">總資產 (TWD)</p>
          <p className="text-4xl font-extrabold text-blue-600">${totalBalance.toLocaleString()}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-blue-50 p-4 rounded-xl">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">帳戶數量</p>
            <p className="text-2xl font-bold">{accounts.length} 個帳戶</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-green-50 p-4 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">本月收入</p>
            <p className="text-2xl font-bold text-green-600">+${monthIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="bg-red-50 p-4 rounded-xl">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">本月支出</p>
            <p className="text-2xl font-bold text-red-600">-${monthExpense.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
            <span>支出類別佔比</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
            <ArrowDownRight className="w-5 h-5 text-green-600" />
            <span>帳戶餘額分佈</span>
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="balance" radius={[6, 6, 0, 0]}>
                  {accounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
