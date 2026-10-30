import { useMemo } from "react";
import { CategoryBreakdown, MonthlyTrend } from "@/types";

export function useMemoizedAnalytics(
  categoryBreakdown: CategoryBreakdown[],
  monthlyTrends: MonthlyTrend[]
) {
  const totalCategorySpending = useMemo(() => {
    return categoryBreakdown.reduce((acc, curr) => acc + curr.total_amount, 0);
  }, [categoryBreakdown]);

  const maxMonthlyExpense = useMemo(() => {
    return Math.max(...monthlyTrends.map((t) => t.expense), 0);
  }, [monthlyTrends]);

  return {
    totalCategorySpending,
    maxMonthlyExpense,
  };
}
