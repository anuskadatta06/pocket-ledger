"use client";

import React, { useState, useEffect } from "react";
import { Select } from "@/components/ui/Select";

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD - US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "EUR - Euro (€)" },
  { code: "GBP", symbol: "£", label: "GBP - British Pound (£)" },
  { code: "INR", symbol: "₹", label: "INR - Indian Rupee (₹)" },
  { code: "CAD", symbol: "$", label: "CAD - Canadian Dollar ($)" },
  { code: "AUD", symbol: "$", label: "AUD - Australian Dollar ($)" },
];

export function CurrencySelector() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const saved = localStorage.getItem("pocketledger_currency");
    if (saved) setCurrency(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCurrency(val);
    localStorage.setItem("pocketledger_currency", val);
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Primary Currency
      </label>
      <Select value={currency} onChange={handleChange}>
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
