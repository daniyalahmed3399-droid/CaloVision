import { Suspense } from "react";

import FoodSearch from "../../../../../components/tracking/FoodSearch";
import { PageSkeleton } from "../../../../../components/ui/Skeleton";

export const metadata = { title: "Search food | CaloVision" };

// useSearchParams (inside FoodSearch) needs a Suspense boundary.
export default function FoodSearchPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FoodSearch />
    </Suspense>
  );
}
