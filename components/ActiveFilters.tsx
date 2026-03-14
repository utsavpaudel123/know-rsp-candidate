"use client";

import { X } from "lucide-react";
import type { CandidateFilters } from "@/lib/types";

interface ActiveFiltersProps {
  filters: CandidateFilters;
  onChange: (f: CandidateFilters) => void;
}

interface FilterChip {
  label: string;
  onRemove: () => void;
}

export default function ActiveFilters({ filters, onChange }: ActiveFiltersProps) {
  const chips: FilterChip[] = [];

  filters.provinces.forEach((p) =>
    chips.push({
      label: p,
      onRemove: () =>
        onChange({ ...filters, provinces: filters.provinces.filter((v) => v !== p) }),
    })
  );

  filters.districts.forEach((d) =>
    chips.push({
      label: d,
      onRemove: () =>
        onChange({ ...filters, districts: filters.districts.filter((v) => v !== d) }),
    })
  );

  filters.electionType.forEach((et) =>
    chips.push({
      label: et,
      onRemove: () =>
        onChange({
          ...filters,
          electionType: filters.electionType.filter((v) => v !== et),
        }),
    })
  );

  filters.gender.forEach((g) =>
    chips.push({
      label: g,
      onRemove: () =>
        onChange({ ...filters, gender: filters.gender.filter((v) => v !== g) }),
    })
  );

  filters.educationLevels.forEach((el) =>
    chips.push({
      label: el,
      onRemove: () =>
        onChange({
          ...filters,
          educationLevels: filters.educationLevels.filter((v) => v !== el),
        }),
    })
  );

  filters.professionCategories.forEach((pc) =>
    chips.push({
      label: pc,
      onRemove: () =>
        onChange({
          ...filters,
          professionCategories: filters.professionCategories.filter((v) => v !== pc),
        }),
    })
  );

  if (filters.ageMin > 0 || filters.ageMax < 120) {
    const ageLabel =
      filters.ageMax < 120
        ? `Age: ${filters.ageMin}\u2013${filters.ageMax}`
        : `Age: ${filters.ageMin}+`;
    chips.push({
      label: ageLabel,
      onRemove: () => onChange({ ...filters, ageMin: 0, ageMax: 120 }),
    });
  }

  if (filters.voteShareMin > 0 || filters.voteShareMax < 100) {
    const vsLabel =
      filters.voteShareMax < 100
        ? `Vote share: ${filters.voteShareMin}\u2013${filters.voteShareMax}%`
        : `Vote share: ${filters.voteShareMin}%+`;
    chips.push({
      label: vsLabel,
      onRemove: () => onChange({ ...filters, voteShareMin: 0, voteShareMax: 100 }),
    });
  }

  if (filters.winMarginMin > 0) {
    chips.push({
      label: `Win margin: ${filters.winMarginMin}+`,
      onRemove: () => onChange({ ...filters, winMarginMin: 0 }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Active filters
      </span>
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--rsp-blue)]/20 bg-[var(--rsp-blue)]/5 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/10"
        >
          {chip.label}
          <X className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-destructive" />
        </button>
      ))}
      <button
        onClick={() =>
          onChange({
            ...filters,
            provinces: [],
            districts: [],
            educationLevels: [],
            ageMin: 0,
            ageMax: 120,
            gender: [],
            voteShareMin: 0,
            voteShareMax: 100,
            electionType: [],
            winMarginMin: 0,
            professionCategories: [],
          })
        }
        className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
