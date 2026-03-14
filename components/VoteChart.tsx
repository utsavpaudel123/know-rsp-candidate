"use client";

import { Candidate } from "@/lib/types";
import { useEffect, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface VoteChartProps {
  candidate: Candidate;
}

interface TooltipEntry {
  value?: number | string | readonly (number | string)[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 text-sm shadow-lg">
      <p className="font-medium text-popover-foreground mb-1">
        {String(label ?? "")}
      </p>
      {payload.map((entry, i) => {
        const val = entry.value;
        const display =
          typeof val === "number" ? val.toLocaleString() : String(val ?? "");
        return (
          <p key={i} className="text-muted-foreground">
            <span className="font-semibold text-foreground">{display}</span>{" "}
            votes
          </p>
        );
      })}
    </div>
  );
}

function getPartyColor(partyName: string): string {
  const normalized = partyName.toLowerCase();

  if (normalized.includes("rsp") || normalized.includes("rastriya swatantra")) {
    return "#0ea5e9"; // Sky blue
  }
  if (normalized.includes("cpn-uml") || normalized.includes("uml")) {
    return "#8B0000"; // Dark red
  }
  if (normalized.includes("congress")) {
    return "#16a34a"; // Green
  }
  if (
    normalized.includes("ncp") ||
    normalized.includes("maoist") ||
    normalized.includes("communist")
  ) {
    return "#5c0002"; // Liver red
  }

  return "#9333ea"; // Default fallback (purple)
}

export default function VoteChart({ candidate }: VoteChartProps) {
  const { votesReceived, runnerUp, voteSharePercent, winMargin, name } =
    candidate;
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  if (!votesReceived || !runnerUp) {
    return (
      <div className="surface-panel px-4 py-6 text-center text-sm text-muted-foreground">
        Vote data is not available for this MP.
      </div>
    );
  }

  const data = [
    {
      label: name.split(" ")[0], // first name for brevity
      votes: votesReceived,
      fill: getPartyColor("RSP"),
    },
    {
      label: runnerUp.name.split(" ")[0],
      votes: runnerUp.votes,
      fill: getPartyColor(runnerUp.party),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {voteSharePercent != null && (
          <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Vote share
            </span>
            <div className="numeric mt-3 text-3xl font-semibold text-foreground">
              {voteSharePercent.toFixed(1)}%
            </div>
          </div>
        )}
        {winMargin != null && (
          <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Win margin
            </span>
            <div className="numeric mt-3 text-3xl font-semibold text-foreground">
              {winMargin.toLocaleString()}
            </div>
          </div>
        )}
        <div className="rounded-[1.25rem] border border-border/80 bg-[var(--surface-soft)] p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Votes received
          </span>
          <div className="numeric mt-3 text-3xl font-semibold text-foreground">
            {votesReceived.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border/80 bg-[var(--surface-soft)] p-4">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Head-to-head result
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Winner vs closest opponent in valid votes
            </p>
          </div>
        </div>

        <div className="h-56">
          {chartReady ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 8, left: 8, bottom: 4 }}
                barCategoryGap="30%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  width={60}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                  }
                  className="text-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="votes" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Loading chart...
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-[var(--surface-soft)] px-3 py-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: getPartyColor("RSP") }}
          />
          {name} (RSP)
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-[var(--surface-soft)] px-3 py-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: getPartyColor(runnerUp.party) }}
          />
          {runnerUp.name} ({runnerUp.party})
        </div>
      </div>
    </div>
  );
}
