"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Apple,
  Coffee,
  Moon,
  Plus,
  Utensils,
} from "lucide-react";

import FoodRow from "./FoodRow";
import {
  createFoodItem,
  calculateMealNutrition,
  formatCalories,
  formatNutrition,
} from "./mealPlannerUtils";

const mealIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Moon,
  snacks: Apple,
};

export default function MealSection({
  meal,
  items,
  errors,
  allMeals,
  onAddFood,
  onChangeFood,
  onRemoveFood,
  onMoveFood,
  onMoveFoodUp,
  onMoveFoodDown,
}) {
  const Icon =
    mealIcons[meal.id] || Utensils;

  const nutrition =
    calculateMealNutrition(items);

  const hasItems = items.length > 0;

  const handleAddFood = () => {
    onAddFood(
      meal.id,
      createFoodItem()
    );
  };

  return (
    <motion.section
      layout
      className="overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-gray-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f3f7ef] text-[#4dbb08]">
              <Icon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {meal.label}
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {meal.description}
              </p>
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAddFood}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4dbb08] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#43a907]"
          >
            <Plus size={17} />
            Add Food
          </motion.button>
        </div>

        {/* Meal nutrition */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <NutritionMiniCard
            label="Calories"
            value={formatCalories(
              nutrition.calories
            )}
            unit="kcal"
            highlight
          />

          <NutritionMiniCard
            label="Protein"
            value={formatNutrition(
              nutrition.protein
            )}
            unit="g"
          />

          <NutritionMiniCard
            label="Carbs"
            value={formatNutrition(
              nutrition.carbs
            )}
            unit="g"
          />

          <NutritionMiniCard
            label="Fat"
            value={formatNutrition(
              nutrition.fat
            )}
            unit="g"
          />
        </div>
      </div>

      {/* Food list */}
      <div className="p-5 sm:p-6">
        <AnimatePresence mode="popLayout">
          {hasItems ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <FoodRow
                  key={item.id}
                  item={item}
                  index={index}
                  totalItems={items.length}
                  currentMeal={meal.id}
                  mealOptions={allMeals}
                  error={
                    errors?.[item.id]
                  }
                  onChange={(changes) =>
                    onChangeFood(
                      meal.id,
                      item.id,
                      changes
                    )
                  }
                  onRemove={() =>
                    onRemoveFood(
                      meal.id,
                      item.id
                    )
                  }
                  onMove={(targetMeal) =>
                    onMoveFood(
                      meal.id,
                      targetMeal,
                      item.id
                    )
                  }
                  onMoveUp={() =>
                    onMoveFoodUp(
                      meal.id,
                      index
                    )
                  }
                  onMoveDown={() =>
                    onMoveFoodDown(
                      meal.id,
                      index
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyMealState
              mealName={meal.label}
              onAddFood={handleAddFood}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// ------------------------------------------------------------
// Small nutrition card
// ------------------------------------------------------------

function NutritionMiniCard({
  label,
  value,
  unit,
  highlight = false,
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 ${
        highlight
          ? "bg-[#17251a] text-white"
          : "bg-gray-50 text-gray-800"
      }`}
    >
      <p
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          highlight
            ? "text-white/60"
            : "text-gray-400"
        }`}
      >
        {label}
      </p>

      <p className="mt-1 text-sm font-bold">
        {value}
        <span
          className={`ml-1 text-[10px] font-medium ${
            highlight
              ? "text-white/50"
              : "text-gray-400"
          }`}
        >
          {unit}
        </span>
      </p>
    </div>
  );
}

// ------------------------------------------------------------
// Empty meal state
// ------------------------------------------------------------

function EmptyMealState({
  mealName,
  onAddFood,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
        <Plus size={22} />
      </div>

      <h3 className="mt-4 text-sm font-bold text-gray-700">
        No foods added yet
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
        Add foods to your {mealName.toLowerCase()} plan
        to start tracking its nutrition.
      </p>

      <button
        type="button"
        onClick={onAddFood}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#4dbb08] shadow-sm ring-1 ring-gray-100 transition hover:bg-[#4dbb08] hover:text-white"
      >
        <Plus size={15} />
        Add First Food
      </button>
    </div>
  );
}