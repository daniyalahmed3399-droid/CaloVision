import { Suspense } from "react";

import PhotoMealScan from "../../../../../components/tracking/PhotoMealScan";
import { PageSkeleton } from "../../../../../components/ui/Skeleton";

export const metadata = { title: "Scan a meal photo | CaloVision" };

// useSearchParams (inside PhotoMealScan) needs a Suspense boundary.
export default function PhotoMealPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PhotoMealScan />
    </Suspense>
  );
}
