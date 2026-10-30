import React from "react";

interface CsvPreviewTableProps {
  headers: string[];
  rows: string[][];
}

export function CsvPreviewTable({ headers, rows }: CsvPreviewTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className="max-h-48 overflow-auto rounded-xl border border-slate-200 text-xs dark:border-slate-800">
      <table className="w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/60 sticky top-0">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold text-slate-600 dark:text-slate-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
