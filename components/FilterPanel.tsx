"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw, SlidersHorizontal } from "lucide-react";
import { CandidateFilters, EducationLevel } from "@/lib/types";
import { ALL_DISTRICTS, PROFESSION_CATEGORIES } from "@/lib/candidates";

interface FilterPanelProps {
  filters: CandidateFilters;
  onChange: (f: CandidateFilters) => void;
  totalCount: number;
  filteredCount: number;
}

const PROVINCES = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const EDUCATION_LEVELS: { level: EducationLevel; label: string }[] = [
  { level: "SLC", label: "SLC (Grade 10)" },
  { level: "Intermediate", label: "Intermediate" },
  { level: "+2", label: "+2 / A-Level" },
  { level: "Bachelors", label: "Bachelors" },
  { level: "Masters", label: "Masters" },
  { level: "PhD", label: "PhD / Doctorate" },
  { level: "Other", label: "Other" },
];

const GENDERS = ["Male", "Female", "Other"];
const ELECTION_TYPES = ["FPTP", "PR"];

function SectionHeader({
  title,
  expanded,
  onToggle,
  badge,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-3 py-1 text-left text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
    >
      <span className="flex items-center gap-2">
        {title}
        {badge ? (
          <span
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold text-white"
            style={{ backgroundColor: "var(--rsp-blue)" }}
          >
            {badge}
          </span>
        ) : null}
      </span>
      {expanded ? (
        <ChevronUp className="h-4 w-4 shrink-0" />
      ) : (
        <ChevronDown className="h-4 w-4 shrink-0" />
      )}
    </button>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-[1rem] border border-transparent px-2 py-2 text-sm text-muted-foreground transition-colors hover:border-border/70 hover:bg-[var(--surface-soft)] hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-border accent-[var(--rsp-blue)]"
      />
      <span className="leading-5">{label}</span>
    </label>
  );
}

function toggleInArray(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

function toggleEducationLevel(
  arr: EducationLevel[],
  value: EducationLevel
): EducationLevel[] {
  return arr.includes(value)
    ? arr.filter((v) => v !== value)
    : [...arr, value];
}

export default function FilterPanel({
  filters,
  onChange,
  totalCount,
  filteredCount,
}: FilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    province: true,
    district: false,
    electionType: true,
    gender: true,
    profession: false,
    education: false,
    age: false,
    voteShare: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = () => {
    onChange({
      query: filters.query,
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
    });
    setDistrictSearch("");
  };

  const hasActiveFilters =
    filters.provinces.length > 0 ||
    filters.districts.length > 0 ||
    filters.educationLevels.length > 0 ||
    filters.gender.length > 0 ||
    filters.electionType.length > 0 ||
    filters.professionCategories.length > 0 ||
    filters.ageMin > 0 ||
    filters.ageMax < 120 ||
    filters.voteShareMin > 0 ||
    filters.voteShareMax < 100 ||
    filters.winMarginMin > 0;

  const activeCount =
    filters.provinces.length +
    filters.districts.length +
    filters.gender.length +
    filters.educationLevels.length +
    filters.electionType.length +
    filters.professionCategories.length;

  const visibleDistricts = districtSearch.trim()
    ? ALL_DISTRICTS.filter((d) =>
        d.toLowerCase().includes(districtSearch.toLowerCase())
      )
    : ALL_DISTRICTS;

  const panelContent = (
    <div className="flex flex-col gap-4">
      <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] p-4">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Current result set
        </p>
        <p className="numeric mt-2 text-3xl font-semibold text-foreground">
          {filteredCount}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} candidates
        </p>
      </div>

      {/* Province */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Province"
          expanded={!!expandedSections.province}
          onToggle={() => toggleSection("province")}
          badge={filters.provinces.length || undefined}
        />
        {expandedSections.province && (
          <div className="grid gap-1">
            {PROVINCES.map((p) => (
              <CheckboxItem
                key={p}
                label={p}
                checked={filters.provinces.includes(p)}
                onChange={() =>
                  onChange({
                    ...filters,
                    provinces: toggleInArray(filters.provinces, p),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* District */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="District"
          expanded={!!expandedSections.district}
          onToggle={() => toggleSection("district")}
          badge={filters.districts.length || undefined}
        />
        {expandedSections.district && (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="Search district..."
              className="h-9 w-full rounded-full border border-input bg-[var(--surface-strong)] px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <div className="grid max-h-48 gap-0.5 overflow-y-auto pr-1">
              {visibleDistricts.map((d) => (
                <CheckboxItem
                  key={d}
                  label={d}
                  checked={filters.districts.includes(d)}
                  onChange={() =>
                    onChange({
                      ...filters,
                      districts: toggleInArray(filters.districts, d),
                    })
                  }
                />
              ))}
              {visibleDistricts.length === 0 && (
                <p className="px-2 py-2 text-xs text-muted-foreground">
                  No districts match.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Election Type */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Election Type"
          expanded={!!expandedSections.electionType}
          onToggle={() => toggleSection("electionType")}
          badge={filters.electionType.length || undefined}
        />
        {expandedSections.electionType && (
          <div className="grid gap-1">
            {ELECTION_TYPES.map((et) => (
              <CheckboxItem
                key={et}
                label={
                  et === "FPTP"
                    ? "FPTP (First Past The Post)"
                    : "PR (Proportional Representation)"
                }
                checked={filters.electionType.includes(et)}
                onChange={() =>
                  onChange({
                    ...filters,
                    electionType: toggleInArray(filters.electionType, et),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Gender"
          expanded={!!expandedSections.gender}
          onToggle={() => toggleSection("gender")}
          badge={filters.gender.length || undefined}
        />
        {expandedSections.gender && (
          <div className="grid gap-1">
            {GENDERS.map((g) => (
              <CheckboxItem
                key={g}
                label={g}
                checked={filters.gender.includes(g)}
                onChange={() =>
                  onChange({
                    ...filters,
                    gender: toggleInArray(filters.gender, g),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Profession */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Profession"
          expanded={!!expandedSections.profession}
          onToggle={() => toggleSection("profession")}
          badge={filters.professionCategories.length || undefined}
        />
        {expandedSections.profession && (
          <div className="grid gap-1">
            {PROFESSION_CATEGORIES.map((cat) => (
              <CheckboxItem
                key={cat.label}
                label={cat.label}
                checked={filters.professionCategories.includes(cat.label)}
                onChange={() =>
                  onChange({
                    ...filters,
                    professionCategories: toggleInArray(
                      filters.professionCategories,
                      cat.label
                    ),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Education */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Highest Education"
          expanded={!!expandedSections.education}
          onToggle={() => toggleSection("education")}
          badge={filters.educationLevels.length || undefined}
        />
        {expandedSections.education && (
          <div className="grid gap-1">
            <p className="px-2 text-[0.7rem] text-muted-foreground">
              Filters by each MP&apos;s highest qualification.
            </p>
            {EDUCATION_LEVELS.map(({ level, label }) => (
              <CheckboxItem
                key={level}
                label={label}
                checked={filters.educationLevels.includes(level)}
                onChange={() =>
                  onChange({
                    ...filters,
                    educationLevels: toggleEducationLevel(
                      filters.educationLevels,
                      level
                    ),
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Age Range */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Age Range"
          expanded={!!expandedSections.age}
          onToggle={() => toggleSection("age")}
        />
        {expandedSections.age && (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              min={0}
              max={120}
              value={filters.ageMin || ""}
              onChange={(e) =>
                onChange({ ...filters, ageMin: Number(e.target.value) || 0 })
              }
              placeholder="Min"
              className="h-11 rounded-full border border-input bg-[var(--surface-strong)] px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <input
              type="number"
              min={0}
              max={120}
              value={filters.ageMax === 120 ? "" : filters.ageMax}
              onChange={(e) =>
                onChange({
                  ...filters,
                  ageMax: Number(e.target.value) || 120,
                })
              }
              placeholder="Max"
              className="h-11 rounded-full border border-input bg-[var(--surface-strong)] px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        )}
      </div>

      {/* Vote Share */}
      <div className="space-y-3 border-b border-border/70 pb-4">
        <SectionHeader
          title="Vote Share %"
          expanded={!!expandedSections.voteShare}
          onToggle={() => toggleSection("voteShare")}
        />
        {expandedSections.voteShare && (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={filters.voteShareMin || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  voteShareMin: Number(e.target.value) || 0,
                })
              }
              placeholder="Min %"
              className="h-11 rounded-full border border-input bg-[var(--surface-strong)] px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
            <span className="text-muted-foreground text-sm">–</span>
            <input
              type="number"
              min={0}
              max={100}
              value={filters.voteShareMax === 100 ? "" : filters.voteShareMax}
              onChange={(e) =>
                onChange({
                  ...filters,
                  voteShareMax: Number(e.target.value) || 100,
                })
              }
              placeholder="Max %"
              className="h-11 rounded-full border border-input bg-[var(--surface-strong)] px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="surface-panel mb-3 flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-foreground"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span
                className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold text-white"
                style={{ backgroundColor: "var(--rsp-blue)" }}
              >
                {activeCount}
              </span>
            )}
          </span>
          {mobileOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {mobileOpen && (
          <div className="surface-card mb-4 p-5">
            {panelContent}
          </div>
        )}
      </div>

      <div className="hidden w-72 shrink-0 lg:block">
        <div className="surface-card sticky top-28 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Refine results</p>
              <h2 className="mt-2 font-display text-xl font-semibold text-foreground">
                Filters
              </h2>
            </div>
            <div className="rounded-full border border-border/80 bg-[var(--surface-soft)] p-2 text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
          </div>
          {panelContent}
        </div>
      </div>
    </>
  );
}
