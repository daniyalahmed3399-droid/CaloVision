import { Skeleton, PageSkeleton } from "../ui/Skeleton";

// Shown while the session is being checked, so /app pages open with the
// shape of the real shell instead of a blank screen. Mirrors AppShell:
// sidebar on desktop, top bar, bottom nav on mobile.
export default function AppShellSkeleton() {
  return (
    <div className="min-h-screen bg-[#f6f9f1]">
      {/* Sidebar */}
      <aside
        aria-hidden="true"
        className="fixed left-0 top-0 hidden h-screen w-[270px] flex-col border-r border-black/5 bg-white p-5 lg:flex"
      >
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-2 w-16" />
          </div>
        </div>

        <div className="mt-12 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-11 w-full rounded-xl" />
          ))}
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        {/* Top bar */}
        <div
          aria-hidden="true"
          className="flex h-[80px] items-center justify-between border-b border-black/5 px-4 sm:px-6 lg:px-8"
        >
          <div>
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-2 h-5 w-24" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl sm:w-28" />
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
        </div>

        <main className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <PageSkeleton />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around border-t border-black/5 bg-white px-2 py-3 lg:hidden"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-12 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
