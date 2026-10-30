import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // percentage (0 - 100+)
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className, showLabel = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  const colorClass = isDanger
    ? "bg-rose-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-blue-600 dark:bg-blue-500";

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn("h-full transition-all duration-500 ease-out", colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-500">
          <span>{percentage.toFixed(0)}% used</span>
          {isDanger && <span className="font-semibold text-rose-500">Budget Exceeded</span>}
        </div>
      )}
    </div>
  );
}
