import React from "react";
import { Tabs } from "@/components/ui/Tabs";

interface TypeFilterProps {
  type: string;
  onChange: (type: string) => void;
}

export function TypeFilter({ type, onChange }: TypeFilterProps) {
  const tabs = [
    { id: "", label: "All Types" },
    { id: "expense", label: "Expenses" },
    { id: "income", label: "Income" },
  ];

  return <Tabs tabs={tabs} activeTab={type} onChange={onChange} />;
}
