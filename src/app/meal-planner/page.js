import MealPlanner from "../../components/meal-planner/MealPlanner";

export const metadata = {
  title: "Daily Meal Planner | CaloVision",
  description:
    "Plan your daily meals, track calories and macros, and manage your nutrition with CaloVision.",
};

export default function MealPlannerPage() {
  return (
    <main className="min-h-screen bg-[#f6f9f1]">
      <MealPlanner />
    </main>
  );
}