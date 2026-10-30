"use client";

import React from "react";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatSignedCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { Edit2, Trash2 } from "lucide-react";

interface MobileTransactionCardProps {
  transaction: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export function MobileTransactionCard({ transaction: tx, onEdit, onDelete }: MobileTransactionCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:hidden">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{tx.title}</h4>
          <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(tx.date)}</span>
        </div>
        <span
          className={
            tx.type === "income"
              ? "text-sm font-bold text-emerald-600 dark:text-emerald-400"
              : "text-sm font-bold text-slate-900 dark:text-white"
          }
        >
          {formatSignedCurrency(tx.amount, tx.type)}
        </span>
      </div>

      {tx.notes && <p className="text-xs text-slate-500 dark:text-slate-400">{tx.notes}</p>}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <div>
          {tx.category ? (
            <Badge customColor={tx.category.color}>
              <span className="flex items-center gap-1">
                {getCategoryIcon(tx.category.icon, { className: "w-3 h-3" })}
                {tx.category.name}
              </span>
            </Badge>
          ) : (
            <span className="text-xs text-slate-400">Uncategorized</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(tx)}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(tx.id)}
            className="rounded-lg p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
