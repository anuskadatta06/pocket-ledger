"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { Category, CategoryCreate, CategoryUpdate } from "@/types";
import { CategoryList } from "@/components/categories/CategoryList";
import { CreateCategoryModal } from "@/components/categories/CreateCategoryModal";
import { EditCategoryModal } from "@/components/categories/EditCategoryModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCategories();
      setCategories(res);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreate = async (data: CategoryCreate) => {
    await api.createCategory(data);
    fetchCategories();
  };

  const handleUpdate = async (id: number, data: CategoryUpdate) => {
    await api.updateCategory(id, data);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setDeleteError("");
      await api.deleteCategory(deletingId);
      setDeletingId(null);
      fetchCategories();
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your expenses and income into custom color-coded categories."
        action={
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>New Category</span>
          </Button>
        }
      />

      {deleteError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-600 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-400">
          {deleteError}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <CategoryList
          categories={categories}
          onEdit={(cat) => setEditingCategory(cat)}
          onDelete={(id) => {
            setDeleteError("");
            setDeletingId(id);
          }}
        />
      )}

      <CreateCategoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onSubmit={handleUpdate}
        category={editingCategory}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => {
          setDeletingId(null);
          setDeleteError("");
        }}
        onConfirm={handleDelete}
        title="Delete Custom Category"
        message="Are you sure you want to delete this custom category? Categories with existing transactions attached cannot be deleted until transactions are reassigned."
      />
    </div>
  );
}
