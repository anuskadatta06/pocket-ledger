import React from "react";
import { Select } from "@/components/ui/Select";

interface SortDropdownProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: string, order: string) => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const value = `${sortBy}-${sortOrder}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split("-");
    onSortChange(field, order);
  };

  return (
    <Select value={value} onChange={handleChange} className="w-44">
      <option value="date-desc">Newest First</option>
      <option value="date-asc">Oldest First</option>
      <option value="amount-desc">Highest Amount</option>
      <option value="amount-asc">Lowest Amount</option>
      <option value="title-asc">Title (A-Z)</option>
    </Select>
  );
}
