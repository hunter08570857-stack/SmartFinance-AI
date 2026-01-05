
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  balance: number;
  currency: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  note: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AppState {
  isDemoMode: boolean;
  user: UserProfile | null;
  accounts: BankAccount[];
  transactions: Transaction[];
  categories: Category[];
}
