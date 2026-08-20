export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:pt-8">
      <div className="mb-6 space-y-2">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-5 space-y-4">
        <div className="h-12 w-full animate-pulse rounded-full bg-muted" />
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
              <div className="mt-3 h-6 w-1/2 animate-pulse rounded bg-muted" />
              <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
