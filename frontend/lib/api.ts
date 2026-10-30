import {
  Category,
  CategoryCreate,
  CategoryUpdate,
  Transaction,
  TransactionCreate,
  TransactionUpdate,
  Budget,
  BudgetStatus,
  FinancialSummary,
  CategoryBreakdown,
  MonthlyTrend,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected server error occurred.";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.error || errorDetail;
    } catch {
      // Fallback to response status text
    }
    throw new Error(errorDetail);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  // Categories
  getCategories: () => request<Category[]>("/categories"),
  getCategory: (id: number) => request<Category>(`/categories/${id}`),
  createCategory: (data: CategoryCreate) =>
    request<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: number, data: CategoryUpdate) =>
    request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: number) =>
    request<void>(`/categories/${id}`, { method: "DELETE" }),

  // Transactions
  getTransactions: (params?: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") query.append(k, String(v));
      });
    }
    const qStr = query.toString();
    return request<PaginatedResponse<Transaction>>(`/transactions${qStr ? `?${qStr}` : ""}`);
  },
  getTransaction: (id: number) => request<Transaction>(`/transactions/${id}`),
  createTransaction: (data: TransactionCreate) =>
    request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id: number, data: TransactionUpdate) =>
    request<Transaction>(`/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTransaction: (id: number) =>
    request<void>(`/transactions/${id}`, { method: "DELETE" }),
  bulkDeleteTransactions: (ids: number[]) =>
    request<{ deleted_count: number }>("/transactions/bulk-delete", {
      method: "POST",
      body: JSON.stringify(ids),
    }),

  // Budgets
  getBudgets: (month?: number, year?: number) => {
    const q = new URLSearchParams();
    if (month) q.append("month", String(month));
    if (year) q.append("year", String(year));
    const str = q.toString();
    return request<Budget[]>(`/budgets${str ? `?${str}` : ""}`);
  },
  getBudgetsStatus: (month?: number, year?: number) => {
    const q = new URLSearchParams();
    if (month) q.append("month", String(month));
    if (year) q.append("year", String(year));
    const str = q.toString();
    return request<BudgetStatus[]>(`/budgets/status${str ? `?${str}` : ""}`);
  },
  createBudget: (data: { category_id: number; monthly_limit: number; month: number; year: number }) =>
    request<Budget>("/budgets", { method: "POST", body: JSON.stringify(data) }),
  updateBudget: (id: number, monthly_limit: number) =>
    request<Budget>(`/budgets/${id}`, { method: "PUT", body: JSON.stringify({ monthly_limit }) }),
  deleteBudget: (id: number) => request<void>(`/budgets/${id}`, { method: "DELETE" }),

  // Analytics
  getSummary: (startDate?: string, endDate?: string) => {
    const q = new URLSearchParams();
    if (startDate) q.append("start_date", startDate);
    if (endDate) q.append("end_date", endDate);
    const str = q.toString();
    return request<FinancialSummary>(`/analytics/summary${str ? `?${str}` : ""}`);
  },
  getCategoryBreakdown: (type = "expense", startDate?: string, endDate?: string) => {
    const q = new URLSearchParams({ type });
    if (startDate) q.append("start_date", startDate);
    if (endDate) q.append("end_date", endDate);
    return request<CategoryBreakdown[]>(`/analytics/category-breakdown?${q.toString()}`);
  },
  getMonthlyTrend: (months = 6) =>
    request<MonthlyTrend[]>(`/analytics/monthly-trend?months=${months}`),
  getRecentTransactions: (limit = 5) =>
    request<Transaction[]>(`/analytics/recent?limit=${limit}`),
  getTopCategory: (month?: number, year?: number) => {
    const q = new URLSearchParams();
    if (month) q.append("month", String(month));
    if (year) q.append("year", String(year));
    const str = q.toString();
    return request<CategoryBreakdown | null>(`/analytics/top-category${str ? `?${str}` : ""}`);
  },

  // CSV
  getCsvExportUrl: () => `${API_BASE_URL}/csv/export`,
};
