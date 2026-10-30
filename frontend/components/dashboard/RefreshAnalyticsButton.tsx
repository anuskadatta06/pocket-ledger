import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface RefreshAnalyticsButtonProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function RefreshAnalyticsButton({ onRefresh, isLoading }: RefreshAnalyticsButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onRefresh} isLoading={isLoading}>
      <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
      <span>Refresh</span>
    </Button>
  );
}
