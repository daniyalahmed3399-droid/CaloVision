"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  RotateCcw,
  Save,
} from "lucide-react";

import DailyNutrition from "./DailyNutrition";
import MealSection from "./MealSection";

import {
  MEAL_TYPES,
  calculateDailyNutrition,
  validateFoodItem,
  savePlannerToStorage,
} from "./mealPlannerUtils";

import {
  useAppDispatch,
  useAppSelector,
} from "../../lib/store/hooks";
import {
  calorieTargetChanged,
  foodAdded,
  foodChanged,
  foodMoved,
  foodRemoved,
  foodReordered,
  plannerReset,
  saveMessageSet,
  validateCalorieTarget,
  validationFailed,
} from "../../lib/store/slices/mealPlannerSlice";
import { PLANNER_STORAGE_KEY } from "../../lib/store/persistence";

export default function MealPlanner() {
  // The planner, its validation errors and the save message live in the
  // mealPlanner slice. Edits are auto-saved to localStorage by the
  // persistence listener, so this component only dispatches actions.
  const dispatch = useAppDispatch();

  const { planner, errors, saveMessage } = useAppSelector(
    (state) => state.mealPlanner
  );

  // ----------------------------------------------------------
  // Calculate daily nutrition
  // ----------------------------------------------------------

  const dailyNutrition = useMemo(() => {
    return calculateDailyNutrition(planner.meals);
  }, [planner.meals]);

  // ----------------------------------------------------------
  // Food item actions
  // ----------------------------------------------------------

  const handleAddFood = (mealId, foodItem) => {
    dispatch(foodAdded({ mealId, foodItem }));
  };

  const handleChangeFood = (mealId, itemId, changes) => {
    dispatch(foodChanged({ mealId, itemId, changes }));
  };

  const handleRemoveFood = (mealId, itemId) => {
    dispatch(foodRemoved({ mealId, itemId }));
  };

  const handleMoveFood = (fromMeal, toMeal, itemId) => {
    dispatch(foodMoved({ fromMeal, toMeal, itemId }));
  };

  const handleMoveFoodUp = (mealId, index) => {
    if (index <= 0) {
      return;
    }

    dispatch(
      foodReordered({ mealId, from: index, to: index - 1 })
    );
  };

  const handleMoveFoodDown = (mealId, index) => {
    const items = planner.meals[mealId];

    if (!items || index >= items.length - 1) {
      return;
    }

    dispatch(
      foodReordered({ mealId, from: index, to: index + 1 })
    );
  };

  // ----------------------------------------------------------
  // Change calorie target
  // ----------------------------------------------------------

  const handleCalorieTargetChange = (value) => {
    dispatch(calorieTargetChanged(value));
  };

  // ----------------------------------------------------------
  // Reset planner
  // ----------------------------------------------------------

  const handleReset = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear today's entire meal plan?"
    );

    if (!confirmed) {
      return;
    }

    dispatch(plannerReset());
  };

  // ----------------------------------------------------------
  // Manual save / validation
  // ----------------------------------------------------------

  const handleSavePlan = () => {
    const mealErrors = {};

    MEAL_TYPES.forEach((meal) => {
      mealErrors[meal.id] = {};

      (planner.meals[meal.id] || []).forEach((item) => {
        const itemErrors = validateFoodItem(item);

        if (Object.keys(itemErrors).length > 0) {
          mealErrors[meal.id][item.id] = itemErrors;
        }
      });
    });

    const calorieError = validateCalorieTarget(
      planner.calorieTarget
    );

    const hasFoodErrors = Object.values(mealErrors).some(
      (mealError) => Object.keys(mealError).length > 0
    );

    if (calorieError || hasFoodErrors) {
      dispatch(
        validationFailed({
          calorieTarget: calorieError,
          meals: mealErrors,
        })
      );

      return;
    }

    const saved = savePlannerToStorage(
      PLANNER_STORAGE_KEY,
      planner
    );

    dispatch(
      saveMessageSet(
        saved
          ? "Meal plan saved successfully"
          : "Unable to save the meal plan"
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f6f9f1]">
      {/* ================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================== */}

      <section className="relative overflow-hidden bg-[#4dbb08] px-6 pb-16 pt-28 lg:px-8 lg:pb-20 lg:pt-32">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-40 left-[10%] h-72 w-72 rounded-full border-[45px] border-white/10" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          {/* Back to CaloVision */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <span className="text-base">←</span>
            Back to CaloVision
          </Link>

          {/* Animated heading */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="max-w-3xl"
          >
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
              <CalendarDays size={18} />
              Daily Meal Planner
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Plan Your Day.
              <span className="block pt-2 text-[#f5d547] sm:pt-3">
                Track Your Nutrition.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Build your daily meal plan, adjust portions,
              and keep track of your calories and
              macronutrients throughout the day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================== */}
      {/* MAIN MEAL PLANNER */}
      {/* ================================================== */}

      <div className="relative mx-auto max-w-[1280px] px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        {/* Save status / actions */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex min-h-[24px] items-center gap-2">
            {saveMessage && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex items-center gap-2 text-xs font-medium text-gray-500"
              >
                <CheckCircle2
                  size={15}
                  className="text-[#4dbb08]"
                />

                {saveMessage}
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-gray-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50"
            >
              <RotateCcw size={15} />
              Clear Day
            </motion.button>

            <motion.button
              type="button"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={handleSavePlan}
              className="inline-flex items-center gap-2 rounded-xl bg-[#17251a] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#4dbb08]"
            >
              <Save size={15} />
              Save Plan
            </motion.button>
          </div>
        </div>

        {/* Validation error */}
        {errors.calorieTarget && (
          <motion.p
            initial={{
              opacity: 0,
              y: -5,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-3 text-right text-xs font-medium text-red-500"
          >
            {errors.calorieTarget}
          </motion.p>
        )}

        {/* Daily nutrition */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.6,
          }}
          className="mt-7"
        >
          <DailyNutrition
            nutrition={dailyNutrition}
            calorieTarget={
              planner.calorieTarget
            }
            onCalorieTargetChange={
              handleCalorieTargetChange
            }
          />
        </motion.div>

        {/* Meal sections */}
        <div className="mt-7 space-y-6">
          {MEAL_TYPES.map(
            (meal, index) => (
              <motion.div
                key={meal.id}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay:
                    0.15 +
                    index * 0.08,
                  duration: 0.5,
                }}
              >
                <MealSection
                  meal={meal}
                  items={
                    planner.meals[
                      meal.id
                    ] || []
                  }
                  errors={
                    errors.meals?.[
                      meal.id
                    ] || {}
                  }
                  allMeals={MEAL_TYPES}
                  onAddFood={
                    handleAddFood
                  }
                  onChangeFood={
                    handleChangeFood
                  }
                  onRemoveFood={
                    handleRemoveFood
                  }
                  onMoveFood={
                    handleMoveFood
                  }
                  onMoveFoodUp={
                    handleMoveFoodUp
                  }
                  onMoveFoodDown={
                    handleMoveFoodDown
                  }
                />
              </motion.div>
            )
          )}
        </div>

        {/* Bottom information */}
        <div className="mt-8 rounded-2xl bg-[#f3f7ef] p-5 text-center">
          <p className="text-xs leading-6 text-gray-500">
            Your meal plan is automatically saved in
            your browser. You can adjust foods and
            quantities throughout the day and your
            nutrition totals will update instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
