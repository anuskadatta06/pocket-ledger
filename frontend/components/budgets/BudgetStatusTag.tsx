import React from "react";
import { Badge } from "@/components/ui/Badge";

interface BudgetStatusTagProps {
  percentageUsed: number;
  isExceeded: boolean;
}

export function BudgetStatusTag({ percentageUsed, isExceeded }: BudgetStatusTagProps) {
  if (isExceeded) {
    return <Badge variant="expense">Over Budget</Badge>;
  }

  if (percentageUsed >= 80) {
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
        Near Limit ({percentageUsed}%)
      </Badge>
    );
  }

  return <Badge variant="income">On Track ({percentageUsed}%)</Badge>;
}
