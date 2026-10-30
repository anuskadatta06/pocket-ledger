"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { BudgetStatus, Category } from "@/types";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { CreateBudgetModal } from "@/components/budgets/CreateBudgetModal";
import { EditBudgetModal } from "@/components/budgets/EditBudgetModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { Target } from "lucide-react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetStatus | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const [bRes, cRes] = await Promise.all([
        api.getBudgetsStatus(currentMonth, currentYear),
        api.getCategories(),
      ]);
      setBudgets(bRes);
      setCategories(cRes);
    } catch (err) {
      console.error("Failed to load budgets:", err);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleCreate = async (data: any) => {
    await api.createBudget(data);
    fetchBudgets();
  };

  const handleUpdate = async (id: number, limit: number) => {
    await api.updateBudget(id, limit);
    fetchBudgets();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    await api.deleteBudget(deletingId);
    setDeletingId(null);
    fetchBudgets();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set monthly spending ceilings per category and keep your lifestyle inflation in check."
        action={
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Create Budget</span>
          </Button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No Category Budgets Configured"
          description="Setting a monthly spending goal keeps you accountable and helps you hit savings targets."
          actionText="Create Your First Budget"
          onAction={() => setIsCreateOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((b) => (
            <BudgetCard
              key={b.id}
              status={b}
              onEdit={(budget) => setEditingBudget(budget)}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      <CreateBudgetModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        categories={categories}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />

      <EditBudgetModal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        onSubmit={handleUpdate}
        budget={editingBudget}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Category Budget"
        message="Are you sure you want to delete this monthly budget limit?"
      />
    </div>
  );
}
