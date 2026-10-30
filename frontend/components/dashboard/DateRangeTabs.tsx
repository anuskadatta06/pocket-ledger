import React from "react";
import { Tabs } from "@/components/ui/Tabs";

interface DateRangeTabsProps {
  range: string;
  onChange: (range: string) => void;
}

export function DateRangeTabs({ range, onChange }: DateRangeTabsProps) {
  const tabs = [
    { id: "all", label: "All Time" },
    { id: "30days", label: "Last 30 Days" },
    { id: "this_month", label: "This Month" },
  ];

  return <Tabs tabs={tabs} activeTab={range} onChange={onChange} />;
}
