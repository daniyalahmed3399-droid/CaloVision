import {
  LoadingRegion,
  Skeleton,
  SkeletonCard,
  SkeletonHeader,
  SkeletonStat,
} from "../../../components/ui/Skeleton";

// Dashboard-shaped placeholder: date/summary, calorie and macro tiles,
// then the four meal sections.
export default function DashboardLoading() {
  return (
    <LoadingRegion label="Loading your dashboard" className="mx-auto max-w-[1280px]">
      <SkeletonHeader />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonStat key={index} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
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
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          ))}
        </div>

        <SkeletonCard lines={4} />
      </div>
    </LoadingRegion>
  );
}
