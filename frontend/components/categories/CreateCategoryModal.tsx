"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CategoryCreate } from "@/types";
import { DEFAULT_PALETTE } from "@/lib/colors";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryCreate) => Promise<void>;
}

export function CreateCategoryModal({ isOpen, onClose, onSubmit }: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_PALETTE[0]);
  const [icon, setIcon] = useState("tag");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onSubmit({
        name: name.trim(),
        color,
        icon,
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Custom Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-500">{error}</div>}

        <Input
          label="Category Name"
          placeholder="e.g. Pet Care, Hobbies"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Accent Color
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {DEFAULT_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition-transform ${
                  color === c ? "scale-110 ring-2 ring-blue-500 ring-offset-2" : "hover:scale-105"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Select label="Icon Symbol" value={icon} onChange={(e) => setIcon(e.target.value)}>
          <option value="tag">Tag</option>
          <option value="utensils">Utensils (Food)</option>
          <option value="home">Home (Housing)</option>
          <option value="car">Car (Transit)</option>
          <option value="shopping-cart">Cart (Shopping)</option>
          <option value="film">Film (Entertainment)</option>
          <option value="zap">Zap (Utilities)</option>
          <option value="briefcase">Briefcase (Work)</option>
          <option value="activity">Activity (Health)</option>
          <option value="credit-card">Credit Card (Finance)</option>
        </Select>

        <Textarea
          label="Description (Optional)"
          placeholder="What goes into this category?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Save Category
          </Button>
        </div>
      </form>
    </Modal>
  );
}
