import React from "react";
import { Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { FinancialSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  summary: FinancialSummary | null;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <MetricCard
        title="Total Balance"
        value={formatCurrency(summary.net_balance)}
        icon={Wallet}
        colorScheme="blue"
        subtitle="Net cash reserves"
      />
      <MetricCard
        title="Total Income"
        value={formatCurrency(summary.total_income)}
        icon={ArrowUpRight}
        colorScheme="emerald"
        trend={{ value: `${summary.transaction_count} txs`, isPositive: true }}
      />
      <MetricCard
        title="Total Expenses"
        value={formatCurrency(summary.total_expense)}
        icon={ArrowDownRight}
        colorScheme="rose"
        trend={{ value: `${summary.savings_rate}% saved`, isPositive: summary.savings_rate >= 20 }}
      />
    </div>
  );
}
