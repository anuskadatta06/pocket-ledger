"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { BudgetStatus } from "@/types";

interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, limit: number) => Promise<void>;
  budget: BudgetStatus | null;
}

export function EditBudgetModal({ isOpen, onClose, onSubmit, budget }: EditBudgetModalProps) {
  if (!budget) return null;

  const [limit, setLimit] = useState(budget.monthly_limit.toString());
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
      await onSubmit(budget.id, limitNum);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update budget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${budget.category_name} Budget`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-500">{error}</div>}

        <Input
          label="Updated Monthly Ceiling"
          type="number"
          step="0.01"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Update Limit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
