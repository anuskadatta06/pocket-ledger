"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Category } from "@/types";

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category_id: number; monthly_limit: number; month: number; year: number }) => Promise<void>;
  categories: Category[];
  currentMonth: number;
  currentYear: number;
}

export function CreateBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  currentMonth,
  currentYear,
}: CreateBudgetModalProps) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 1);
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseFloat(limit);
    if (!limitNum || limitNum <= 0) {
      setError("Please provide a valid spending limit above zero.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({
        category_id: categoryId,
        monthly_limit: limitNum,
        month: currentMonth,
        year: currentYear,
      });
      setLimit("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Category Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-500">{error}</div>}

        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(parseInt(e.target.value))}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Input
          label="Monthly Ceiling Amount"
          type="number"
          step="0.01"
          placeholder="e.g. 500.00"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Save Budget
          </Button>
        </div>
      </form>
    </Modal>
  );
}
