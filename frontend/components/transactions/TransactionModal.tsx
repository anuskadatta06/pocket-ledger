"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { DatePicker } from "@/components/ui/DatePicker";
import { Button } from "@/components/ui/Button";
import { Category, TransactionCreate } from "@/types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionCreate) => Promise<void>;
  categories: Category[];
  initialData?: Partial<TransactionCreate>;
  title?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  title = "Add Transaction",
}: TransactionModalProps) {
  const [formData, setFormData] = useState<TransactionCreate>({
    title: initialData?.title || "",
    amount: initialData?.amount || 0,
    type: initialData?.type || "expense",
    date: initialData?.date || new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
    category_id: initialData?.category_id || (categories[0]?.id || 1),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (formData.amount <= 0) {
      setError("Amount must be greater than zero");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-500">{error}</div>}

        <div className="flex gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "expense" })}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              formData.type === "expense"
                ? "bg-white text-rose-600 shadow-sm dark:bg-slate-900 dark:text-rose-400"
                : "text-slate-500"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "income" })}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              formData.type === "income"
                ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400"
                : "text-slate-500"
            }`}
          >
            Income
          </button>
        </div>

        <Input
          label="Title"
          placeholder="e.g. Grocery store, Monthly Salary"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            required
          />

          <Select
            label="Category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <DatePicker
          label="Date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />

        <Textarea
          label="Notes (Optional)"
          placeholder="Add memo or details..."
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
