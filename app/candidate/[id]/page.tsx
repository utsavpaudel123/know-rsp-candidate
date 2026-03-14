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
                    <p>
                      {candidate.constituency.district}, {candidate.constituency.province}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${provinceTone}`}
                  >
                    {candidate.constituency.province}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      candidate.electionType === "FPTP"
                        ? "bg-[var(--rsp-blue)] text-white"
                        : "bg-[var(--rsp-green)] text-white"
                    }`}
                  >
                    {candidate.electionType === "FPTP"
                      ? "First Past the Post"
                      : "Proportional Representation"}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border/80 bg-[var(--surface-soft)] px-3 py-1 text-xs font-semibold text-foreground">
                    {candidate.gender}
                  </span>
                  <CompareToggleButton candidateId={candidate.id} />
                </div>

                <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
                  {candidate.biography ??
                    "Biography is still being compiled from public records and verified sources."}
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <FactCard
                    icon={<UserRound className="h-4 w-4" />}
                    label="Profession"
                    value={candidate.profession ?? "Not yet listed"}
                  />
                  <FactCard
                    icon={<MapPin className="h-4 w-4" />}
                    label="Constituency"
                    value={candidate.constituency.name}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <QuickStat
                icon={<Calendar className="h-4 w-4" />}
                label="Age"
                value={candidate.age !== undefined ? `${candidate.age} years` : "N/A"}
              />
              <QuickStat
                icon={<BookOpen className="h-4 w-4" />}
                label="Top education"
                value={topEducation}
              />
              <QuickStat
                icon={<Trophy className="h-4 w-4" />}
                label="Vote share"
                value={
                  candidate.voteSharePercent !== undefined
                    ? `${candidate.voteSharePercent.toFixed(1)}%`
                    : "N/A"
                }
              />
              <QuickStat
                icon={<Trophy className="h-4 w-4" />}
                label="Win margin"
                value={
                  candidate.winMargin !== undefined
                    ? candidate.winMargin.toLocaleString()
                    : "N/A"
                }
              />
            </div>

            <div className="surface-panel p-5">
              <p className="section-kicker">Verification status</p>
              <p className="mt-3 text-base font-semibold text-foreground">
                Data last verified on {lastVerified}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Profile details are reviewed against public sources and updated as more
                records become available.
              </p>
            </div>

            {candidate.socials && candidate.socials.length > 0 && (
              <SectionCard
                title="Official links"
                description="Only official or clearly attributable candidate pages are shown."
              >
                <SocialLinks socials={candidate.socials} />
              </SectionCard>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="space-y-6">
            <SectionCard
              title="Biography"
              description="Context on the representative's background, public work, and profile."
            >
              <div className="space-y-4">
                <p className="leading-7 text-muted-foreground">
                  {candidate.biography ?? "Biography not yet available."}
                </p>
                {candidate.profession && (
                  <p className="text-sm leading-6 text-muted-foreground">
                    <span className="font-semibold text-foreground">Profession:</span>{" "}
                    {candidate.profession}
                  </p>
                )}
              </div>
            </SectionCard>

            {candidate.education && candidate.education.length > 0 && (
              <SectionCard
                title="Education"
                description="Structured education history extracted from public sources."
              >
                <EducationTimeline education={candidate.education} />
              </SectionCard>
            )}

            {candidate.majorContributions && candidate.majorContributions.length > 0 && (
              <SectionCard
                title="Major contributions"
                description="Public service areas, initiatives, and notable contributions."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {candidate.majorContributions.map((contribution, index) => (
                    <ContributionCard key={index} contribution={contribution} />
                  ))}
                </div>
              </SectionCard>
            )}

            {candidate.previousPositions && candidate.previousPositions.length > 0 && (
              <SectionCard
                title="Previous positions"
                description="Roles and responsibilities held before the current term."
              >
                <ul className="space-y-3">
                  {candidate.previousPositions.map((position, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 rounded-[1.2rem] border border-border/80 bg-[var(--surface-soft)] px-4 py-4 text-sm leading-6 text-muted-foreground"
                    >
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--rsp-blue)" }}
                      />
                      <span>{position}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>

          <div className="space-y-6">
            {candidate.electionType === "FPTP" && candidate.votesReceived !== undefined && (
              <SectionCard
                title="Electoral performance"
                description="Winner-versus-runner-up comparison using constituency vote data."
              >
                <VoteChart candidate={candidate} />
              </SectionCard>
            )}

            {candidate.sources && candidate.sources.length > 0 && (
              <SectionCard
                title="Sources & references"
                description="Primary citations used to verify this candidate profile."
              >
                <SourceLinks sources={candidate.sources} />
              </SectionCard>
            )}

            <div className="surface-panel p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-border/80 bg-[var(--surface-soft)] p-2 text-[var(--rsp-blue)]">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <div>
                  <p className="section-kicker">Profile data</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    This profile combines civic context, candidate background, and
                    election data.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    When information is missing, the page stays intentionally sparse
                    rather than inferring details without a reliable source trail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="surface-card p-6 sm:p-7">
      <div className="mb-5">
        <p className="section-kicker">{title}</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="surface-panel flex min-h-28 flex-col justify-between px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="numeric mt-4 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FactCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-foreground">{value}</p>
    </div>
  );
}
