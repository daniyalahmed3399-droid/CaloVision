"use client";

import { motion } from "motion/react";
import {
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  Target,
  AlertCircle,
} from "lucide-react";

import {
  calculateProgress,
  calculateRemainingCalories,
  formatCalories,
  formatNutrition,
} from "./mealPlannerUtils";

const macroItems = [
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    icon: Beef,
    target: 120,
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    icon: Wheat,
    target: 250,
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    icon: Droplets,
    target: 70,
  },
  {
    key: "fiber",
    label: "Fiber",
    unit: "g",
    icon: Leaf,
    target: 30,
  },
];

export default function DailyNutrition({
  nutrition,
  calorieTarget,
  onCalorieTargetChange,
}) {
  const safeNutrition = {
    calories: Number(nutrition?.calories) || 0,
    protein: Number(nutrition?.protein) || 0,
    carbs: Number(nutrition?.carbs) || 0,
    fat: Number(nutrition?.fat) || 0,
    fiber: Number(nutrition?.fiber) || 0,
  };

  const target = Number(calorieTarget) || 0;

  const remainingCalories =
    calculateRemainingCalories(
      target,
      safeNutrition.calories
    );

  const calorieProgress =
    calculateProgress(
      safeNutrition.calories,
      target
    );

  const caloriesExceeded =
    remainingCalories < 0;

  return (
    <section className="overflow-hidden rounded-[30px] bg-[#17251a] p-5 text-white shadow-[0_20px_50px_rgba(23,37,26,0.15)] sm:p-7 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4dbb08]">
              <Target size={17} />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/60">
              Daily Nutrition
            </span>
          </div>

          <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Today&apos;s Nutrition
          </h2>

          <p className="mt-2 max-w-xl text-xs leading-6 text-white/55 sm:text-sm">
            Keep track of your meals and see how close
            you are to your daily nutrition goals.
          </p>
        </div>

        {/* Calorie target */}
        <div className="w-full lg:w-[220px]">
          <label
            htmlFor="daily-calorie-target"
            className="mb-2 block text-xs font-semibold text-white/60"
          >
            Daily Calorie Target
          </label>

          <div className="flex items-center rounded-xl bg-white/10 p-1.5 ring-1 ring-white/10">
            <input
              id="daily-calorie-target"
              type="number"
              min="1"
              max="10000"
              step="1"
              value={calorieTarget}
              onChange={(event) =>
                onCalorieTargetChange(
                  event.target.value
                )
              }
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm font-bold text-white outline-none placeholder:text-white/30"
              placeholder="2000"
            />

            <span className="pr-3 text-xs font-semibold text-white/40">
              kcal
            </span>
          </div>
        </div>
      </div>

      {/* Calorie overview */}
      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_270px]">
        <div className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/[0.08] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Flame
                size={18}
                className="text-[#f5d547]"
              />

              <span className="text-sm font-semibold text-white/75">
                Calories Consumed
              </span>
            </div>

            <span className="text-xs font-medium text-white/40">
              {Math.round(calorieProgress)}%
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-x-2">
            <motion.span
              key={Math.round(
                safeNutrition.calories
              )}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl"
            >
              {formatCalories(
                safeNutrition.calories
              )}
            </motion.span>

            <span className="mb-1.5 text-sm text-white/40">
              / {formatCalories(target)} kcal
            </span>
          </div>

          {/* Progress */}
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${calorieProgress}%`,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${
                caloriesExceeded
                  ? "bg-red-400"
                  : "bg-[#4dbb08]"
              }`}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-white/40">
              0 kcal
            </span>

            <span className="text-white/40">
              {formatCalories(target)} kcal
            </span>
          </div>
        </div>

        {/* Remaining calories */}
        <div
          className={`rounded-2xl p-5 sm:p-6 ${
            caloriesExceeded
              ? "bg-red-400/10 ring-1 ring-red-400/20"
              : "bg-[#4dbb08]/10 ring-1 ring-[#4dbb08]/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {caloriesExceeded ? (
              <AlertCircle
                size={18}
                className="text-red-300"
              />
            ) : (
              <Target
                size={18}
                className="text-[#74d72b]"
              />
            )}

            <span className="text-sm font-semibold text-white/70">
              {caloriesExceeded
                ? "Over Target"
                : "Remaining Calories"}
            </span>
          </div>

          <div className="mt-4">
            <motion.span
              key={Math.round(
                remainingCalories
              )}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`text-4xl font-extrabold ${
                caloriesExceeded
                  ? "text-red-300"
                  : "text-[#74d72b]"
              }`}
            >
              {formatCalories(
                Math.abs(
                  remainingCalories
                )
              )}
            </motion.span>

            <span className="ml-2 text-xs text-white/40">
              kcal
            </span>
          </div>

          <p className="mt-3 text-xs leading-5 text-white/45">
            {caloriesExceeded
              ? "You have gone above your calorie target for today."
              : remainingCalories === 0
                ? "You have reached your calorie target."
                : "Calories still available for your meals today."}
          </p>
        </div>
      </div>

      {/* Macro progress */}
      <div className="mt-5 rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/[0.08] sm:p-6">
        <div className="mb-5">
          <h3 className="text-sm font-bold text-white">
            Macronutrients
          </h3>

          <p className="mt-1 text-xs text-white/40">
            Track your major daily nutrition alongside
            calories.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {macroItems.map((item, index) => {
            const Icon = item.icon;

            const value =
              safeNutrition[item.key];

            const progress =
              calculateProgress(
                value,
                item.target
              );

            return (
              <motion.div
                key={item.key}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.05,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={15}
                      className="text-[#74d72b]"
                    />

                    <span className="text-xs font-semibold text-white/65">
                      {item.label}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white">
                    {formatNutrition(value)}{" "}
                    <span className="font-medium text-white/35">
                      / {item.target}
                      {item.unit}
                    </span>
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[#4dbb08]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}