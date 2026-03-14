"use client";

import { Scale, Check } from "lucide-react";
import { useCompare } from "@/lib/compare-context";

interface CompareToggleButtonProps {
  candidateId: string;
  variant?: "default" | "compact";
}

export default function CompareToggleButton({
  candidateId,
  variant = "default",
}: CompareToggleButtonProps) {
  const { toggleCandidate, isSelected, isFull } = useCompare();
  const selected = isSelected(candidateId);
  const disabled = !selected && isFull;

  if (variant === "compact") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) toggleCandidate(candidateId);
        }}
        disabled={disabled}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
          selected
            ? "border-[var(--rsp-blue)] bg-[var(--rsp-blue)] text-white"
            : disabled
            ? "border-border/50 bg-[var(--surface-soft)] text-muted-foreground/40 cursor-not-allowed"
            : "border-border/80 bg-[var(--surface-strong)] text-muted-foreground hover:border-[var(--rsp-blue)]/50 hover:text-[var(--rsp-blue)]"
        }`}
        aria-label={selected ? "Remove from comparison" : "Add to comparison"}
        title={disabled ? "Compare list is full (max 5)" : selected ? "Remove from comparison" : "Add to comparison"}
      >
        {selected ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Scale className="h-3.5 w-3.5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        if (!disabled) toggleCandidate(candidateId);
      }}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all ${
        selected
          ? "border-[var(--rsp-blue)] bg-[var(--rsp-blue)]/10 text-[var(--rsp-blue)]"
          : disabled
          ? "border-border/50 text-muted-foreground/40 cursor-not-allowed"
          : "border-border bg-[var(--surface-strong)] text-foreground hover:border-[var(--rsp-blue)]/50 hover:text-[var(--rsp-blue)]"
      }`}
      aria-label={selected ? "Remove from comparison" : "Add to comparison"}
    >
      {selected ? (
        <Check className="h-4 w-4" />
      ) : (
        <Scale className="h-4 w-4" />
      )}
      {selected ? "Added to compare" : disabled ? "Compare full" : "Compare"}
    </button>
  );
}
