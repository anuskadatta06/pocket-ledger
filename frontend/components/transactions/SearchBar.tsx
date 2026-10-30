import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search description, notes..." }: SearchBarProps) {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localVal);
    }, 300);
    return () => clearTimeout(timer);
  }, [localVal, onChange]);

  return (
    <Input
      prefixIcon={<Search className="h-4 w-4" />}
      placeholder={placeholder}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      className="max-w-md"
    />
  );
}
