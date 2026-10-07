import { Suspense } from "react";

import AiTextMealLog from "../../../../../components/tracking/AiTextMealLog";
import { PageSkeleton } from "../../../../../components/ui/Skeleton";

export const metadata = { title: "Describe your meal | CaloVision" };

// useSearchParams (inside AiTextMealLog) needs a Suspense boundary.
export default function AiTextMealPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <AiTextMealLog />
    </Suspense>
  );
}
