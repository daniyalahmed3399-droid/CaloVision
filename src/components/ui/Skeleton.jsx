// Loading placeholders shaped like the content that will replace them.
// Use <Skeleton className="h-4 w-32" /> for any block, or the ready-made
// pieces below. Wrap a group in <LoadingRegion> so screen readers hear
// "Loading" once instead of reading every placeholder.

export function Skeleton({ className = "" }) {
  return (
    <div aria-hidden="true" className={`skeleton rounded-lg ${className}`} />
  );
}

export function LoadingRegion({ label = "Loading", children, className = "" }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

// Page title + subtitle placeholder (matches PageHeader).
export function SkeletonHeader() {
  return (
    <div className="mb-6">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-64 max-w-full" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
    </div>
  );
}

// Card with a few lines of text.
export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm ${className}`}
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-7 w-40" />

      <div className="mt-5 space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-3.5 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Small stat tile (calories, protein, ...).
export function SkeletonStat() {
  return (
    <div
      aria-hidden="true"
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <Skeleton className="h-3 w-16" />
      <Skeleton className="mt-4 h-8 w-24" />
      <Skeleton className="mt-4 h-2 w-full rounded-full" />
    </div>
  );
}

// Generic page: header, a row of stats, then two cards.
export function PageSkeleton() {
  return (
    <LoadingRegion className="mx-auto max-w-[1280px]">
      <SkeletonHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonStat key={index} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SkeletonCard lines={5} />
        <SkeletonCard lines={4} />
      </div>
    </LoadingRegion>
  );
}
