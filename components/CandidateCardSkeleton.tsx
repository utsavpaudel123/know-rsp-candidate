import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CandidateCardSkeleton() {
  return (
    <div className="h-full animate-pulse">
      <Card className="h-full border-border/80">
        <CardHeader className="pb-0">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-[1.5rem] bg-muted" />
            <div className="min-w-0 flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-full bg-muted" />
                  <div className="h-3 w-24 rounded-full bg-muted" />
                </div>
                <div className="h-6 w-12 rounded-full bg-muted" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-40 rounded-full bg-muted" />
                <div className="h-3 w-28 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-[1.2rem] border border-border/70 bg-[var(--surface-soft)] p-3">
              <div className="h-3 w-16 rounded-full bg-muted" />
              <div className="mt-2 h-4 w-24 rounded-full bg-muted" />
            </div>
            <div className="rounded-[1.2rem] border border-border/70 bg-[var(--surface-soft)] p-3">
              <div className="h-3 w-16 rounded-full bg-muted" />
              <div className="mt-2 h-4 w-24 rounded-full bg-muted" />
            </div>
          </div>
          <div className="mt-4 rounded-[1.4rem] border border-border/80 bg-[var(--surface-soft)] p-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded-full bg-muted" />
              <div className="h-3 w-10 rounded-full bg-muted" />
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-muted" />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="h-4 w-4 rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
