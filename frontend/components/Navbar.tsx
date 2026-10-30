"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Sun, Moon, Plus } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavbarProps {
  onOpenNewTransaction?: () => void;
}

export function Navbar({ onOpenNewTransaction }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pocket<span className="text-blue-600">Ledger</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {onOpenNewTransaction && (
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Transaction</span>
          </button>
        )}
      </div>
    </header>
  );
}
