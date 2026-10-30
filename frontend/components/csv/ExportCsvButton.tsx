import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

export function ExportCsvButton() {
  const handleDownload = () => {
    window.open(api.getCsvExportUrl(), "_blank");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-1.5" />
      <span>Export CSV</span>
    </Button>
  );
}
