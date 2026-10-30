import React from "react";
import { Plus } from "lucide-react";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 transition hover:bg-blue-700 active:scale-95 md:hidden"
      aria-label="Add new transaction"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}
