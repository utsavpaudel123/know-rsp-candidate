export default function Loading() {
  return (
    <div className="page-shell-wide page-section">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="animate-pulse rounded-[calc(var(--radius)*1.7)] bg-muted/40 p-8 sm:p-10 lg:p-12">
          <div className="h-4 w-40 rounded-full bg-muted" />
          <div className="mt-6 h-12 w-3/4 rounded-full bg-muted" />
          <div className="mt-4 h-12 w-1/2 rounded-full bg-muted" />
          <div className="mt-6 h-5 w-2/3 rounded-full bg-muted" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-40 rounded-full bg-muted" />
            <div className="h-12 w-36 rounded-full bg-muted" />
          </div>
        </div>
        <div className="grid gap-6">
          <div className="animate-pulse rounded-[calc(var(--radius)*1.7)] border border-border/80 bg-muted/20 p-6">
            <div className="h-4 w-32 rounded-full bg-muted" />
            <div className="mt-3 h-6 w-48 rounded-full bg-muted" />
            <div className="mt-6 space-y-4">
              <div className="h-4 w-full rounded-full bg-muted" />
              <div className="h-4 w-full rounded-full bg-muted" />
              <div className="h-4 w-full rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
