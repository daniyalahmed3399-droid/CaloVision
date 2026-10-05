import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import CaloriesCalculator from "../../components/CaloriesCalculator";

export const metadata = {
  title: "Calories Calculator | CaloVision",
  description:
    "Calculate your estimated daily calorie requirements based on your age, body measurements, activity level, and fitness goal.",
};

export default function CaloriesCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f6f9f1]">
      <div className="mx-auto max-w-[1280px] px-4 pt-28 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-[#4dbb08]"
        >
          <ArrowLeft size={17} />
          Back to CaloVision
        </Link>
      </div>

      <CaloriesCalculator />
    </main>
  );
}