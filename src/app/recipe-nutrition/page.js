import RecipeNutritionCalculator from "../../components/recipe/RecipeNutritionCalculator";

export const metadata = {
  title: "Recipe Nutrition Calculator | CaloVision",
  description:
    "Create recipes, calculate complete nutrition, and view nutrition per serving with CaloVision.",
};

export default function RecipeNutritionPage() {
  return (
    <main className="min-h-screen bg-[#f6f9f1]">
      <RecipeNutritionCalculator />
    </main>
  );
}