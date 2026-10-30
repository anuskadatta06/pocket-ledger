export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  description?: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreate {
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  category_id: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  notes?: string;
  category_id: number;
}

export interface TransactionUpdate {
  title?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  notes?: string;
  category_id?: number;
}

export interface Budget {
  id: number;
  category_id: number;
  monthly_limit: number;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface BudgetStatus {
  id: number;
  category_id: number;
  category_name: string;
  category_color: string;
  category_icon: string;
  monthly_limit: number;
  spent_amount: number;
  remaining_amount: number;
  percentage_used: number;
  is_exceeded: boolean;
  month: number;
  year: number;
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  net_balance: number;
  savings_rate: number;
  transaction_count: number;
}

export interface CategoryBreakdown {
  category_id: number;
  category_name: string;
  category_color: string;
  category_icon: string;
  total_amount: number;
  percentage: number;
  transaction_count: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  month_name: string;
  income: number;
  expense: number;
  net: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
