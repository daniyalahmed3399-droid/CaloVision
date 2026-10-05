import { Plus } from "lucide-react";

import ComingSoon from "../../../../components/app/ComingSoon";

export const metadata = { title: "Add food | CaloVision" };

export default function AddFoodPage() {
  return (
    <ComingSoon
      icon={Plus}
      eyebrow="Food"
      title="Add food"
      description="Search, scan, describe or speak a meal."
    />
  );
}
