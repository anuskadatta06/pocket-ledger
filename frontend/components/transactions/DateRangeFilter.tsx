import React from "react";
import { DatePicker } from "@/components/ui/DatePicker";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <DatePicker
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="w-36"
        placeholder="Start Date"
      />
      <span className="text-xs text-slate-400">to</span>
      <DatePicker
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="w-36"
        placeholder="End Date"
      />
    </div>
  );
}
