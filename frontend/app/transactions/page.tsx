"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus, Download } from "lucide-react";
import { api } from "@/lib/api";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="Monitor, filter, and manage all your historical income and expenses."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(api.getCsvExportUrl(), "_blank")}>
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </div>
        }
      />
      <div id="transactions-content" className="space-y-4">
        {/* Module components will be mounted here */}
      </div>
    </div>
  );
}
