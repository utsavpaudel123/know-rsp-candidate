"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Calendar,
  GraduationCap,
  Link2,
  MapPin,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Candidate } from "@/lib/types";
import CompareToggleButton from "@/components/CompareToggleButton";

interface CandidateCardProps {
  candidate: Candidate;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 0)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getTopEducation(candidate: Candidate): string | null {
  if (!candidate.education || candidate.education.length === 0) {
    return null;
  }

  const order = ["PhD", "Masters", "Bachelors", "+2", "Intermediate", "SLC", "Other"];
  const top = [...candidate.education].sort(
    (a, b) => order.indexOf(a.level) - order.indexOf(b.level)
  )[0];

  return top?.degree ?? top?.level ?? null;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const {
    id,
    name,
    nameNepali,
    photo,
    constituency,
    electionType,
    voteSharePercent,
    winMargin,
    profession,
    age,
    socials,
  } = candidate;
  const topEducation = getTopEducation(candidate);

  return (
    <Link href={`/candidate/${id}`} className="group block h-full">
      <Card className="h-full cursor-pointer border-border/80 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--rsp-blue)]/30 hover:shadow-[0_20px_48px_rgba(12,15,22,0.12)]">
        <CardHeader className="pb-0">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              {photo ? (
                <div className="h-16 w-16 overflow-hidden rounded-[1.5rem] border border-border/80 bg-muted/40 shadow-sm">
                  <img
                    src={photo}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-lg font-bold text-white"
                  style={{ backgroundColor: "var(--rsp-blue)" }}
                  aria-label={`${name} initials`}
                >
                  {getInitials(name)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-snug text-foreground">
                    {name}
                  </p>
                  {nameNepali && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {nameNepali}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
                    electionType === "FPTP"
                      ? "bg-[var(--rsp-blue)] text-white"
                      : "bg-[var(--rsp-green)] text-white"
                  }`}
                  style={
                    electionType === "FPTP"
                      ? { backgroundColor: "var(--rsp-blue)" }
                      : {}
                  }
                >
                  {electionType}
                </span>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="line-clamp-1 font-medium text-foreground">
                    {constituency.name}
                  </p>
                  <p className="line-clamp-1">
                    {constituency.district}, {constituency.province}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex h-full flex-col gap-4 pt-5">
          <div className="grid gap-2 sm:grid-cols-2">
            {profession && (
              <DetailTile icon={<Briefcase className="h-3.5 w-3.5" />} label="Profession">
                {profession}
              </DetailTile>
            )}
            {age != null && (
              <DetailTile icon={<Calendar className="h-3.5 w-3.5" />} label="Age">
                {age} years
              </DetailTile>
            )}
            {topEducation && (
              <DetailTile
                icon={<GraduationCap className="h-3.5 w-3.5" />}
                label="Top education"
              >
                {topEducation}
              </DetailTile>
            )}
            {socials && socials.length > 0 && (
              <DetailTile icon={<Link2 className="h-3.5 w-3.5" />} label="Official links">
                {socials.length} available
              </DetailTile>
            )}
          </div>

          {voteSharePercent != null && (
            <div className="rounded-[1.4rem] border border-border/80 bg-[var(--surface-soft)] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Vote share
                </span>
                <span className="numeric text-sm font-semibold text-foreground">
                  {voteSharePercent.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(voteSharePercent, 100)}%`,
                    backgroundColor: "var(--rsp-blue)",
                  }}
                />
              </div>
              {winMargin != null && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Trophy className="h-4 w-4 text-[var(--rsp-green)]" />
                  <span className="numeric font-semibold text-foreground">
                    {winMargin.toLocaleString()}
                  </span>
                  <span>vote margin</span>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4 text-sm">
            <span className="font-medium text-foreground">Open full profile</span>
            <div className="flex items-center gap-2">
              <CompareToggleButton candidateId={id} variant="compact" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DetailTile({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-[var(--surface-soft)] px-3 py-3">
      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-foreground">
        {children}
      </p>
    </div>
  );
}
