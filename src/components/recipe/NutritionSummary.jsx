"use client";

import { motion } from "motion/react";
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
} from "lucide-react";
import { formatNutrition } from "./recipeUtils";

const nutritionItems = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    icon: Flame,
    max: 800,
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    icon: Beef,
    max: 60,
  },
  {
    key: "carbs",
    label: "Carbohydrates",
    unit: "g",
    icon: Wheat,
    max: 100,
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    icon: Droplets,
    max: 40,
  },
  {
    key: "fiber",
    label: "Fiber",
    unit: "g",
    icon: Leaf,
    max: 20,
  },
];

export default function NutritionSummary({
  nutrition,
  servings,
}) {
  const safeNutrition = nutrition || {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  };

  return (
    <div className="space-y-6">
      {/* Main calories card */}
      <div className="relative overflow-hidden rounded-[28px] bg-[#17251a] p-7 text-white shadow-[0_20px_50px_rgba(23,37,26,0.15)]">
        <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#4dbb08]/20" />

        <div className="relative">
          <div className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Flame size={17} className="text-[#f5d547]" />
            Calories Per Serving
          </div>

          <div className="mt-3 flex items-end gap-2">
            <motion.span
              key={Math.round(safeNutrition.calories)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-extrabold tracking-tight"
            >
              {formatNutrition(safeNutrition.calories)}
            </motion.span>

            <span className="mb-2 text-sm text-white/60">
              kcal
            </span>
          </div>

          <p className="mt-2 text-xs text-white/60">
            Based on {servings || 1} serving
            {(Number(servings) || 1) !== 1 ? "s" : ""} for this recipe.
          </p>
        </div>
      </div>

      {/* Macro cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {nutritionItems.slice(1, 5).map((item, index) => {
          const Icon = item.icon;

          const value = Number(safeNutrition[item.key]) || 0;

          const percentage = Math.min(
            (value / item.max) * 100,
            100
          );

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-gray-500">
                <Icon size={16} />
                <span className="text-xs font-semibold">
                  {item.label}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xl font-bold text-gray-900">
                  {formatNutrition(value)}
                </span>

                <span className="ml-1 text-xs text-gray-400">
                  {item.unit}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full bg-[#4dbb08]"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detailed breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900">
            Nutrition Breakdown
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            Estimated nutritional values for one serving of your
            recipe.
          </p>
        </div>

        <div className="space-y-5">
          {nutritionItems.map((item) => {
            const Icon = item.icon;
            const value = Number(safeNutrition[item.key]) || 0;

            const percentage = Math.min(
              (value / item.max) * 100,
              100
            );

            return (
              <div key={item.key}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-[#4dbb08]" />

                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-sm font-bold text-gray-900">
                    {formatNutrition(value)}
                    {item.unit === "kcal" ? " kcal" : "g"}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[#4dbb08]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="rounded-2xl bg-[#f3f7ef] p-5">
        <h4 className="text-sm font-bold text-gray-900">
          How this works
        </h4>

        <p className="mt-2 text-xs leading-6 text-gray-600">
          Nutrition is calculated from the selected ingredient,
          quantity, and unit. The complete recipe is calculated
          first, then divided by the number of servings to give
          you the nutrition per serving.
        </p>
      </div>
    </div>
  );
}