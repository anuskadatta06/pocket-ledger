import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorScheme?: "blue" | "emerald" | "rose" | "purple" | "amber";
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  colorScheme = "blue",
}: MetricCardProps) {
  const schemeStyles = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", schemeStyles[colorScheme])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {value}
        </h4>
        <div className="mt-1 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold",
                trend.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}
