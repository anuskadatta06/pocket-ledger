import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

interface TotalBudgetComparisonProps {
  totalBudget: number;
  totalSpent: number;
}

export function TotalBudgetComparison({ totalBudget, totalSpent }: TotalBudgetComparisonProps) {
  if (totalBudget <= 0) return null;

  const percentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <Card className="border-blue-100 bg-blue-50/30 dark:border-blue-950 dark:bg-blue-950/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm">Total Budget Execution</CardTitle>
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
          {percentage}% used
        </span>
      </CardHeader>
      <CardContent className="space-y-2">
        <ProgressBar value={percentage} />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{formatCurrency(totalSpent)} spent</span>
          <span>{formatCurrency(totalBudget)} total monthly ceiling</span>
        </div>
      </CardContent>
    </Card>
  );
}
