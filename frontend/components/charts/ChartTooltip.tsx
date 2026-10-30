import React from "react";
import { formatCurrency } from "@/lib/utils";

interface ChartTooltipProps {
  active?: boolean;
  label: string;
  value: number;
}

export function ChartTooltip({ active, label, value }: ChartTooltipProps) {
  if (!active) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-semibold text-slate-400">{label}</p>
      <p className="text-xs font-bold text-slate-900 dark:text-white">{formatCurrency(value)}</p>
    </div>
  );
}
