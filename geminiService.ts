
import { GoogleGenAI } from "@google/genai";
import { Transaction, BankAccount, Category } from './types';

// Use the Pro model for complex financial reasoning tasks.
export const getFinancialAdvice = async (
  accounts: BankAccount[],
  transactions: Transaction[],
  categories: Category[]
): Promise<string> => {
  // Always use process.env.API_KEY directly for initialization as per guidelines.
  if (!process.env.API_KEY || process.env.API_KEY.trim() === '') {
    return "AI 模式未啟動 (請於 GitHub Secrets 設定 API_KEY)。目前僅提供基礎數據展示。";
  }

  try {
    // Initializing with the required named parameter and direct environment variable access.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const summary = transactions.reduce((acc, t) => {
      const catName = categories.find(c => t.categoryId === c.id)?.name || '未分類';
      if (t.type === 'INCOME') {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
        acc.byCategory[catName] = (acc.byCategory[catName] || 0) + t.amount;
      }
      return acc;
    }, { income: 0, expense: 0, byCategory: {} as Record<string, number> });

    const prompt = `
      您是一位專業的財務顧問。請分析以下使用者的財務狀況並提供建議：
      
      帳戶總餘額：$${totalBalance} TWD
      本期總收入：$${summary.income} TWD
      本期總支出：$${summary.expense} TWD
      支出明細：${JSON.stringify(summary.byCategory)}
      
      請以繁體中文提供大約 250 字的專業建議，包含：
      1. 財務現狀簡要評論
      2. 具體的開支優化或節流建議
      3. 基於現有資產的未來理財規劃方向
      
      請確保語氣親切且具有專業見解。
    `;

    // Use gemini-3-pro-preview for complex reasoning and analyze directly via ai.models.generateContent.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.75,
        topP: 0.9,
      }
    });

    // Directly access the .text property to retrieve the generated string.
    return response.text || "AI 分析目前無法生成，請檢查輸入數據。";
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return "AI 服務暫時發生錯誤，請稍後再試。這可能是由於 API KEY 無效或配額限制。";
  }
};
