import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ResetFiltersButtonProps {
  onReset: () => void;
  hasFilters: boolean;
}

export function ResetFiltersButton({ onReset, hasFilters }: ResetFiltersButtonProps) {
  if (!hasFilters) return null;

  return (
    <Button variant="ghost" size="sm" onClick={onReset} className="text-slate-500">
      <RotateCcw className="h-3.5 w-3.5 mr-1" />
      <span>Reset Filters</span>
    </Button>
  );
}
