import React from "react";
import { Receipt } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

interface TransactionsEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddTransaction: () => void;
}

export function TransactionsEmptyState({
  hasFilters,
  onClearFilters,
  onAddTransaction,
}: TransactionsEmptyStateProps) {
  if (hasFilters) {
    return (
      <EmptyState
        icon={Receipt}
        title="No matching transactions found"
        description="Try adjusting or clearing your active filters and search terms."
        actionText="Clear Filters"
        onAction={onClearFilters}
      />
    );
  }

  return (
    <EmptyState
      icon={Receipt}
      title="No transactions yet"
      description="You haven't logged any income or expense transactions. Start by adding your first one!"
      actionText="Add Transaction"
      onAction={onAddTransaction}
    />
  );
}
