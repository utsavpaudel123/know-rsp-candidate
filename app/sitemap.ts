import type { MetadataRoute } from "next";
import { getCandidates } from "@/lib/getCandidates";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://knowrspmp.vercel.app";

const LEADERBOARD_SLUGS = [
  "top-votes",
  "highest-vote-shares",
  "biggest-margins",
  "strongest-ratios",
  "closest-races",
  "largest-vote-pools",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const candidates = getCandidates();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/analytics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const leaderboardPages: MetadataRoute.Sitemap = LEADERBOARD_SLUGS.map(
    (slug) => ({
      url: `${BASE_URL}/analytics/leaderboard/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  const candidatePages: MetadataRoute.Sitemap = candidates.map((candidate) => ({
    url: `${BASE_URL}/candidate/${candidate.id}`,
    lastModified: new Date(candidate.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...leaderboardPages, ...candidatePages];
}
