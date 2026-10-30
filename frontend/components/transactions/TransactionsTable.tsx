"use client";

import React from "react";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatSignedCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";
import { Edit2, Trash2 } from "lucide-react";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-100 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4">Transaction</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Amount</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {transactions.map((tx) => (
            <tr key={tx.id} className="transition hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-900 dark:text-white">{tx.title}</div>
                {tx.notes && <div className="text-xs text-slate-400 dark:text-slate-500">{tx.notes}</div>}
              </td>
              <td className="px-6 py-4">
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
              </td>
              <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                {formatDate(tx.date)}
              </td>
              <td className="px-6 py-4 text-right font-bold">
                <span className={tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}>
                  {formatSignedCurrency(tx.amount, tx.type)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(tx)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(tx.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
