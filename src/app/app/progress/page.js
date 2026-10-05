import { TrendingUp } from "lucide-react";

import ComingSoon from "../../../components/app/ComingSoon";

export const metadata = { title: "Progress | CaloVision" };

export default function ProgressPage() {
  return (
    <ComingSoon
      icon={TrendingUp}
      eyebrow="Progress"
      title="Your progress"
      description="Weight, calories and activity over time."
    />
  );
}
