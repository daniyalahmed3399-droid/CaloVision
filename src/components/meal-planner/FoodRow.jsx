"use client";

import { motion } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  MoveRight,
  Trash2,
} from "lucide-react";

import {
  FOOD_DATABASE,
  getAvailableUnits,
  calculateFoodNutrition,
  formatCalories,
  formatNutrition,
} from "./mealPlannerUtils";

export default function FoodRow({
  item,
  index,
  totalItems,
  currentMeal,
  mealOptions,
  error,
  onChange,
  onRemove,
  onMove,
  onMoveUp,
  onMoveDown,
}) {
  const food = FOOD_DATABASE.find(
    (foodItem) => foodItem.id === item.foodId
  );

  const availableUnits = getAvailableUnits(food);

  const nutrition = calculateFoodNutrition(
    food,
    item.quantity,
    item.unit
  );

  const handleFoodChange = (event) => {
    const foodId = event.target.value;

    const selectedFood = FOOD_DATABASE.find(
      (foodItem) => foodItem.id === foodId
    );

    onChange({
      foodId,
      unit: selectedFood?.unit || "g",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_130px_120px_auto] lg:items-start">
        {/* Food */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Food
          </label>

          <select
            value={item.foodId}
            onChange={handleFoodChange}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white ${
              error?.foodId
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <option value="">
              Select food
            </option>

            {FOOD_DATABASE.map((foodItem) => (
              <option
                key={foodItem.id}
                value={foodItem.id}
              >
                {foodItem.name}
              </option>
            ))}
          </select>

          {error?.foodId && (
            <p className="mt-1 text-xs text-red-500">
              {error.foodId}
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Quantity
          </label>

          <input
            type="number"
            min="0"
            step="0.1"
            value={item.quantity}
            onChange={(event) =>
              onChange({
                quantity: event.target.value,
              })
            }
            placeholder="0"
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white ${
              error?.quantity
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />

          {error?.quantity && (
            <p className="mt-1 text-xs text-red-500">
              {error.quantity}
            </p>
          )}
        </div>

        {/* Unit */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Unit
          </label>

          <select
            value={item.unit}
            onChange={(event) =>
              onChange({
                unit: event.target.value,
              })
            }
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white ${
              error?.unit
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            {availableUnits.map((unit) => (
              <option
                key={unit.value}
                value={unit.value}
              >
                {unit.label}
              </option>
            ))}
          </select>

          {error?.unit && (
            <p className="mt-1 text-xs text-red-500">
              {error.unit}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 lg:pt-7">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Move food up"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-[#f3f7ef] hover:text-[#4dbb08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronUp size={17} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMoveDown}
            disabled={index === totalItems - 1}
            aria-label="Move food down"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-[#f3f7ef] hover:text-[#4dbb08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronDown size={17} />
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRemove}
            aria-label="Remove food"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Move food to another meal */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs font-medium text-gray-400">
          Move to:
        </span>

        {mealOptions
          .filter(
            (meal) => meal.id !== currentMeal
          )
          .map((meal) => (
            <button
              key={meal.id}
              type="button"
              onClick={() => onMove(meal.id)}
              className="inline-flex items-center gap-1 rounded-lg bg-[#f3f7ef] px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-[#4dbb08] hover:text-white"
            >
              {meal.label}
              <MoveRight size={13} />
            </button>
          ))}
      </div>

      {/* Nutrition preview */}
      {food && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-500">
          <span className="font-semibold text-gray-800">
            {formatCalories(nutrition.calories)} kcal
          </span>

          <span>
            Protein:{" "}
            {formatNutrition(nutrition.protein)}g
          </span>

          <span>
            Carbs:{" "}
            {formatNutrition(nutrition.carbs)}g
          </span>

          <span>
            Fat:{" "}
            {formatNutrition(nutrition.fat)}g
          </span>

          <span>
            Fiber:{" "}
            {formatNutrition(nutrition.fiber)}g
          </span>
        </div>
      )}
    </motion.div>
  );
}