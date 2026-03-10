import type { Candidate, EducationLevel } from "@/lib/types";

export const EDUCATION_ORDER: EducationLevel[] = [
  "SLC",
  "Intermediate",
  "+2",
  "Bachelors",
  "Masters",
  "PhD",
  "Other",
];

export const TOP_LIST_SIZE = 5;
export const DOMINANT_SHARE_THRESHOLD = 60;
export const DOMINANT_RATIO_THRESHOLD = 2;
export const CLOSE_MARGIN_THRESHOLD = 10;

export type PerformanceCandidate = {
  id: string;
  name: string;
  constituency: string;
  province: string;
  votesReceived: number;
  totalValidVotes: number;
  voteSharePercent: number;
  runnerUpName: string;
  runnerUpParty: string;
  runnerUpVotes: number;
  runnerUpSharePercent: number;
  winMargin: number;
  winMarginPercent: number;
  winnerRunnerUpRatio: number | null;
};

export type InsightItem = {
  title: string;
  candidate: string;
  constituency: string;
  value: string;
  detail: string;
};

export type SnapshotItem = {
  label: string;
  value: string;
  helper: string;
};

export type LeaderboardItem = {
  id: string;
  name: string;
  constituency: string;
  value: string;
  detail: string;
};

export type ProvinceSummary = {
  province: string;
  seats: number;
  avgVoteShare: number;
  avgMarginPercent: number;
  dominantWins: number;
  closeRaces: number;
};

export function getTopEducation(candidate: Candidate): EducationLevel | null {
  if (!candidate.education || candidate.education.length === 0) return null;
  const sorted = [...candidate.education].sort(
    (a, b) =>
      EDUCATION_ORDER.indexOf(b.level) - EDUCATION_ORDER.indexOf(a.level),
  );
  return sorted[0]?.level ?? null;
}

export function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatRatio(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}x`;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function toPerformanceCandidate(
  candidate: Candidate,
): PerformanceCandidate | null {
  if (
    candidate.electionType !== "FPTP" ||
    candidate.votesReceived == null ||
    candidate.totalValidVotes == null ||
    candidate.voteSharePercent == null ||
    candidate.runnerUp?.votes == null ||
    candidate.winMargin == null ||
    candidate.winMarginPercent == null
  ) {
    return null;
  }

  const runnerUpVotes = candidate.runnerUp.votes;
  const runnerUpSharePercent =
    candidate.totalValidVotes > 0
      ? (runnerUpVotes / candidate.totalValidVotes) * 100
      : 0;

  return {
    id: candidate.id,
    name: candidate.name,
    constituency: candidate.constituency.name,
    province: candidate.constituency.province,
    votesReceived: candidate.votesReceived,
    totalValidVotes: candidate.totalValidVotes,
    voteSharePercent: candidate.voteSharePercent,
    runnerUpName: candidate.runnerUp.name,
    runnerUpParty: candidate.runnerUp.party,
    runnerUpVotes,
    runnerUpSharePercent,
    winMargin: candidate.winMargin,
    winMarginPercent: candidate.winMarginPercent,
    winnerRunnerUpRatio:
      runnerUpVotes > 0 ? candidate.votesReceived / runnerUpVotes : null,
  };
}
