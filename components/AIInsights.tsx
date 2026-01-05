
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Quote } from 'lucide-react';
import { Transaction, BankAccount, Category } from '../types';
import { getFinancialAdvice } from '../geminiService';

interface AIInsightsProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ accounts, transactions, categories }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getFinancialAdvice(accounts, transactions, categories);
    setAdvice(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-100">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-black">AI 財務洞察</h2>
        </div>
        <p className="text-gray-500">基於 Gemini-3-Pro 的深度邏輯分析，為您提供專屬的財務建議。</p>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-50 border border-purple-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="relative z-10">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <RefreshCw className="w-12 h-12 text-purple-600 animate-spin mb-4" />
              <p className="text-purple-900 font-bold text-lg animate-pulse">正在精算數據與生成建議...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Quote className="w-10 h-10 text-purple-200 rotate-180 flex-shrink-0" />
                <div className="prose prose-purple max-w-none">
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium italic">
                    {advice || '點擊下方按鈕獲取最新分析。'}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-3 text-sm text-purple-700 font-bold bg-purple-50 px-4 py-2 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                  <span>建議僅供參考，不構成投資意向。</span>
                </div>
                <button 
                  onClick={fetchAdvice}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-purple-200 transition-all flex items-center space-x-3 active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>更新 AI 建議</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <h4 className="text-lg font-bold mb-2">如何提升 AI 準確度？</h4>
          <p className="text-blue-100 text-sm leading-relaxed">
            AI 會分析您的類別分佈與收支比。越詳盡的備註與正確的分類，能讓 Gemini 提供更貼近您生活型態的財務管理方案。
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-[2rem] text-white shadow-xl shadow-green-100">
          <h4 className="text-lg font-bold mb-2">正式模式優勢</h4>
          <p className="text-green-100 text-sm leading-relaxed">
            在正式模式下，您的歷史紀錄將被長期保存於 Firebase 資料庫，這能讓 AI 分析跨月份的財務趨勢，發現長期潛在的財務漏洞。
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
