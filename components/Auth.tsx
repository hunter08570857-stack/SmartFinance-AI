
import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  PieChart, 
  Play, 
  UserPlus, 
  LogIn,
  ShieldCheck
} from 'lucide-react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';

interface AuthProps {
  onDemoMode: () => void;
}

const Auth: React.FC<AuthProps> = ({ onDemoMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError("Firebase 尚未正確設定。請使用展示模式。");
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "身份驗證失敗");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-100 mb-6">
            <PieChart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">SmartFinance AI</h1>
          <p className="text-gray-500 mt-2 font-medium">您的個人智慧財務助手</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-8">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              登入帳號
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              註冊新會員
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start space-x-2">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">密碼</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? "text" : "password"} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="至少 6 位字元"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  <span>{isLogin ? '立即登入' : '完成註冊'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8">
          <button 
            onClick={onDemoMode}
            className="w-full bg-white text-gray-600 py-4 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <Play className="w-5 h-5 text-blue-600" />
            <span>先用展示模式逛逛</span>
          </button>
          <p className="text-center text-gray-400 text-xs mt-4 px-6">
            展示模式不需帳號，數據僅存於當前瀏覽器分頁中。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
