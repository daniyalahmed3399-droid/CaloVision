import { Utensils } from "lucide-react";

import ComingSoon from "../../../components/app/ComingSoon";

export const metadata = { title: "Food | CaloVision" };

export default function FoodPage() {
  return (
    <ComingSoon
      icon={Utensils}
      eyebrow="Food"
      title="Meals & food history"
      description="Everything you've logged, grouped by meal."
    />
  );
}
