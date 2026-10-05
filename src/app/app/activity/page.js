import { Activity } from "lucide-react";

import ComingSoon from "../../../components/app/ComingSoon";

export const metadata = { title: "Activity | CaloVision" };

export default function ActivityPage() {
  return (
    <ComingSoon
      icon={Activity}
      eyebrow="Activity"
      title="Exercise & steps"
      description="Log workouts and track your daily steps."
    />
  );
}
