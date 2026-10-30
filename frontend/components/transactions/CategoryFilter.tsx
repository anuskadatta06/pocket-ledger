import React from "react";
import { Category } from "@/types";
import { Select } from "@/components/ui/Select";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onChange: (catId: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <Select
      value={selectedCategory}
      onChange={(e) => onChange(e.target.value)}
      className="w-48"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </Select>
  );
}
