"use client";

import React, { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

export function ImportCsvModal({ isOpen, onClose, onImportSuccess }: ImportCsvModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a .csv file to import.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/v1/csv/import", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || "Failed to parse CSV spreadsheet.");
      }

      const res = await response.json();
      setResult(res);
      onImportSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to upload CSV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Transactions Spreadsheet">
      <div className="space-y-4">
        {error && <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-500">{error}</div>}

        {result ? (
          <div className="space-y-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
              <h5 className="font-bold">Import Successful!</h5>
              <p className="text-xs mt-1">Successfully imported {result.imported_count} transaction records.</p>
              {result.skipped_count > 0 && (
                <p className="text-xs text-amber-600 mt-1">Skipped {result.skipped_count} invalid rows.</p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={onClose} size="sm">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <label className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 dark:border-slate-700">
              <UploadCloud className="h-8 w-8 text-slate-400" />
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {file ? file.name : "Click to select or drag & drop CSV file"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Supports UTF-8 CSV with Title, Amount, Date, Category headers</p>
              </div>
              <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleUpload} isLoading={loading} disabled={!file}>
                Upload &amp; Process
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
