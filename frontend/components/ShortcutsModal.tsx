import React from "react";
import { Modal } from "@/components/ui/Modal";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  const list = [
    { key: "N", description: "Open New Transaction dialog" },
    { key: "ESC", description: "Close any open dialog or modal" },
    { key: "/", description: "Focus search bar" },
    { key: "D", description: "Navigate to Dashboard" },
    { key: "T", description: "Navigate to Transactions" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" maxWidth="sm">
      <div className="space-y-3 pt-2">
        {list.map((item) => (
          <div key={item.key} className="flex items-center justify-between text-xs">
            <span className="text-slate-500">{item.description}</span>
            <kbd className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 font-mono font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {item.key}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
