import React from "react";
import { MonthlyTrend } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";

interface IncomeExpenseChartProps {
  data: MonthlyTrend[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-xs text-slate-400">No monthly data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expense]), 100);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cash Flow Trend</CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span className="text-slate-500">Expense</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end gap-6 pt-4">
          {data.map((item, idx) => {
            const incHeight = Math.max(6, Math.round((item.income / maxVal) * 160));
            const expHeight = Math.max(6, Math.round((item.expense / maxVal) * 160));
            return (
              <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center gap-1.5">
                  <div
                    className="w-full max-w-[18px] rounded-t-md bg-emerald-500 transition-all hover:opacity-80"
                    style={{ height: `${incHeight}px` }}
                    title={`Income: ${formatCurrency(item.income)}`}
                  />
                  <div
                    className="w-full max-w-[18px] rounded-t-md bg-rose-500 transition-all hover:opacity-80"
                    style={{ height: `${expHeight}px` }}
                    title={`Expense: ${formatCurrency(item.expense)}`}
                  />
                </div>
                <span className="truncate text-[11px] font-semibold text-slate-500">
                  {item.month_name.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
