import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "income" | "expense" | "neutral" | "outline";
  customColor?: string;
}

export function Badge({
  className,
  variant = "neutral",
  customColor,
  children,
  style,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors";

  const variants = {
    income:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    expense:
      "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
    neutral:
      "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    outline:
      "bg-transparent text-slate-600 border border-slate-300 dark:text-slate-400 dark:border-slate-700",
  };

  const dynamicStyle = customColor
    ? {
        backgroundColor: `${customColor}15`,
        color: customColor,
        borderColor: `${customColor}30`,
        ...style,
      }
    : style;

  return (
    <span
      className={cn(baseStyles, !customColor && variants[variant], className)}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </span>
  );
}
