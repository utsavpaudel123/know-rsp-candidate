"use client";

import { getCandidates } from "@/lib/getCandidates";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const COLORS = [
  "#1a4fa0",
  "#2e7d32",
  "#1976d2",
  "#388e3c",
  "#7b1fa2",
  "#f57c00",
  "#c62828",
  "#00838f",
];

import type {
    InsightItem,
    LeaderboardItem,
    PerformanceCandidate,
    ProvinceSummary,
    SnapshotItem,
} from "./utils";
import {
    average,
    CLOSE_MARGIN_THRESHOLD,
    DOMINANT_RATIO_THRESHOLD,
    DOMINANT_SHARE_THRESHOLD,
    EDUCATION_ORDER,
    formatNumber,
    formatPercent,
    formatRatio,
    getTopEducation,
    TOP_LIST_SIZE,
    toPerformanceCandidate,
} from "./utils";

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <p className="section-kicker">Analytics section</p>
      <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-card p-6 sm:p-7">
      <div className="mb-6">
        <p className="section-kicker">Chart view</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function InsightCard({
  title,
  candidate,
  constituency,
  value,
  detail,
}: InsightItem) {
  return (
    <div className="surface-card p-5 sm:p-6">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>
      <p className="numeric mt-4 text-4xl font-semibold text-foreground">
        {value}
      </p>
      <div className="mt-4 border-t border-border/70 pt-4">
        <p className="text-sm font-semibold text-foreground">{candidate}</p>
        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {constituency}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function SnapshotCard({ label, value, helper }: SnapshotItem) {
  return (
    <div className="surface-panel p-5">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="numeric mt-3 text-3xl font-semibold text-foreground">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</p>
    </div>
  );
}

function LeaderboardCard({
  title,
  description,
  items,
  slug,
  totalCount,
}: {
  title: string;
  description: string;
  items: LeaderboardItem[];
  slug: string;
  totalCount: number;
}) {
  const hasMore = totalCount > TOP_LIST_SIZE;

  return (
    <div
      id={slug}
      className="surface-card overflow-hidden p-6 sm:p-7 scroll-mt-24"
    >
      <div className="flex flex-col gap-2 border-b border-border/70 pb-4">
        <p className="section-kicker">Leaderboard</p>
        <h3 className="font-display text-xl font-semibold text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {items.length === 0 ? (
        <EmptyChart message="No ranking data available." />
      ) : (
        <>
          <div className="mt-2 divide-y divide-border/70">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid gap-3 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-[var(--surface-soft)] text-xs font-semibold text-foreground">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {item.name}
                    </p>
                    <p className="text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
                      {item.constituency}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="numeric text-lg font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <Link
              href={`/analytics/leaderboard/${slug}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-border/80 bg-[var(--surface-soft)] px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70"
            >
              See All ({totalCount})
            </Link>
          )}
        </>
      )}
    </div>
  );
}

function ChartSlot({
  ready,
  hasData,
  children,
  emptyMessage = "No data available.",
}: {
  ready: boolean;
  hasData: boolean;
  children: ReactNode;
  emptyMessage?: string;
}) {
  if (!ready) {
    return <EmptyChart message="Loading chart..." />;
  }

  if (!hasData) {
    return <EmptyChart message={emptyMessage} />;
  }

  return <>{children}</>;
}

function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}) {
  if (
    cx == null ||
    cy == null ||
    midAngle == null ||
    innerRadius == null ||
    outerRadius == null ||
    percent == null
  )
    return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AnalyticsPage() {
  const candidates = useMemo(() => getCandidates(), []);
  const [chartsReady, setChartsReady] = useState(false);

  useEffect(() => {
    setChartsReady(true);
  }, []);

  const performanceCandidates = useMemo(
    () =>
      candidates
        .map(toPerformanceCandidate)
        .filter(
          (candidate): candidate is PerformanceCandidate => candidate !== null,
        ),
    [candidates],
  );

  const educationData = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((candidate) => {
      const level = getTopEducation(candidate);
      if (level) {
        counts[level] = (counts[level] ?? 0) + 1;
      }
    });
    return EDUCATION_ORDER.filter((level) => counts[level]).map((level) => ({
      level,
      count: counts[level] ?? 0,
    }));
  }, [candidates]);

  const ageData = useMemo(() => {
    const groups: Record<string, number> = {
      "20–30": 0,
      "31–40": 0,
      "41–50": 0,
      "51–60": 0,
      "61+": 0,
    };

    candidates.forEach((candidate) => {
      if (candidate.age == null) return;
      if (candidate.age <= 30) groups["20–30"]++;
      else if (candidate.age <= 40) groups["31–40"]++;
      else if (candidate.age <= 50) groups["41–50"]++;
      else if (candidate.age <= 60) groups["51–60"]++;
      else groups["61+"]++;
    });

    return Object.entries(groups).map(([group, count]) => ({ group, count }));
  }, [candidates]);

  const genderData = useMemo(() => {
    const counts: Record<string, number> = { Male: 0, Female: 0, Other: 0 };
    candidates.forEach((candidate) => {
      counts[candidate.gender] = (counts[candidate.gender] ?? 0) + 1;
    });
    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([gender, count]) => ({ gender, count }));
  }, [candidates]);

  const voteShareBandData = useMemo(() => {
    const bands = [
      { label: "50–55%", min: 50, max: 55 },
      { label: "55–60%", min: 55, max: 60 },
      { label: "60–65%", min: 60, max: 65 },
      { label: "65%+", min: 65, max: Number.POSITIVE_INFINITY },
    ];

    return bands.map((band) => ({
      band: band.label,
      count: performanceCandidates.filter(
        (candidate) =>
          candidate.voteSharePercent >= band.min &&
          candidate.voteSharePercent < band.max,
      ).length,
    }));
  }, [performanceCandidates]);

  const marginBandData = useMemo(() => {
    const bands = [
      { label: "<10%", min: 0, max: 10 },
      { label: "10–20%", min: 10, max: 20 },
      { label: "20–30%", min: 20, max: 30 },
      { label: "30–40%", min: 30, max: 40 },
      { label: "40%+", min: 40, max: Number.POSITIVE_INFINITY },
    ];

    return bands.map((band) => ({
      band: band.label,
      count: performanceCandidates.filter(
        (candidate) =>
          candidate.winMarginPercent >= band.min &&
          candidate.winMarginPercent < band.max,
      ).length,
    }));
  }, [performanceCandidates]);

  const headlineInsights = useMemo<InsightItem[]>(() => {
    if (performanceCandidates.length === 0) return [];

    const topVotes = [...performanceCandidates].sort(
      (a, b) => b.votesReceived - a.votesReceived,
    )[0]!;
    const highestVoteShare = [...performanceCandidates].sort(
      (a, b) => b.voteSharePercent - a.voteSharePercent,
    )[0]!;
    const biggestMarginVotes = [...performanceCandidates].sort(
      (a, b) => b.winMargin - a.winMargin,
    )[0]!;
    const biggestMarginPercent = [...performanceCandidates].sort(
      (a, b) => b.winMarginPercent - a.winMarginPercent,
    )[0]!;
    const strongestRatio =
      [...performanceCandidates]
        .filter((candidate) => candidate.winnerRunnerUpRatio != null)
        .sort(
          (a, b) => (b.winnerRunnerUpRatio ?? 0) - (a.winnerRunnerUpRatio ?? 0),
        )[0] ?? topVotes;
    const largestValidVotePool = [...performanceCandidates].sort(
      (a, b) => b.totalValidVotes - a.totalValidVotes,
    )[0]!;

    return [
      {
        title: "Top Voted Candidate",
        candidate: topVotes.name,
        constituency: topVotes.constituency,
        value: formatNumber(topVotes.votesReceived),
        detail: `${formatPercent(topVotes.voteSharePercent)} winning share from ${formatNumber(
          topVotes.totalValidVotes,
        )} valid votes.`,
      },
      {
        title: "Highest Vote Share",
        candidate: highestVoteShare.name,
        constituency: highestVoteShare.constituency,
        value: formatPercent(highestVoteShare.voteSharePercent, 2),
        detail: `Beat ${highestVoteShare.runnerUpName} by ${formatNumber(
          highestVoteShare.winMargin,
        )} votes.`,
      },
      {
        title: "Biggest Vote Difference",
        candidate: biggestMarginVotes.name,
        constituency: biggestMarginVotes.constituency,
        value: formatNumber(biggestMarginVotes.winMargin),
        detail: `Largest raw gap over ${biggestMarginVotes.runnerUpName}.`,
      },
      {
        title: "Biggest Margin %",
        candidate: biggestMarginPercent.name,
        constituency: biggestMarginPercent.constituency,
        value: formatPercent(biggestMarginPercent.winMarginPercent, 2),
        detail: `Largest gap as a share of all valid votes cast.`,
      },
      {
        title: "Strongest Winner/Opponent Ratio",
        candidate: strongestRatio.name,
        constituency: strongestRatio.constituency,
        value: formatRatio(strongestRatio.winnerRunnerUpRatio ?? 0),
        detail: `Winner vote pile was ${formatRatio(
          strongestRatio.winnerRunnerUpRatio ?? 0,
        )} the runner-up total.`,
      },
      {
        title: "Largest Valid Vote Pool",
        candidate: largestValidVotePool.name,
        constituency: largestValidVotePool.constituency,
        value: formatNumber(largestValidVotePool.totalValidVotes),
        detail: `Highest valid-vote volume among all recorded constituencies.`,
      },
    ];
  }, [performanceCandidates]);

  const snapshotMetrics = useMemo<SnapshotItem[]>(() => {
    if (performanceCandidates.length === 0) return [];

    const avgWinningShare = average(
      performanceCandidates.map((candidate) => candidate.voteSharePercent),
    );
    const avgMarginPercent = average(
      performanceCandidates.map((candidate) => candidate.winMarginPercent),
    );
    const dominantWins = performanceCandidates.filter(
      (candidate) => candidate.voteSharePercent >= DOMINANT_SHARE_THRESHOLD,
    ).length;
    const ratioWins = performanceCandidates.filter(
      (candidate) =>
        candidate.winnerRunnerUpRatio != null &&
        candidate.winnerRunnerUpRatio >= DOMINANT_RATIO_THRESHOLD,
    ).length;
    const closeRaces = performanceCandidates.filter(
      (candidate) => candidate.winMarginPercent < CLOSE_MARGIN_THRESHOLD,
    ).length;

    return [
      {
        label: "Average winning share",
        value: formatPercent(avgWinningShare, 2),
        helper: `Across ${performanceCandidates.length} FPTP victories.`,
      },
      {
        label: "Average margin %",
        value: formatPercent(avgMarginPercent, 2),
        helper: "Average lead over the nearest challenger.",
      },
      {
        label: "Wins above 60% share",
        value: formatNumber(dominantWins),
        helper: `Seats that crossed the ${DOMINANT_SHARE_THRESHOLD}% mark.`,
      },
      {
        label: "Wins above 2x runner-up",
        value: formatNumber(ratioWins),
        helper: "Constituencies where the winner doubled the closest opponent.",
      },
      {
        label: "Close races under 10%",
        value: formatNumber(closeRaces),
        helper: `Seats with win margins below ${CLOSE_MARGIN_THRESHOLD}% of valid votes.`,
      },
    ];
  }, [performanceCandidates]);

  const topVoteTotals = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
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
    [performanceCandidates],
  );

  const highestVoteShares = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
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
    [performanceCandidates],
  );

  const biggestMargins = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
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
    [performanceCandidates],
  );

  const strongestRatios = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
        .filter((candidate) => candidate.winnerRunnerUpRatio != null)
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
    [performanceCandidates],
  );

  const closestByMarginPercent = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
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
    [performanceCandidates],
  );

  const largestValidVotePools = useMemo<LeaderboardItem[]>(
    () =>
      [...performanceCandidates]
        .sort((a, b) => b.totalValidVotes - a.totalValidVotes)
        .slice(0, TOP_LIST_SIZE)
        .map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          constituency: candidate.constituency,
          value: formatNumber(candidate.totalValidVotes),
          detail: `${formatNumber(candidate.votesReceived)} winner votes and ${formatPercent(
            candidate.voteSharePercent,
          )} share.`,
        })),
    [performanceCandidates],
  );

  const provinceSummary = useMemo<ProvinceSummary[]>(() => {
    const summary: Record<
      string,
      {
        seats: number;
        voteShareTotal: number;
        marginPercentTotal: number;
        dominantWins: number;
        closeRaces: number;
      }
    > = {};

    performanceCandidates.forEach((candidate) => {
      const province = candidate.province;
      if (!summary[province]) {
        summary[province] = {
          seats: 0,
          voteShareTotal: 0,
          marginPercentTotal: 0,
          dominantWins: 0,
          closeRaces: 0,
        };
      }

      summary[province].seats += 1;
      summary[province].voteShareTotal += candidate.voteSharePercent;
      summary[province].marginPercentTotal += candidate.winMarginPercent;
      summary[province].dominantWins +=
        candidate.voteSharePercent >= DOMINANT_SHARE_THRESHOLD ? 1 : 0;
      summary[province].closeRaces +=
        candidate.winMarginPercent < CLOSE_MARGIN_THRESHOLD ? 1 : 0;
    });

    return Object.entries(summary)
      .map(([province, values]) => ({
        province,
        seats: values.seats,
        avgVoteShare: values.voteShareTotal / values.seats,
        avgMarginPercent: values.marginPercentTotal / values.seats,
        dominantWins: values.dominantWins,
        closeRaces: values.closeRaces,
      }))
      .sort((a, b) => b.seats - a.seats || b.avgVoteShare - a.avgVoteShare);
  }, [performanceCandidates]);

  const hasData = candidates.length > 0;

  return (
    <div className="page-shell-wide page-section">
      {!hasData && (
        <div className="surface-panel p-12 text-center text-muted-foreground">
          <p className="text-lg font-medium">No data available yet</p>
          <p className="mt-1 text-sm">
            Candidate data will appear here once `candidates.json` is populated.
          </p>
        </div>
      )}

      {hasData && (
        <div className="space-y-10">
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
            <div className="surface-contrast overflow-hidden p-8 sm:p-10 lg:p-12">
              <p
                className="section-kicker"
                style={{
                  color:
                    "color-mix(in srgb, var(--surface-inverse-foreground) 70%, transparent)",
                }}
              >
                Election analytics
              </p>
              <h1 className="display-title mt-4 text-[var(--surface-inverse-foreground)]">
                A results-board view of how RSP candidates won.
              </h1>
              <p
                className="mt-5 max-w-3xl text-base leading-7 sm:text-lg"
                style={{
                  color:
                    "color-mix(in srgb, var(--surface-inverse-foreground) 76%, transparent)",
                }}
              >
                This dashboard prioritizes vote intensity,
                winner-versus-opponent separation, margin structure, and
                province patterns before demographic context, closer to an
                election desk than a generic charts page.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {headlineInsights.slice(0, 3).map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.4rem] border px-4 py-4"
                    style={{
                      borderColor: "var(--surface-inverse-border)",
                      backgroundColor: "var(--surface-inverse-muted)",
                    }}
                  >
                    <p
                      className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        color:
                          "color-mix(in srgb, var(--surface-inverse-foreground) 70%, transparent)",
                      }}
                    >
                      {item.title}
                    </p>
                    <p className="numeric mt-3 text-3xl font-semibold text-[var(--surface-inverse-foreground)]">
                      {item.value}
                    </p>
                    <p
                      className="mt-2 text-sm"
                      style={{
                        color:
                          "color-mix(in srgb, var(--surface-inverse-foreground) 78%, transparent)",
                      }}
                    >
                      {item.candidate}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6 sm:p-7">
              <p className="section-kicker">Report focus</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                What this page now surfaces
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The emphasis is on standout winners, biggest margins, strongest
                ratios over the nearest opponent, and seat-by-seat
                competitiveness before the broader demographic breakdown.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {snapshotMetrics.slice(0, 4).map((item) => (
                  <SnapshotCard key={item.label} {...item} />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Election Records"
              description="The standout performances across raw votes, vote share, head-to-head dominance, and margin size."
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {headlineInsights.map((item) => (
                <InsightCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Competition Snapshot"
              description="A quick read on whether RSP’s wins were broadly dominant, moderately comfortable, or genuinely competitive."
            />
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
              {snapshotMetrics.map((item) => (
                <SnapshotCard key={item.label} {...item} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Performance Leaderboards"
              description="Rankings built from the full constituency result tables rather than generic aggregates."
            />
            <div className="grid gap-6 xl:grid-cols-2">
              <LeaderboardCard
                title="Top Vote Totals"
                description="Candidates with the highest raw vote counts."
                items={topVoteTotals.slice(0, TOP_LIST_SIZE)}
                slug="top-votes"
                totalCount={topVoteTotals.length}
              />
              <LeaderboardCard
                title="Highest Vote Shares"
                description="Candidates who captured the largest share of valid votes."
                items={highestVoteShares.slice(0, TOP_LIST_SIZE)}
                slug="highest-vote-shares"
                totalCount={highestVoteShares.length}
              />
              <LeaderboardCard
                title="Biggest Win Margins"
                description="Largest vote gaps over the closest opponent."
                items={biggestMargins.slice(0, TOP_LIST_SIZE)}
                slug="biggest-margins"
                totalCount={biggestMargins.length}
              />
              <LeaderboardCard
                title="Strongest Winner/Opponent Ratios"
                description="Where the winner’s vote pile most clearly outweighed the runner-up."
                items={strongestRatios.slice(0, TOP_LIST_SIZE)}
                slug="strongest-ratios"
                totalCount={strongestRatios.length}
              />
              <LeaderboardCard
                title="Closest Races by Margin %"
                description="Seats where the winner’s lead over the closest opponent was smallest as a share of valid votes."
                items={closestByMarginPercent.slice(0, TOP_LIST_SIZE)}
                slug="closest-races"
                totalCount={closestByMarginPercent.length}
              />
              <LeaderboardCard
                title="Largest Valid Vote Pools"
                description="Constituencies with the biggest valid-vote base."
                items={largestValidVotePools.slice(0, TOP_LIST_SIZE)}
                slug="largest-vote-pools"
                totalCount={largestValidVotePools.length}
              />
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Race Structure"
              description="How often wins fell into tighter or more dominant bands when measured by vote share and margin percent."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Winning Vote Share Bands">
                <ChartSlot
                  ready={chartsReady}
                  hasData={voteShareBandData.some((item) => item.count > 0)}
                >
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={voteShareBandData} margin={{ left: 0 }}>
                        <XAxis
                          dataKey="band"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value as number, "Seats"]}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar
                          dataKey="count"
                          fill="var(--rsp-blue)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartSlot>
              </ChartCard>

              <ChartCard title="Victory Margin Bands">
                <ChartSlot
                  ready={chartsReady}
                  hasData={marginBandData.some((item) => item.count > 0)}
                >
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={marginBandData} margin={{ left: 0 }}>
                        <XAxis
                          dataKey="band"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value as number, "Seats"]}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar
                          dataKey="count"
                          fill="var(--rsp-green)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartSlot>
              </ChartCard>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Province Performance Summary"
              description="A province-by-province comparison of seats, average winning share, average winning margin, and how often contests were dominant or close."
            />
            <div className="surface-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-border/70 bg-[var(--surface-soft)]">
                    <tr>
                      <th className="px-5 py-4 text-left text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Province
                      </th>
                      <th className="px-5 py-4 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Seats
                      </th>
                      <th className="px-5 py-4 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Avg Vote Share
                      </th>
                      <th className="px-5 py-4 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Avg Margin %
                      </th>
                      <th className="px-5 py-4 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        60%+ Wins
                      </th>
                      <th className="px-5 py-4 text-right text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Close Races
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {provinceSummary.map((row) => (
                      <tr key={row.province}>
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {row.province}
                        </td>
                        <td className="numeric px-5 py-4 text-right text-foreground">
                          {formatNumber(row.seats)}
                        </td>
                        <td className="numeric px-5 py-4 text-right text-foreground">
                          {formatPercent(row.avgVoteShare, 2)}
                        </td>
                        <td className="numeric px-5 py-4 text-right text-foreground">
                          {formatPercent(row.avgMarginPercent, 2)}
                        </td>
                        <td className="numeric px-5 py-4 text-right text-foreground">
                          {formatNumber(row.dominantWins)}
                        </td>
                        <td className="numeric px-5 py-4 text-right text-foreground">
                          {formatNumber(row.closeRaces)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <SectionHeader
              title="Demographic Profile"
              description="Background context on the age, gender, and education profile of the winning candidates."
            />
            <div className="grid gap-6 xl:grid-cols-3">
              <ChartCard title="Education Distribution (Highest Level)">
                <ChartSlot
                  ready={chartsReady}
                  hasData={educationData.length > 0}
                >
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={educationData} margin={{ left: 0 }}>
                        <XAxis
                          dataKey="level"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value as number, "MPs"]}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar
                          dataKey="count"
                          fill="var(--rsp-blue)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartSlot>
              </ChartCard>

              <ChartCard title="Age Distribution">
                <ChartSlot
                  ready={chartsReady}
                  hasData={ageData.some((item) => item.count > 0)}
                >
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageData} margin={{ left: 0 }}>
                        <XAxis
                          dataKey="group"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          formatter={(value) => [value as number, "MPs"]}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Bar
                          dataKey="count"
                          fill="var(--rsp-green)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartSlot>
              </ChartCard>

              <ChartCard title="Gender Ratio">
                <ChartSlot ready={chartsReady} hasData={genderData.length > 0}>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={genderData}
                          dataKey="count"
                          nameKey="gender"
                          cx="50%"
                          cy="50%"
                          outerRadius="42%"
                          label={renderPieLabel}
                          labelLine={false}
                        >
                          {genderData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            value as number,
                            name as string,
                          ]}
                          contentStyle={{ borderRadius: 12, fontSize: 12 }}
                        />
                        <Legend iconType="circle" iconSize={10} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </ChartSlot>
              </ChartCard>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function EmptyChart({ message = "No data available." }: { message?: string }) {
  return (
    <div className="flex h-48 items-center justify-center rounded-[1.25rem] border border-dashed border-border/80 bg-[var(--surface-soft)] text-sm text-muted-foreground">
      {message}
    </div>
  );
}
