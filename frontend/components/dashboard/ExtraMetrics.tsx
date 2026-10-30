import React from "react";
import { PiggyBank, Activity } from "lucide-react";
import { MetricCard } from "@/components/ui/MetricCard";
import { FinancialSummary } from "@/types";

interface ExtraMetricsProps {
  summary: FinancialSummary | null;
}

export function ExtraMetrics({ summary }: ExtraMetricsProps) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <MetricCard
        title="Savings Rate"
        value={`${summary.savings_rate}%`}
        icon={PiggyBank}
        colorScheme="purple"
        subtitle={summary.savings_rate >= 20 ? "Excellent target met" : "Aim for 20% or above"}
        trend={{ value: summary.savings_rate >= 0 ? "Positive" : "Deficit", isPositive: summary.savings_rate >= 0 }}
      />
      <MetricCard
        title="Activity Logged"
        value={`${summary.transaction_count} entries`}
        icon={Activity}
        colorScheme="amber"
        subtitle="Across all custom categories"
      />
    </div>
  );
}
