import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-shell-wide flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="surface-card mx-auto max-w-lg p-8 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-border/80 bg-[var(--surface-soft)]">
          <SearchX className="h-7 w-7 text-muted-foreground" />
        </div>

        <h1 className="mt-6 font-display text-4xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
          Try browsing the directory or checking the analytics dashboard.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-inverse)] px-5 py-3 text-sm font-semibold text-[var(--surface-inverse-foreground)] transition-transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to directory
          </Link>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/70"
          >
            View analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
