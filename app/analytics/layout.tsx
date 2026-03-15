import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Election Analytics – RSP Vote Performance & Demographics",
  description:
    "Detailed election analytics for RSP Members of Parliament. Vote share leaderboards, win margins, province-level performance, age and education demographics, and race competitiveness data from Nepal's 2026 General Election.",
  alternates: {
    canonical: "/analytics",
  },
  openGraph: {
    title: "RSP Election Analytics – Vote Performance & Demographics",
    description:
      "Explore RSP election performance: vote share rankings, win margins, province summaries, and demographic breakdowns from Nepal's 2026 General Election.",
    url: "/analytics",
  },
  twitter: {
    card: "summary_large_image",
    title: "RSP Election Analytics – Vote Performance & Demographics",
    description:
      "Explore RSP election performance: vote share rankings, win margins, province summaries, and demographic breakdowns.",
  },
};

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
