import React from "react";
import { BudgetStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { Edit2, Trash2 } from "lucide-react";

interface BudgetCardProps {
  status: BudgetStatus;
  onEdit: (budget: BudgetStatus) => void;
  onDelete: (id: number) => void;
}

export function BudgetCard({ status: b, onEdit, onDelete }: BudgetCardProps) {
  const isOver = b.is_exceeded;
  const isWarning = b.percentage_used >= 80 && !isOver;

  return (
    <Card className="flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
            style={{ backgroundColor: b.category_color }}
          >
            {getCategoryIcon(b.category_icon, { className: "w-5 h-5" })}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">{b.category_name}</h4>
            <span className="text-xs text-slate-400">Limit: {formatCurrency(b.monthly_limit)}/mo</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(b)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(b.id)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {formatCurrency(b.spent_amount)} spent
          </span>
          <span
            className={
              isOver
                ? "font-bold text-rose-500"
                : isWarning
                ? "font-bold text-amber-500"
                : "text-slate-400"
            }
          >
            {isOver ? `Exceeded by ${formatCurrency(Math.abs(b.remaining_amount))}` : `${formatCurrency(b.remaining_amount)} remaining`}
          </span>
        </div>
        <ProgressBar value={b.percentage_used} />
      </div>
    </Card>
  );
}
