"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ExternalLink,
  AlertTriangle,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  BookOpen,
  Building2,
  Newspaper,
  Link2,
  ChevronDown,
} from "lucide-react";
import { Source, SourcePlatform } from "@/lib/types";

interface SourceLinksProps {
  sources: Source[];
}

const MAX_VISIBLE = 4;

const PLATFORM_CONFIG: Record<
  SourcePlatform,
  { label: string; icon: ReactNode; color: string }
> = {
  Wikipedia: {
    label: "Wikipedia",
    icon: <BookOpen className="h-4 w-4" />,
    color: "text-slate-600 dark:text-slate-300",
  },
  LinkedIn: {
    label: "LinkedIn",
    icon: <Linkedin className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  "Twitter/X": {
    label: "Twitter / X",
    icon: <Twitter className="h-4 w-4" />,
    color: "text-sky-500 dark:text-sky-400",
  },
  Facebook: {
    label: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    color: "text-blue-700 dark:text-blue-400",
  },
  "Nepal Election Commission": {
    label: "Election Commission",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
  },
  "Parliament Website": {
    label: "Parliament",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-amber-700 dark:text-amber-400",
  },
  "News Article": {
    label: "News Article",
    icon: <Newspaper className="h-4 w-4" />,
    color: "text-green-700 dark:text-green-400",
  },
  "Official Website": {
    label: "Official Website",
    icon: <Globe className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
  },
  Other: {
    label: "Source",
    icon: <Link2 className="h-4 w-4" />,
    color: "text-muted-foreground",
  },
};

export default function SourceLinks({ sources }: SourceLinksProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) {
    return (
      <div className="flex items-start gap-3 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-4 dark:border-amber-900/50 dark:bg-amber-900/20">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            No sources available
          </p>
          <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
            This candidate&apos;s information has not been verified with external
            sources. Information may be incomplete or unverified.
          </p>
        </div>
      </div>
    );
  }

  const needsCollapse = sources.length > MAX_VISIBLE;
  const visibleSources = needsCollapse && !expanded ? sources.slice(0, MAX_VISIBLE) : sources;
  const hiddenCount = sources.length - MAX_VISIBLE;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {sources.length} source{sources.length !== 1 ? "s" : ""} — information
        verified from public records.
      </p>

      <div className="flex flex-col gap-2">
        {visibleSources.map((source, idx) => {
          const config = PLATFORM_CONFIG[source.platform];
          return (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] px-4 py-3 transition-all hover:bg-muted/70"
            >
              <span className={`shrink-0 ${config.color}`}>{config.icon}</span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none truncate">
                  {source.label ?? config.label}
                </p>
                <p className={`mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${config.color}`}>
                  {config.label}
                </p>
              </div>

              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </a>
          );
        })}
      </div>

      {needsCollapse && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center justify-center gap-2 rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <ChevronDown className="h-3.5 w-3.5" />
          Show {hiddenCount} more source{hiddenCount !== 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
