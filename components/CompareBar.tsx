"use client";

import Link from "next/link";
import { ArrowRight, Scale, X } from "lucide-react";
import { useCompare } from "@/lib/compare-context";
import { getCandidates } from "@/lib/getCandidates";
import { useMemo } from "react";

export default function CompareBar() {
  const { selectedIds, removeCandidate, clearAll, count } = useCompare();
  const allCandidates = useMemo(() => getCandidates(), []);

  if (count === 0) return null;

  const selected = selectedIds
    .map((id) => allCandidates.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 px-4 sm:px-6 pointer-events-none">
      <div className="page-shell-wide pointer-events-auto">
        <div className="surface-card overflow-hidden border-border/80 shadow-[0_-8px_40px_rgba(12,15,22,0.15)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Scale className="h-4 w-4 text-[var(--rsp-blue)]" />
              <span className="hidden sm:inline">Compare</span>
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--rsp-blue)] px-2 text-xs font-bold text-white">
                {count}
              </span>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
              {selected.map((candidate) => {
                if (!candidate) return null;
                return (
                  <div
                    key={candidate.id}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-[var(--surface-soft)] py-1.5 pl-3 pr-1.5"
                  >
                    {candidate.photo ? (
                      <img
                        src={candidate.photo}
                        alt=""
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[0.6rem] font-bold text-white"
                        style={{ backgroundColor: "var(--rsp-blue)" }}
                      >
                        {candidate.name.charAt(0)}
                      </span>
                    )}
                    <span className="max-w-24 truncate text-xs font-medium text-foreground sm:max-w-32">
                      {candidate.name.split(" ")[0]}
                    </span>
                    <button
                      onClick={() => removeCandidate(candidate.id)}
                      className="flex h-5 w-5 items-center justify-center rounded-full transition-colors hover:bg-destructive/10"
                      aria-label={`Remove ${candidate.name} from comparison`}
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={clearAll}
                className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Clear
              </button>
              {count >= 2 ? (
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--rsp-blue)] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Compare
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="rounded-full border border-border/80 bg-[var(--surface-soft)] px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Add {2 - count} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
