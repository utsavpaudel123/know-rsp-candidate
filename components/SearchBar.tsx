"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search MPs...",
}: SearchBarProps) {
  return (
    <div className="surface-panel relative w-full px-3 py-2">
      <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 border-0 bg-transparent pl-10 pr-3 shadow-none focus-visible:ring-0"
        aria-label="Search MPs"
      />
    </div>
  );
}
