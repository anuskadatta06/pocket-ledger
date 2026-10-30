import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface BatchImportSummaryProps {
  importedCount: number;
  skippedCount: number;
  errors: string[];
}

export function BatchImportSummary({ importedCount, skippedCount, errors }: BatchImportSummaryProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <h4 className="font-bold text-slate-900 dark:text-white">Batch Processing Completed</h4>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <p className="font-semibold">Successfully Added</p>
          <p className="text-xl font-bold mt-1">{importedCount}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <p className="font-semibold">Skipped / Duplicates</p>
          <p className="text-xl font-bold mt-1">{skippedCount}</p>
        </div>
      </div>
      {errors.length > 0 && (
        <div className="max-h-28 overflow-y-auto rounded-xl bg-slate-50 p-2 text-[11px] text-slate-500 dark:bg-slate-800">
          {errors.map((err, i) => (
            <p key={i} className="line-clamp-1">{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
