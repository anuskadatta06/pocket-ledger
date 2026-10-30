"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus, Download } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, Category, TransactionCreate } from "@/types";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { MobileTransactionCard } from "@/components/transactions/MobileTransactionCard";
import { TransactionModal } from "@/components/transactions/TransactionModal";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, catRes] = await Promise.all([
        api.getTransactions(),
        api.getCategories(),
      ]);
      setTransactions(txRes.items);
      setCategories(catRes);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTransaction = async (data: TransactionCreate) => {
    await api.createTransaction(data);
    fetchData();
  };

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
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </Button>
          </div>
        }
      />

      <div id="transactions-content" className="space-y-4">
        <TransactionsTable
          transactions={transactions}
          onEdit={() => {}}
          onDelete={() => {}}
        />

        <div className="space-y-3 md:hidden">
          {transactions.map((tx) => (
            <MobileTransactionCard
              key={tx.id}
              transaction={tx}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </div>

      <TransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateTransaction}
        categories={categories}
      />
    </div>
  );
}
