import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ChartColumnBig,
  Database,
  ListChecks,
  Users,
  Vote,
} from "lucide-react";
import { getCandidates } from "@/lib/getCandidates";
import CandidateGrid from "@/components/CandidateGrid";

const HOME_SHARE_IMAGE = "/rsp-share-preview.jpg";

export const metadata: Metadata = {
  title: "Know RSP | All 125 RSP Members of Parliament – Nepal 2026 Election",
  description:
    "Browse all 125 RSP Members of Parliament elected in Nepal's 2026 General Election. Search by name, constituency, province, education, or election performance. Verified profiles with social links and vote-share data.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Know Your RSP Representative – 125 MPs from Nepal's 2026 Election",
    description:
      "Search and explore all RSP Members of Parliament. Verified profiles, education, constituency data, and election performance analytics.",
    url: "/",
    images: [
      {
        url: HOME_SHARE_IMAGE,
        width: 1024,
        height: 576,
        alt: "Know RSP – Complete directory of RSP Members of Parliament from Nepal's 2026 General Election",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Your RSP Representative – 125 MPs from Nepal's 2026 Election",
    description:
      "Search and explore all RSP Members of Parliament. Verified profiles, education, constituency data, and election performance analytics.",
    images: [HOME_SHARE_IMAGE],
  },
};

export default function HomePage() {
  const candidates = getCandidates();

  const totalMPs = candidates.length;
  const fptpCount = candidates.filter((c) => c.electionType === "FPTP").length;
  const prCount = candidates.filter((c) => c.electionType === "PR").length;
  const withEducation = candidates.filter((c) => c.education?.length).length;
  const withSocials = candidates.filter((c) => c.socials?.length).length;
  const withVoteData = candidates.filter((c) => c.voteSharePercent != null).length;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Know RSP",
    alternateName: "Know Your RSP Representative",
    url: "https://knowrspmp.vercel.app",
    description:
      "A civic directory of RSP Members of Parliament from Nepal's 2026 General Election.",
    publisher: {
      "@type": "Organization",
      name: "Know RSP",
      url: "https://knowrspmp.vercel.app",
    },
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RSP Members of Parliament",
    description: "All RSP MPs elected in Nepal's 2026 General Election",
    numberOfItems: totalMPs,
    itemListElement: candidates.slice(0, 30).map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://knowrspmp.vercel.app/candidate/${c.id}`,
      name: c.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    <div>
      <section className="page-shell-wide page-section">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="surface-contrast overflow-hidden p-8 sm:p-10 lg:p-12">
            <p
              className="section-kicker"
              style={{
                color:
                  "color-mix(in srgb, var(--surface-inverse-foreground) 68%, transparent)",
              }}
            >
              2026 Nepal General Election
            </p>
            <h1 className="display-title mt-4 max-w-4xl text-[var(--surface-inverse-foreground)]">
              Know the people behind RSP&apos;s parliamentary wins.
            </h1>
            <p
              className="mt-5 max-w-2xl text-base leading-7 sm:text-lg"
              style={{
                color:
                  "color-mix(in srgb, var(--surface-inverse-foreground) 76%, transparent)",
              }}
            >
              Explore elected representatives through profiles, education, verified
              links, constituency context, and detailed vote-performance data in a
              single public directory.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#directory"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-inverse-foreground)] px-5 py-3 text-sm font-semibold text-[var(--surface-inverse)] transition-transform hover:-translate-y-0.5"
              >
                Browse directory
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/analytics"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold text-[var(--surface-inverse-foreground)] transition-colors"
                style={{
                  borderColor: "var(--surface-inverse-border)",
                  backgroundColor: "var(--surface-inverse-muted)",
                }}
              >
                Open analytics
                <ChartColumnBig className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-full border bg-transparent px-5 py-3 text-sm font-semibold transition-colors hover:text-[var(--surface-inverse-foreground)]"
                style={{
                  borderColor: "var(--surface-inverse-border)",
                  color:
                    "color-mix(in srgb, var(--surface-inverse-foreground) 80%, transparent)",
                }}
              >
                Read methodology
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <HeroMetric
                icon={<Users className="h-4 w-4" />}
                label="Profiles tracked"
                value={totalMPs}
              />
              <HeroMetric
                icon={<Vote className="h-4 w-4" />}
                label="FPTP races"
                value={fptpCount}
              />
              <HeroMetric
                icon={<ListChecks className="h-4 w-4" />}
                label="PR seats"
                value={prCount}
              />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="surface-card p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="section-kicker">Coverage snapshot</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                    What is already mapped
                  </h2>
                </div>
                <div className="rounded-full border border-border/80 bg-[var(--surface-soft)] p-2 text-[var(--rsp-blue)]">
                  <Database className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <SnapshotRow
                  label="Education records"
                  value={`${withEducation}/${totalMPs}`}
                  helper="Structured education details linked to MP profiles."
                />
                <SnapshotRow
                  label="Official social links"
                  value={`${withSocials}/${totalMPs}`}
                  helper="Only clearly official or verified pages are included."
                />
                <SnapshotRow
                  label="Vote-share coverage"
                  value={`${withVoteData}/${totalMPs}`}
                  helper="MP pages and analytics now include vote performance."
                />
              </div>
            </div>

            <div className="surface-panel p-6 sm:p-7">
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-border/80 bg-[var(--surface-soft)] p-2 text-[var(--rsp-green)]">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="section-kicker">Why this version feels different</p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    The browsing experience is tuned like an election report, not a
                    plain index.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Search, filters, cards, analytics, and profile pages are being
                    refit into a more editorial, higher-trust presentation inspired by
                    newsroom-style results boards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="directory" className="page-shell-wide page-section pt-2">
        <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-3">
            <p className="section-kicker">Browse the directory</p>
            <h2 className="section-title max-w-4xl text-foreground">
              Search by name, constituency, province, education, or election
              performance.
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
              Every card surfaces the most important profile details first, while the
              filter stack helps compare representation across provinces, election
              types, demographics, and results.
            </p>
          </div>

          <div className="surface-panel px-4 py-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalMPs}</span> MPs
            indexed across direct and proportional seats.
          </div>
        </div>

        <CandidateGrid initialCandidates={candidates} />
      </section>
    </div>
    </>
  );
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div
      className="rounded-[1.5rem] border px-4 py-4 text-[var(--surface-inverse-foreground)]"
      style={{
        borderColor: "var(--surface-inverse-border)",
        backgroundColor: "var(--surface-inverse-muted)",
      }}
    >
      <div
        className="flex items-center gap-2 text-sm"
        style={{
          color:
            "color-mix(in srgb, var(--surface-inverse-foreground) 70%, transparent)",
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <p className="numeric mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="grid gap-2 border-t border-border/70 pt-4 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{helper}</p>
      </div>
      <div className="numeric text-2xl font-semibold text-foreground sm:text-right">
        {value}
      </div>
    </div>
  );
}
