import { ClipboardList } from "lucide-react";

import ComingSoon from "../../../components/app/ComingSoon";

export const metadata = { title: "Diet Plans | CaloVision" };

export default function PlansPage() {
  return (
    <ComingSoon
      icon={ClipboardList}
      eyebrow="Diet Plans"
      title="Your meal plans"
      description="Create and follow a structured meal plan."
    />
  );
}
