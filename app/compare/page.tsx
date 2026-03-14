"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calendar,
  GraduationCap,
  MapPin,
  Scale,
  Trophy,
  UserRound,
} from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getCandidates } from "@/lib/getCandidates";
import type { Candidate } from "@/lib/types";

function getTopEducation(candidate: Candidate): string {
  const order = ["PhD", "Masters", "Bachelors", "+2", "Intermediate", "SLC", "Other"];
  if (!candidate.education || candidate.education.length === 0) return "N/A";
  const sorted = [...candidate.education].sort(
    (a, b) => order.indexOf(a.level) - order.indexOf(b.level)
  );
  return sorted[0]?.degree ?? sorted[0]?.level ?? "N/A";
}

const METRIC_ROWS: {
  key: string;
  label: string;
  icon: React.ReactNode;
  render: (c: Candidate) => string | null;
}[] = [
  {
    key: "electionType",
    label: "Election Type",
    icon: <Scale className="h-3.5 w-3.5" />,
    render: (c) => c.electionType,
  },
  {
    key: "province",
    label: "Province",
    icon: <MapPin className="h-3.5 w-3.5" />,
    render: (c) => c.constituency.province,
  },
  {
    key: "district",
    label: "District",
    icon: <MapPin className="h-3.5 w-3.5" />,
    render: (c) => c.constituency.district,
  },
  {
    key: "constituency",
    label: "Constituency",
    icon: <MapPin className="h-3.5 w-3.5" />,
    render: (c) => c.constituency.name,
  },
  {
    key: "age",
    label: "Age",
    icon: <Calendar className="h-3.5 w-3.5" />,
    render: (c) => (c.age != null ? `${c.age} years` : null),
  },
  {
    key: "gender",
    label: "Gender",
    icon: <UserRound className="h-3.5 w-3.5" />,
    render: (c) => c.gender ?? null,
  },
  {
    key: "profession",
    label: "Profession",
    icon: <Briefcase className="h-3.5 w-3.5" />,
    render: (c) => c.profession ?? null,
  },
  {
    key: "education",
    label: "Top Education",
    icon: <GraduationCap className="h-3.5 w-3.5" />,
    render: (c) => getTopEducation(c),
  },
  {
    key: "educationInstitution",
    label: "Top Institution",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    render: (c) => {
      const order = ["PhD", "Masters", "Bachelors", "+2", "Intermediate", "SLC", "Other"];
      if (!c.education || c.education.length === 0) return null;
      const sorted = [...c.education].sort(
        (a, b) => order.indexOf(a.level) - order.indexOf(b.level)
      );
      return sorted[0]?.institution ?? null;
    },
  },
  {
    key: "voteShare",
    label: "Vote Share",
    icon: <Trophy className="h-3.5 w-3.5" />,
    render: (c) =>
      c.voteSharePercent != null ? `${c.voteSharePercent.toFixed(1)}%` : null,
  },
  {
    key: "totalVotes",
    label: "Total Votes",
    icon: <Trophy className="h-3.5 w-3.5" />,
    render: (c) =>
      c.totalValidVotes != null ? c.totalValidVotes.toLocaleString() : null,
  },
  {
    key: "winMargin",
    label: "Win Margin",
    icon: <Trophy className="h-3.5 w-3.5" />,
    render: (c) =>
      c.winMargin != null ? c.winMargin.toLocaleString() : null,
  },
];

export default function ComparePage() {
  const { selectedIds, clearAll } = useCompare();
  const allCandidates = useMemo(() => getCandidates(), []);

  const candidates = useMemo(
    () =>
      selectedIds
        .map((id) => allCandidates.find((c) => c.id === id))
        .filter((c): c is Candidate => c !== undefined),
    [selectedIds, allCandidates]
  );

  if (candidates.length === 0) {
    return (
      <div className="page-shell-wide page-section">
        <div className="surface-card flex flex-col items-center gap-6 p-12 text-center">
          <Scale className="h-12 w-12 text-muted-foreground/30" />
          <div>
            <h1 className="font-display text-2xl font-semibold text-foreground">
              No candidates selected
            </h1>
            <p className="mt-2 text-muted-foreground">
              Go to the directory and select up to 5 candidates to compare
              side-by-side.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--rsp-blue)] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell-wide page-section">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="section-kicker">Side-by-side comparison</p>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            Compare Candidates
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-[var(--surface-strong)] px-4 py-2.5 text-sm font-medium text-foreground hover:border-[var(--rsp-blue)]/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <button
            onClick={clearAll}
            className="rounded-full border border-border/80 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-destructive/50 hover:text-destructive"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Candidate header row */}
      <div className="surface-card mb-4 overflow-hidden">
        <div
          className="grid divide-x divide-border/70"
          style={{ gridTemplateColumns: `200px repeat(${candidates.length}, minmax(0,1fr))` }}
        >
          <div className="p-4" />
          {candidates.map((candidate) => (
            <div key={candidate.id} className="flex flex-col items-center gap-3 p-5">
              {candidate.photo ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-[1.5rem] border border-border/80">
                  <Image
                    src={candidate.photo}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-xl font-bold text-white"
                  style={{ backgroundColor: "var(--rsp-blue)" }}
                >
                  {candidate.name.charAt(0)}
                </div>
              )}
              <div className="text-center">
                <p className="font-semibold text-foreground">{candidate.name}</p>
                {candidate.nameNepali && (
                  <p className="text-xs text-muted-foreground">{candidate.nameNepali}</p>
                )}
              </div>
              <Link
                href={`/candidate/${candidate.id}`}
                className="text-xs font-medium text-[var(--rsp-blue)] underline-offset-2 hover:underline"
              >
                Full profile
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Metric rows */}
      <div className="surface-card overflow-hidden">
        {METRIC_ROWS.map((row, rowIdx) => {
          const values = candidates.map((c) => row.render(c));
          const hasAny = values.some((v) => v !== null);
          if (!hasAny) return null;

          return (
            <div
              key={row.key}
              className={`grid divide-x divide-border/70 ${
                rowIdx % 2 === 0 ? "bg-transparent" : "bg-[var(--surface-soft)]/40"
              }`}
              style={{ gridTemplateColumns: `200px repeat(${candidates.length}, minmax(0,1fr))` }}
            >
              <div className="flex items-center gap-2 p-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {row.icon}
                <span>{row.label}</span>
              </div>
              {candidates.map((candidate, ci) => {
                const value = row.render(candidate);
                return (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-center p-4 text-center text-sm font-medium text-foreground"
                  >
                    {value ?? (
                      <span className="text-muted-foreground/40">&mdash;</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
