import React from "react";
import { Select } from "@/components/ui/Select";
import { getMonthOptions } from "@/lib/utils";

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onMonthChange: (m: number) => void;
  onYearChange: (y: number) => void;
}

export function MonthYearSelector({
  month,
  year,
  onMonthChange,
  onYearChange,
}: MonthYearSelectorProps) {
  const months = getMonthOptions();
  const years = [2024, 2025, 2026, 2027];

  return (
    <div className="flex items-center gap-2">
      <Select value={month} onChange={(e) => onMonthChange(parseInt(e.target.value))} className="w-36">
        {months.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </Select>
      <Select value={year} onChange={(e) => onYearChange(parseInt(e.target.value))} className="w-28">
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>
    </div>
  );
}
