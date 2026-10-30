"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your expenses and income into custom color-coded categories."
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            <span>New Category</span>
          </Button>
        }
      />
      <div id="categories-content" className="space-y-4">
        {/* Categories Grid */}
      </div>
    </div>
  );
}
