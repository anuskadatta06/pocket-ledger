"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus, Download } from "lucide-react";
import { api } from "@/lib/api";
import { Transaction, Category, TransactionCreate, TransactionUpdate } from "@/types";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { MobileTransactionCard } from "@/components/transactions/MobileTransactionCard";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SearchBar } from "@/components/transactions/SearchBar";
import { CategoryFilter } from "@/components/transactions/CategoryFilter";
import { TypeFilter } from "@/components/transactions/TypeFilter";
import { DateRangeFilter } from "@/components/transactions/DateRangeFilter";
import { SortDropdown } from "@/components/transactions/SortDropdown";
import { Pagination } from "@/components/transactions/Pagination";
import { ResetFiltersButton } from "@/components/transactions/ResetFiltersButton";
import { TransactionsSkeleton } from "@/components/transactions/TransactionsSkeleton";
import { TransactionsEmptyState } from "@/components/transactions/TransactionsEmptyState";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      if (search) params.search = search;
      if (category) params.category_id = category;
      if (type) params.type = type;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await api.getTransactions(params);
      setTransactions(res.items);
      setPages(res.pages);
      setTotal(res.total);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, type, startDate, endDate, sortBy, sortOrder]);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreateTransaction = async (data: TransactionCreate) => {
    await api.createTransaction(data);
    fetchTransactions();
  };

  const handleUpdateTransaction = async (id: number, data: TransactionUpdate) => {
    await api.updateTransaction(id, data);
    fetchTransactions();
  };

  const handleDeleteTransaction = async () => {
    if (!deletingId) return;
    // Optimistic UI removal
    const targetId = deletingId;
    setTransactions((prev) => prev.filter((tx) => tx.id !== targetId));
    setTotal((prev) => Math.max(0, prev - 1));
    setDeletingId(null);
    try {
      await api.deleteTransaction(targetId);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      fetchTransactions();
    }
  };

  const hasFilters = Boolean(search || category || type || startDate || endDate);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setType("");
    setStartDate("");
    setEndDate("");
    setPage(1);
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

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchBar value={search} onChange={(val) => { setSearch(val); setPage(1); }} />
          <TypeFilter type={type} onChange={(val) => { setType(val); setPage(1); }} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryFilter categories={categories} selectedCategory={category} onChange={(val) => { setCategory(val); setPage(1); }} />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(val) => { setStartDate(val); setPage(1); }}
              onEndDateChange={(val) => { setEndDate(val); setPage(1); }}
            />
            <ResetFiltersButton onReset={resetFilters} hasFilters={hasFilters} />
          </div>

          <SortDropdown
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(field, order) => {
              setSortBy(field);
              setSortOrder(order);
            }}
          />
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <TransactionsSkeleton />
      ) : transactions.length === 0 ? (
        <TransactionsEmptyState
          hasFilters={hasFilters}
          onClearFilters={resetFilters}
          onAddTransaction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          <TransactionsTable
            transactions={transactions}
            onEdit={(tx) => setEditingTransaction(tx)}
            onDelete={(id) => setDeletingId(id)}
          />

          <div className="space-y-3 md:hidden">
            {transactions.map((tx) => (
              <MobileTransactionCard
                key={tx.id}
                transaction={tx}
                onEdit={(tx) => setEditingTransaction(tx)}
                onDelete={(id) => setDeletingId(id)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            pages={pages}
            total={total}
            limit={10}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleCreateTransaction}
        categories={categories}
      />

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onSubmit={handleUpdateTransaction}
        transaction={editingTransaction}
        categories={categories}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteTransaction}
        title="Delete Transaction"
        message="Are you sure you want to permanently delete this transaction record? This action cannot be undone."
      />
    </div>
  );
}
