
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  PieChart, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Plus, 
  User,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { auth, db, isFirebaseAvailable } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Use standard modular imports from firebase/firestore for real-time listeners and queries
import { collection, query, onSnapshot } from 'firebase/firestore';
import { 
  TransactionType, 
  BankAccount, 
  Category, 
  Transaction, 
  UserProfile, 
  AppState 
} from './types';
import { DEFAULT_CATEGORIES, DEMO_ACCOUNTS, DEMO_TRANSACTIONS } from './constants';
import Dashboard from './components/Dashboard';
import Accounts from './components/Accounts';
import Transactions from './components/Transactions';
import Auth from './components/Auth';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'transactions' | 'ai'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!isFirebaseAvailable());
  const [user, setUser] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth Listener
  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email || '', displayName: firebaseUser.displayName || '' });
        setIsDemoMode(false);
      } else {
        setUser(null);
        if (!isFirebaseAvailable()) setIsDemoMode(true);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Data Loading
  useEffect(() => {
    if (isDemoMode) {
      setAccounts(DEMO_ACCOUNTS);
      setTransactions(DEMO_TRANSACTIONS);
      return;
    }

    if (!user || !db) return;

    const qAccounts = query(collection(db, 'users', user.uid, 'accounts'));
    const unsubAccounts = onSnapshot(qAccounts, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BankAccount)));
    });

    const qTransactions = query(collection(db, 'users', user.uid, 'transactions'));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });

    return () => {
      unsubAccounts();
      unsubTransactions();
    };
  }, [user, isDemoMode]);

  const toggleMode = () => {
    if (user && !isDemoMode) {
      alert("您已登入正式帳號，無法切換回展示模式。如需展示模式請先登出。");
      return;
    }
    setIsDemoMode(!isDemoMode);
  };

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      setUser(null);
      setIsDemoMode(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Auth onDemoMode={() => setIsDemoMode(true)} />;
  }

  const sidebarItems = [
    { id: 'dashboard', label: '總覽面板', icon: LayoutDashboard },
    { id: 'accounts', label: '銀行帳戶', icon: Wallet },
    { id: 'transactions', label: '收支紀錄', icon: ArrowRightLeft },
    { id: 'ai', label: 'AI 財務建議', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <PieChart className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SmartFinance</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-500">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-blue-200 shadow-lg">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">SmartFinance</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700 shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t space-y-4">
          <div className="bg-orange-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">模式</span>
              <button 
                onClick={toggleMode}
                className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-orange-200 text-orange-700 shadow-sm"
              >
                切換
              </button>
            </div>
            <p className="text-sm font-semibold text-orange-900">
              {isDemoMode ? '🚀 展示模式' : '💎 正式模式'}
            </p>
            <p className="text-[11px] text-orange-700 mt-1">
              {isDemoMode ? '數據僅儲存於本地瀏覽器' : '數據已加密連線至資料庫'}
            </p>
          </div>

          {user && (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate">{user.email}</p>
                  <p className="text-[10px] text-gray-500">使用者已登入</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto pb-20 md:pb-0">
          {activeTab === 'dashboard' && (
            <Dashboard 
              accounts={accounts} 
              transactions={transactions} 
              categories={DEFAULT_CATEGORIES} 
            />
          )}
          {activeTab === 'accounts' && (
            <Accounts 
              accounts={accounts} 
              setAccounts={setAccounts} 
              isDemoMode={isDemoMode}
              uid={user?.uid}
            />
          )}
          {activeTab === 'transactions' && (
            <Transactions 
              transactions={transactions} 
              accounts={accounts}
              categories={DEFAULT_CATEGORIES}
              setTransactions={setTransactions}
              isDemoMode={isDemoMode}
              uid={user?.uid}
            />
          )}
          {activeTab === 'ai' && (
            <AIInsights 
              accounts={accounts}
              transactions={transactions}
              categories={DEFAULT_CATEGORIES}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
