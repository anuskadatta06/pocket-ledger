"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { FinancialSummary, CategoryBreakdown, MonthlyTrend, Transaction, Category, TransactionCreate } from "@/types";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExtraMetrics } from "@/components/dashboard/ExtraMetrics";
import { RecentTransactionsWidget } from "@/components/dashboard/RecentTransactionsWidget";
import { IncomeExpenseChart } from "@/components/charts/IncomeExpenseChart";
import { CategoryDistributionChart } from "@/components/charts/CategoryDistributionChart";
import { TopCategoryHighlight } from "@/components/dashboard/TopCategoryHighlight";
import { DateRangeTabs } from "@/components/dashboard/DateRangeTabs";
import { RefreshAnalyticsButton } from "@/components/dashboard/RefreshAnalyticsButton";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { TransactionModal } from "@/components/transactions/TransactionModal";

export default function DashboardPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [topCategory, setTopCategory] = useState<CategoryBreakdown | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [sumRes, trendRes, catBreakRes, topCatRes, recRes, catRes] = await Promise.all([
        api.getSummary(),
        api.getMonthlyTrend(6),
        api.getCategoryBreakdown("expense"),
        api.getTopCategory(),
        api.getRecentTransactions(5),
        api.getCategories(),
      ]);

      setSummary(sumRes);
      setTrends(trendRes);
      setCategoryBreakdown(catBreakRes);
      setTopCategory(topCatRes);
      setRecentTransactions(recRes);
      setCategories(catRes);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleCreateTransaction = async (data: TransactionCreate) => {
    await api.createTransaction(data);
    loadDashboardData();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time financial pulse, cash flow trends, and budget tracking."
        action={
          <div className="flex items-center gap-2">
            <RefreshAnalyticsButton onRefresh={loadDashboardData} isLoading={loading} />
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>New Expense</span>
            </Button>
          </div>
        }
      />

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Overview Performance
            </h3>
            <DateRangeTabs range={range} onChange={setRange} />
          </div>

          <SummaryCards summary={summary} />

          {topCategory && <TopCategoryHighlight topCategory={topCategory} />}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <IncomeExpenseChart data={trends} />
            <CategoryDistributionChart data={categoryBreakdown} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTransactionsWidget transactions={recentTransactions} />
            </div>
            <div>
              <ExtraMetrics summary={summary} />
            </div>
          </div>
        </div>
      )}

      <FloatingActionButton onClick={() => setIsAddOpen(true)} />

      <TransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateTransaction}
        categories={categories}
      />
    </div>
  );
}
