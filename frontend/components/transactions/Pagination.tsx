import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pages, total, limit, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-100 py-3 dark:border-slate-800">
      <div className="text-xs text-slate-500">
        Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{(page - 1) * limit + 1}</span> to{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(page * limit, total)}</span> of{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span> records
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
