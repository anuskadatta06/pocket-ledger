"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AddTransactionButtonProps {
  onOpen: () => void;
  className?: string;
}

export function AddTransactionButton({ onOpen, className }: AddTransactionButtonProps) {
  return (
    <Button onClick={onOpen} className={className} size="sm">
      <Plus className="h-4 w-4" />
      <span>Add Transaction</span>
    </Button>
  );
}
