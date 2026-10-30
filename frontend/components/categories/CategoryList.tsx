import React from "react";
import { Category } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCategoryIcon } from "@/lib/icons";
import { Edit2, Trash2 } from "lucide-react";

interface CategoryListProps {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => (
        <Card key={cat.id} className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
              style={{ backgroundColor: cat.color }}
            >
              {getCategoryIcon(cat.icon, { className: "w-5 h-5" })}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white">{cat.name}</h4>
                {cat.is_system && <Badge className="text-[10px]">System</Badge>}
              </div>
              {cat.description && (
                <p className="line-clamp-1 text-xs text-slate-400">{cat.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(cat)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              title="Edit Category"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            {!cat.is_system && (
              <button
                onClick={() => onDelete(cat.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                title="Delete Category"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
