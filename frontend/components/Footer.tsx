import React from "react";
import { Github, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="flex items-center justify-center gap-1">
        <span>PocketLedger &copy; 2026. Built with</span>
        <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
        <span>using FastAPI &amp; Next.js.</span>
        <a
          href="https://github.com/anuskadatta06/pocket-ledger"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center gap-1 font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300"
        >
          <Github className="h-3.5 w-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
}
