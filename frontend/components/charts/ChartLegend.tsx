import React from "react";
import { Badge } from "@/components/ui/Badge";
import { CategoryBreakdown } from "@/types";

interface ChartLegendProps {
  categories: CategoryBreakdown[];
}

export function ChartLegend({ categories }: ChartLegendProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {categories.map((c) => (
        <Badge key={c.category_id} customColor={c.category_color}>
          <span>{c.category_name}</span>
          <span className="opacity-70 font-normal">({c.percentage}%)</span>
        </Badge>
      ))}
    </div>
  );
}
