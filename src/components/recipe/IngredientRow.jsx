"use client";

import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import {
  INGREDIENT_DATABASE,
  UNIT_OPTIONS,
} from "./recipeUtils";

export default function IngredientRow({
  ingredient,
  index,
  error,
  onChange,
  onRemove,
}) {
  const selectedIngredient = INGREDIENT_DATABASE.find(
    (item) => item.id === ingredient.ingredientId
  );

  // Only show units that make sense for the selected ingredient.
  const availableUnits = selectedIngredient
    ? UNIT_OPTIONS.filter((unit) => {
        if (selectedIngredient.unit === "g") {
          return unit.value === "g" || unit.value === "kg";
        }

        if (selectedIngredient.unit === "ml") {
          return unit.value === "ml";
        }

        if (selectedIngredient.unit === "serving") {
          return unit.value === "serving";
        }

        return false;
      })
    : UNIT_OPTIONS;

  const handleIngredientChange = (event) => {
    const ingredientId = event.target.value;

    const newIngredient = INGREDIENT_DATABASE.find(
      (item) => item.id === ingredientId
    );

    // Automatically choose the appropriate unit when an
    // ingredient is selected.
    onChange(index, {
      ingredientId,
      unit: newIngredient?.unit || "g",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_150px_130px_auto] md:items-start">
        {/* Ingredient */}
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ingredient
          </label>

          <select
            value={ingredient.ingredientId}
            onChange={handleIngredientChange}
            className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white ${
              error?.ingredientId
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <option value="">Select ingredient</option>

            {INGREDIENT_DATABASE.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          {error?.ingredientId && (
            <p className="mt-1 text-xs text-red-500">
              {error.ingredientId}
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
            step="0.01"
            value={ingredient.quantity}
            onChange={(event) =>
              onChange(index, {
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
            value={ingredient.unit}
            onChange={(event) =>
              onChange(index, {
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
              <option key={unit.value} value={unit.value}>
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

        {/* Remove */}
        <div className="flex md:pt-7">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRemove(index)}
            disabled={false}
            aria-label={`Remove ingredient ${index + 1}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={17} />
          </motion.button>
        </div>
      </div>

      {/* Selected ingredient information */}
      {selectedIngredient && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-100 pt-3 text-xs text-gray-400">
          <span>
            {selectedIngredient.calories} kcal /{" "}
            {selectedIngredient.unit === "serving"
              ? "serving"
              : `100${selectedIngredient.unit}`}
          </span>

          <span>
            Protein: {selectedIngredient.protein}g
          </span>

          <span>
            Carbs: {selectedIngredient.carbs}g
          </span>

          <span>
            Fat: {selectedIngredient.fat}g
          </span>

          <span>
            Fiber: {selectedIngredient.fiber}g
          </span>
        </div>
      )}
    </motion.div>
  );
}