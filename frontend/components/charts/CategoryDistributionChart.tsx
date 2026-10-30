import React from "react";
import { CategoryBreakdown } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface CategoryDistributionChartProps {
  data: CategoryBreakdown[];
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-xs text-slate-400">No expense breakdown available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual Multi-segment Bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {data.map((cat) => (
            <div
              key={cat.category_id}
              className="h-full transition-all hover:opacity-80"
              style={{
                width: `${cat.percentage}%`,
                backgroundColor: cat.category_color,
              }}
              title={`${cat.category_name}: ${cat.percentage}%`}
            />
          ))}
        </div>

        {/* Breakdown List */}
        <div className="space-y-2 pt-2">
          {data.slice(0, 5).map((cat) => (
            <div key={cat.category_id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: cat.category_color }}
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {cat.category_name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(cat.total_amount)}
                </span>
                <span className="text-slate-400">({cat.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
