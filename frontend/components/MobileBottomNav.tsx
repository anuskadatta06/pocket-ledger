"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, Target, Tag, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Txs", href: "/transactions", icon: ArrowLeftRight },
  { label: "Budgets", href: "/budgets", icon: Target },
  { label: "Tags", href: "/categories", icon: Tag },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/90 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 md:hidden">
      {BOTTOM_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-1 text-[11px] font-semibold transition",
              isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
