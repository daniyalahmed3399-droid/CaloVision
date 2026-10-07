import CalorieSummary from "./CalorieSummary";
import MacroCard from "./MacroCard";

// Calories plus protein / carbs / fat for one day, all from the backend's
// day summary. Shared by the dashboard and meal history.
export default function DayOverview({ day }) {
  const { targets, totals } = day;

  return (
    <div className="@container space-y-4">
      <CalorieSummary day={day} />

      <h2 className="sr-only">Macronutrients</h2>

      <div className="grid gap-4 @md:grid-cols-3">
        <MacroCard label="Protein" eaten={totals.protein} target={targets?.proteinG} tone="blue" />
        <MacroCard label="Carbs" eaten={totals.carbs} target={targets?.carbsG} tone="orange" />
        <MacroCard label="Fat" eaten={totals.fat} target={targets?.fatG} tone="purple" />
      </div>

      {totals.fiber > 0 && (
        <p className="px-1 text-xs text-gray-500">
          Fibre today: <strong className="text-gray-700">{totals.fiber} g</strong>
        </p>
      )}
    </div>
  );
}
