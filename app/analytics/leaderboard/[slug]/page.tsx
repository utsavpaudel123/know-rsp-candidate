import type { Metadata } from "next";
import { getCandidates } from "@/lib/getCandidates";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
    formatNumber,
    formatPercent,
    formatRatio,
    toPerformanceCandidate,
    type LeaderboardItem,
    type PerformanceCandidate,
} from "../../utils";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type MetricConfig = {
  title: string;
  description: string;
  getItems: (candidates: PerformanceCandidate[]) => LeaderboardItem[];
};

const metrics: Record<string, MetricConfig> = {
  "top-votes": {
    title: "Top Vote Totals",
    description: "MPs with the highest raw vote counts.",
    getItems: (candidates) =>
      [...candidates]
        .sort((a, b) => b.votesReceived - a.votesReceived)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatNumber(candidate.votesReceived),
          detail: `${formatPercent(candidate.voteSharePercent)} share vs ${
            candidate.runnerUpName
          } on ${formatNumber(candidate.runnerUpVotes)} votes.`,
        })),
  },
  "highest-vote-shares": {
    title: "Highest Vote Shares",
    description: "MPs who captured the largest share of valid votes.",
    getItems: (candidates) =>
      [...candidates]
        .sort((a, b) => b.voteSharePercent - a.voteSharePercent)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatPercent(candidate.voteSharePercent, 2),
          detail: `${formatNumber(candidate.votesReceived)} winner votes from ${formatNumber(
            candidate.totalValidVotes,
          )} valid votes.`,
        })),
  },
  "biggest-margins": {
    title: "Biggest Win Margins",
    description: "Largest vote gaps over the closest opponent.",
    getItems: (candidates) =>
      [...candidates]
        .sort((a, b) => b.winMargin - a.winMargin)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatNumber(candidate.winMargin),
          detail: `${formatPercent(candidate.winMarginPercent, 2)} margin over ${
            candidate.runnerUpName
          }.`,
        })),
  },
  "strongest-ratios": {
    title: "Strongest Winner/Opponent Ratios",
    description:
      "Where the winner’s vote pile most clearly outweighed the runner-up.",
    getItems: (candidates) =>
      [...candidates]
        .filter((c) => c.winnerRunnerUpRatio != null)
        .sort(
          (a, b) => (b.winnerRunnerUpRatio ?? 0) - (a.winnerRunnerUpRatio ?? 0),
        )
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatRatio(candidate.winnerRunnerUpRatio ?? 0),
          detail: `${formatPercent(candidate.voteSharePercent)} vs ${formatPercent(
            candidate.runnerUpSharePercent,
          )} for ${candidate.runnerUpName}.`,
        })),
  },
  "closest-races": {
    title: "Closest Races by Margin %",
    description:
      "Seats where the winner’s lead over the closest opponent was smallest as a share of valid votes.",
    getItems: (candidates) =>
      [...candidates]
        .sort((a, b) => a.winMarginPercent - b.winMarginPercent)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatPercent(candidate.winMarginPercent, 2),
          detail: `${formatNumber(candidate.winMargin)} votes separating ${
            candidate.name
          } from ${candidate.runnerUpName}.`,
        })),
  },
  "largest-vote-pools": {
    title: "Largest Valid Vote Pools",
    description: "Constituencies with the biggest valid-vote base.",
    getItems: (candidates) =>
      [...candidates]
        .sort((a, b) => b.totalValidVotes - a.totalValidVotes)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatNumber(candidate.totalValidVotes),
          detail: `${formatNumber(candidate.votesReceived)} winner votes and ${formatPercent(
            candidate.voteSharePercent,
          )} share.`,
        })),
  },
};

export async function generateStaticParams() {
  return Object.keys(metrics).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const metric = metrics[slug];
  if (!metric) return {};

  return {
    title: `${metric.title} – Full Ranking | RSP Election Analytics`,
    description: `Complete ranking of RSP MPs by ${metric.title.toLowerCase()}. ${metric.description} Nepal 2026 General Election data.`,
    alternates: {
      canonical: `/analytics/leaderboard/${slug}`,
    },
    openGraph: {
      title: `${metric.title} – Full Ranking`,
      description: metric.description,
      url: `/analytics/leaderboard/${slug}`,
    },
  };
}

export default async function LeaderboardPage({ params }: PageProps) {
  const { slug } = await params;
  const metric = metrics[slug];

  if (!metric) {
    notFound();
  }

  const candidates = getCandidates();
  const performanceCandidates = candidates
    .map(toPerformanceCandidate)
    .filter(
      (candidate): candidate is PerformanceCandidate => candidate !== null,
    );

  const items = metric.getItems(performanceCandidates);

  return (
    <div className="page-shell-wide page-section">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/analytics#${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analytics
        </Link>

        <div className="mt-8 space-y-2">
          <p className="section-kicker">Full Ranking</p>
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-4xl">
            {metric.title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            {metric.description}
          </p>
        </div>

        <div className="surface-card mt-10 overflow-hidden p-6 sm:p-7">
          <div className="divide-y divide-border/70">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid gap-3 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/80 bg-[var(--surface-soft)] text-sm font-semibold text-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-foreground sm:text-lg">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {item.constituency}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>

                <div className="shrink-0 pt-1 text-left sm:text-right">
                  <p className="numeric text-xl font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
