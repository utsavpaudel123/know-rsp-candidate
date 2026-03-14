"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Candidate, CandidateFilters, SortKey, SortOrder } from "@/lib/types";
import { filterAndSortCandidates, getDefaultFilters } from "@/lib/candidates";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import StatsBar from "@/components/StatsBar";
import CandidateCard from "@/components/CandidateCard";
import ActiveFilters from "@/components/ActiveFilters";

interface CandidateGridProps {
  initialCandidates: Candidate[];
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "age", label: "Age" },
  { value: "voteSharePercent", label: "Vote Share" },
  { value: "winMargin", label: "Win Margin" },
  { value: "constituency", label: "Constituency" },
];

export default function CandidateGrid({ initialCandidates }: CandidateGridProps) {
  const [filters, setFilters] = useState<CandidateFilters>(getDefaultFilters());
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleFilterChange = (newFilters: CandidateFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, query: value }));
  };

  const filteredCandidates = useMemo(
    () => filterAndSortCandidates(initialCandidates, filters, sortKey, sortOrder),
    [initialCandidates, filters, sortKey, sortOrder]
  );

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const parts = e.target.value.split(":");
    const key = parts[0] as SortKey;
    const order = parts[1] as SortOrder;
    setSortKey(key);
    setSortOrder(order);
  };

  const sortValue = `${sortKey}:${sortOrder}`;

  const handleReset = () => {
    setFilters(getDefaultFilters());
    setSortKey("name");
    setSortOrder("asc");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          totalCount={initialCandidates.length}
          filteredCount={filteredCandidates.length}
        />

        <div className="min-w-0 space-y-6">
          <div className="surface-card p-4 sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <SearchBar
                value={filters.query}
                onChange={handleSearchChange}
                placeholder="Search by name, constituency, district..."
              />

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Sort order
                </span>
                <select
                  id="sort-select"
                  value={sortValue}
                  onChange={handleSortChange}
                  className="h-11 rounded-full border border-input bg-[var(--surface-strong)] px-4 text-sm font-medium text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <optgroup key={opt.value} label={opt.label}>
                      <option value={`${opt.value}:asc`}>
                        {opt.label} (A-Z / Low-High)
                      </option>
                      <option value={`${opt.value}:desc`}>
                        {opt.label} (Z-A / High-Low)
                      </option>
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <ActiveFilters filters={filters} onChange={handleFilterChange} />

            <div className="mt-5">
              <StatsBar candidates={filteredCandidates} />
            </div>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="surface-panel flex flex-col items-center justify-center gap-5 px-6 py-20 text-center fade-in">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/80 bg-[var(--surface-soft)]">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  No candidates match your search
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-inverse)] px-5 py-3 text-sm font-semibold text-[var(--surface-inverse-foreground)] transition-transform hover:-translate-y-0.5"
              >
                <RotateCcw className="h-4 w-4" />
                Reset all filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="numeric font-semibold text-foreground">
                    {filteredCandidates.length}
                  </span>{" "}
                  of{" "}
                  <span className="numeric font-semibold text-foreground">
                    {initialCandidates.length}
                  </span>{" "}
                  candidates
                </p>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
