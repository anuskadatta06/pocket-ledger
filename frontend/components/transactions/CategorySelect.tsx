import React from "react";
import { Category } from "@/types";
import { getCategoryIcon } from "@/lib/icons";

interface CategorySelectProps {
  categories: Category[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export function CategorySelect({ categories, selectedId, onSelect }: CategorySelectProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => {
        const isSelected = cat.id === selectedId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition ${
              isSelected
                ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400"
                : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
              style={{ backgroundColor: cat.color }}
            >
              {getCategoryIcon(cat.icon, { className: "w-4 h-4" })}
            </div>
            <span className="truncate w-full text-center">{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
