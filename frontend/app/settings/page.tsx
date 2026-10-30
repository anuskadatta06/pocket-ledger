"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTheme } from "@/components/ThemeProvider";
import { CurrencySelector } from "@/components/settings/CurrencySelector";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Preferences"
        description="Configure your currency displays, display mode, and interface defaults."
      />

      <div className="grid grid-cols-1 gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Display Theme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              {(["light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`flex-1 rounded-2xl border p-4 text-center font-bold capitalize transition ${
                    theme === mode
                      ? "border-blue-600 bg-blue-50/50 text-blue-600 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-400"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {mode} Mode
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <CurrencySelector />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
