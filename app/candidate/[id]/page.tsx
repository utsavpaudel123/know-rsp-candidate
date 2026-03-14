import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  ExternalLink,
  MapPin,
  Trophy,
  UserRound,
} from "lucide-react";
import { getCandidates, getCandidateById } from "@/lib/getCandidates";
import type { Candidate } from "@/lib/types";
import EducationTimeline from "@/components/EducationTimeline";
import ContributionCard from "@/components/ContributionCard";
import VoteChart from "@/components/VoteChart";
import SourceLinks from "@/components/SourceLinks";
import SocialLinks from "@/components/SocialLinks";
import CompareToggleButton from "@/components/CompareToggleButton";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const candidates = getCandidates();
  return candidates.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const candidate = getCandidateById(id);
  if (!candidate) {
    return { title: "Candidate Not Found" };
  }

  const title = `${candidate.name} – RSP MP, ${candidate.constituency.name}`;
  return {
    title,
    description: `Profile of ${candidate.name}, RSP Member of Parliament from ${candidate.constituency.name}, ${candidate.constituency.province}. Elected in the 2026 Nepal General Election.`,
    openGraph: {
      title,
      description: `RSP MP from ${candidate.constituency.name}`,
      images: candidate.photo ? [{ url: candidate.photo }] : [],
    },
  };
}

function getTopEducation(candidate: Candidate): string {
  const order = ["PhD", "Masters", "Bachelors", "+2", "Intermediate", "SLC", "Other"];
  if (!candidate.education || candidate.education.length === 0) return "N/A";

  const sorted = [...candidate.education].sort(
    (a, b) => order.indexOf(a.level) - order.indexOf(b.level)
  );
  return sorted[0]?.degree ?? sorted[0]?.level ?? "N/A";
}

function getProvinceTone(province: string): string {
  const tones: Record<string, string> = {
    Koshi: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200",
    Madhesh:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
    Bagmati:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200",
    Gandaki:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
    Lumbini:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-200",
    Karnali: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
    Sudurpashchim:
      "bg-pink-100 text-pink-800 dark:bg-pink-500/15 dark:text-pink-200",
  };

  return tones[province] ?? "bg-slate-100 text-slate-800 dark:bg-slate-500/15 dark:text-slate-200";
}

export default async function CandidateProfilePage({ params }: Props) {
  const { id } = await params;
  const candidate = getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const topEducation = getTopEducation(candidate);
  const provinceTone = getProvinceTone(candidate.constituency.province);
  const lastVerified = new Date(candidate.lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: candidate.name,
    alternateName: candidate.nameNepali,
    birthDate: candidate.dateOfBirth,
    gender: candidate.gender,
    jobTitle: "Member of Parliament",
    affiliation: {
      "@type": "Organization",
      name: "Rastriya Swatantra Party (RSP)",
    },
    url: `https://knowrspcandidate.vercel.app/candidate/${candidate.id}`,
    image: candidate.photo,
    description: candidate.biography,
    sameAs: candidate.socials?.map((social) => social.url) ?? [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="page-shell-wide page-section">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">
                Directory
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="truncate font-medium text-foreground">{candidate.name}</li>
          </ol>
        </nav>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="surface-card overflow-hidden p-6 sm:p-8 lg:p-10">
            <p className="section-kicker">Candidate profile</p>
            <div className="mt-6 flex flex-col gap-6 lg:flex-row">
              <div className="shrink-0">
                {candidate.photo ? (
                  <div className="relative h-44 w-44 overflow-hidden rounded-[2rem] border border-border/80 bg-muted/30 shadow-sm sm:h-52 sm:w-52">
                    <Image
                      src={candidate.photo}
                      alt={candidate.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="surface-contrast flex h-44 w-44 items-center justify-center rounded-[2rem] text-6xl font-semibold sm:h-52 sm:w-52">
                    {candidate.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  {candidate.name}
                </h1>
                {candidate.nameNepali && (
                  <p className="mt-2 text-lg text-muted-foreground">{candidate.nameNepali}</p>
                )}

                <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">
                      {candidate.constituency.name}
                    </p>
                    <p className="text-sm">
                      {candidate.constituency.district},{" "}
                      {candidate.constituency.province}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${
                      candidate.electionType === "FPTP"
                        ? "bg-[var(--rsp-blue)] text-white"
                        : "bg-[var(--rsp-green)] text-white"
                    }`}
                  >
                    {candidate.electionType}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${provinceTone}`}
                  >
                    {candidate.constituency.province}
                  </span>
                  {candidate.gender && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      <UserRound className="h-3 w-3" />
                      {candidate.gender}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <CompareToggleButton candidateId={candidate.id} />
                </div>
              </div>
            </div>

            {candidate.biography && (
              <div className="mt-8 border-t border-border/70 pt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Biography
                </h2>
                <p className="leading-7 text-foreground/90">{candidate.biography}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <StatsCard candidate={candidate} />

            {candidate.education && candidate.education.length > 0 && (
              <div className="surface-card overflow-hidden p-6">
                <SectionHeader icon={<BookOpen className="h-4 w-4" />}>
                  Education
                </SectionHeader>
                <EducationTimeline education={candidate.education} />
              </div>
            )}

            {candidate.socials && candidate.socials.length > 0 && (
              <div className="surface-card overflow-hidden p-6">
                <SectionHeader icon={<ExternalLink className="h-4 w-4" />}>
                  Official Links
                </SectionHeader>
                <SocialLinks socials={candidate.socials} />
              </div>
            )}

            {candidate.sources && candidate.sources.length > 0 && (
              <div className="surface-card overflow-hidden p-6">
                <SectionHeader icon={<ExternalLink className="h-4 w-4" />}>
                  Sources
                </SectionHeader>
                <SourceLinks sources={candidate.sources} />
              </div>
            )}
          </div>
        </section>

        {candidate.contributions && candidate.contributions.length > 0 && (
          <section className="mt-6">
            <div className="surface-card overflow-hidden p-6 sm:p-8">
              <SectionHeader icon={<Trophy className="h-4 w-4" />}>
                Notable Contributions
              </SectionHeader>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {candidate.contributions.map((contribution, idx) => (
                  <ContributionCard key={idx} contribution={contribution} />
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Last verified: {lastVerified}
        </div>
      </div>
    </>
  );
}

function StatsCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="surface-card overflow-hidden p-6">
      <SectionHeader icon={<Trophy className="h-4 w-4" />}>
        Election Performance
      </SectionHeader>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {candidate.age != null && (
          <StatTile
            icon={<Calendar className="h-3.5 w-3.5" />}
            label="Age"
            value={`${candidate.age} yrs`}
          />
        )}
        {candidate.voteSharePercent != null && (
          <StatTile
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Vote Share"
            value={`${candidate.voteSharePercent.toFixed(1)}%`}
          />
        )}
        {candidate.totalVotes != null && (
          <StatTile
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Total Votes"
            value={candidate.totalVotes.toLocaleString()}
          />
        )}
        {candidate.winMargin != null && (
          <StatTile
            icon={<Trophy className="h-3.5 w-3.5" />}
            label="Win Margin"
            value={candidate.winMargin.toLocaleString()}
          />
        )}
      </div>

      {candidate.voteSharePercent != null && (
        <div className="mt-4">
          <VoteChart voteSharePercent={candidate.voteSharePercent} />
        </div>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.2rem] border border-border/70 bg-[var(--surface-soft)] px-3 py-3">
      <div className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="numeric mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SectionHeader({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {icon}
      <span>{children}</span>
    </div>
  );
}
