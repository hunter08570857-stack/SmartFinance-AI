
import { TransactionType, BankAccount, Category, Transaction } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: '餐飲飲食', icon: 'Utensils', type: TransactionType.EXPENSE },
  { id: 'cat_2', name: '交通出行', icon: 'Car', type: TransactionType.EXPENSE },
  { id: 'cat_3', name: '薪資收入', icon: 'Wallet', type: TransactionType.INCOME },
  { id: 'cat_4', name: '日常購物', icon: 'ShoppingBag', type: TransactionType.EXPENSE },
  { id: 'cat_5', name: '娛樂休閒', icon: 'Gamepad2', type: TransactionType.EXPENSE },
  { id: 'cat_6', name: '醫療健康', icon: 'HeartPulse', type: TransactionType.EXPENSE },
  { id: 'cat_7', name: '投資回報', icon: 'TrendingUp', type: TransactionType.INCOME },
];

export const DEMO_ACCOUNTS: BankAccount[] = [
  { id: 'acc_1', name: '主要薪轉', bankName: '國泰世華', balance: 52000, currency: 'TWD', color: 'bg-green-500' },
  { id: 'acc_2', name: '日常消費', bankName: '台新銀行', balance: 8400, currency: 'TWD', color: 'bg-blue-500' },
  { id: 'acc_3', name: '投資帳戶', bankName: '富邦銀行', balance: 120000, currency: 'TWD', color: 'bg-purple-500' },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1', accountId: 'acc_1', categoryId: 'cat_3', amount: 55000, type: TransactionType.INCOME, date: '2024-03-05', note: '3月薪資' },
  { id: 't2', accountId: 'acc_2', categoryId: 'cat_1', amount: 150, type: TransactionType.EXPENSE, date: '2024-03-06', note: '午餐' },
  { id: 't3', accountId: 'acc_2', categoryId: 'cat_2', amount: 45, type: TransactionType.EXPENSE, date: '2024-03-06', note: '捷運' },
  { id: 't4', accountId: 'acc_1', categoryId: 'cat_4', amount: 1200, type: TransactionType.EXPENSE, date: '2024-03-07', note: '生活百貨' },
];
