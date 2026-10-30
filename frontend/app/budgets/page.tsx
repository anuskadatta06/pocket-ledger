"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set monthly spending ceilings per category and keep your lifestyle inflation in check."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </Button>
        }
      />
      <div id="budgets-content" className="space-y-6">
        {/* Dynamic budget cards */}
      </div>
    </div>
  );
}
