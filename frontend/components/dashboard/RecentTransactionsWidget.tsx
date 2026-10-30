import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Transaction } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatSignedCurrency, formatDate } from "@/lib/utils";
import { getCategoryIcon } from "@/lib/icons";

interface RecentTransactionsWidgetProps {
  transactions: Transaction[];
}

export function RecentTransactionsWidget({ transactions }: RecentTransactionsWidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          <span>View all</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: tx.category?.color || "#6B7280" }}
                  >
                    {getCategoryIcon(tx.category?.icon || "tag", { className: "w-4 h-4" })}
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-slate-900 dark:text-white">{tx.title}</h5>
                    <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <span
                  className={`text-sm font-bold ${
                    tx.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {formatSignedCurrency(tx.amount, tx.type)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
