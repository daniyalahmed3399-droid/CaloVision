import CaloriesCalculator from "../../components/CaloriesCalculator";

export const metadata = {
  title: "Calories Calculator | CaloVision",
  description:
    "Calculate your estimated daily calorie requirements based on your age, body measurements, activity level, and fitness goal.",
};

export default function CaloriesCalculatorPage() {
  return (
    <main className="min-h-screen bg-[#f6f9f1]">
      <CaloriesCalculator />
    </main>
  );
}
