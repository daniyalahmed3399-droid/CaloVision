import {
  LoadingRegion,
  Skeleton,
  SkeletonCard,
  SkeletonHeader,
  SkeletonStat,
} from "../ui/Skeleton";

// Dashboard-shaped placeholder: header, calorie card, macro tiles, the four
// meal sections and the side cards. Used by loading.js and while the day's
// data is first being fetched.
export default function DashboardSkeleton() {
  return (
    <LoadingRegion
      label="Loading your dashboard"
      className="mx-auto max-w-[1280px]"
    >
      <SkeletonHeader />

      <SkeletonCard lines={2} className="mb-4" />

      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonStat key={index} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
            <div
              key={meal}
              aria-hidden="true"
              className="flex items-center justify-between rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-3 w-40" />
              </div>
              <Skeleton className="h-10 w-16 rounded-xl" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div>
      </div>
    </LoadingRegion>
  );
}
