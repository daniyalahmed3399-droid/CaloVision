import { Suspense } from "react";

import VoiceMealLog from "../../../../../components/tracking/VoiceMealLog";
import { PageSkeleton } from "../../../../../components/ui/Skeleton";

export const metadata = { title: "Speak your meal | CaloVision" };

// useSearchParams (inside VoiceMealLog) needs a Suspense boundary.
export default function VoiceMealPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <VoiceMealLog />
    </Suspense>
  );
}
