"use client";

import type { ReactNode } from "react";
import { CalendarRange, CircleUserRound, Users, Vote } from "lucide-react";
import { Candidate } from "@/lib/types";

interface StatsBarProps {
  candidates: Candidate[];
}

export default function StatsBar({ candidates }: StatsBarProps) {
  const total = candidates.length;

  const withAge = candidates.filter((c) => c.age != null);
  const avgAge =
    withAge.length > 0
      ? Math.round(
          withAge.reduce((sum, c) => sum + (c.age ?? 0), 0) / withAge.length
        )
      : null;

  const maleCount = candidates.filter((c) => c.gender === "Male").length;
  const femaleCount = candidates.filter((c) => c.gender === "Female").length;
  const otherCount = candidates.filter((c) => c.gender === "Other").length;

  const femalePercent =
    total > 0 ? Math.round((femaleCount / total) * 100) : 0;

  const fptpCount = candidates.filter((c) => c.electionType === "FPTP").length;
  const prCount = candidates.filter((c) => c.electionType === "PR").length;

  if (total === 0) {
    return (
      <div className="surface-panel px-5 py-4 text-sm text-muted-foreground">
        No MPs to show statistics for.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={<Users className="h-4 w-4" />}
        label="MPs in view"
        value={String(total)}
        helper="Current filtered result set"
      />
      <StatTile
        icon={<CalendarRange className="h-4 w-4" />}
        label="Average age"
        value={avgAge != null ? `${avgAge}` : "N/A"}
        helper={avgAge != null ? "Across profiles with age data" : "Age data unavailable"}
      />
      <StatTile
        icon={<CircleUserRound className="h-4 w-4" />}
        label="Gender balance"
        value={`${femalePercent}%`}
        helper={`${maleCount} men, ${femaleCount} women${otherCount > 0 ? `, ${otherCount} other` : ""}`}
      />
      <StatTile
        icon={<Vote className="h-4 w-4" />}
        label="Seat type mix"
        value={`${fptpCount} / ${prCount}`}
        helper="FPTP vs PR in this selection"
      />
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="surface-panel flex min-h-28 flex-col justify-between px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div>
        <p className="numeric text-3xl font-semibold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
      </div>
    </div>
  );
}
