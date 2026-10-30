import React from "react";
import { Flame } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CategoryBreakdown } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface TopCategoryHighlightProps {
  topCategory: CategoryBreakdown | null;
}

export function TopCategoryHighlight({ topCategory }: TopCategoryHighlightProps) {
  if (!topCategory) return null;

  return (
    <Card className="border-rose-100 bg-rose-50/40 dark:border-rose-950/40 dark:bg-rose-950/10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm shadow-rose-500/20">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
            Top Spending Driver
          </span>
          <div className="flex items-baseline gap-2">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              {topCategory.category_name}
            </h4>
            <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              {formatCurrency(topCategory.total_amount)}
            </span>
            <span className="text-xs text-slate-400">({topCategory.percentage}% of expenses)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
