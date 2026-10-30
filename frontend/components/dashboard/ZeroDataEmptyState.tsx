import React from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ZeroDataEmptyStateProps {
  onAddFirst: () => void;
}

export function ZeroDataEmptyState({ onAddFirst }: ZeroDataEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <Sparkles className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Welcome to PocketLedger!</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Your financial dashboard will automatically light up with charts and progress trackers once you record your first transaction.
      </p>
      <Button onClick={onAddFirst} className="mt-6">
        Log Your First Expense
      </Button>
    </div>
  );
}
