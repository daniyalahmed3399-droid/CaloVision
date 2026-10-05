import { createSlice, current } from "@reduxjs/toolkit";

import {
  createInitialPlanner,
  moveFoodItem,
  reorderFoodItem,
} from "../../../components/meal-planner/mealPlannerUtils";

const emptyErrors = () => ({ calorieTarget: "", meals: {} });

export function validateCalorieTarget(value) {
  if (value === "" || value === null || value === undefined) {
    return "Enter a calorie target.";
  }

  const numeric = Number(value);

  if (!Number.isFinite(numeric)) return "Enter a valid calorie target.";
  if (numeric <= 0) return "Calorie target must be greater than zero.";
  if (numeric > 10000) return "Calorie target cannot exceed 10,000 kcal.";

  return "";
}

function clearFoodError(state, mealId, itemId) {
  const mealErrors = state.errors.meals?.[mealId];

  if (mealErrors?.[itemId]) delete mealErrors[itemId];
}

// State for the /meal-planner tool. The planner itself is saved to
// localStorage by the persistence listener (see ../persistence.js).
const mealPlannerSlice = createSlice({
  name: "mealPlanner",
  initialState: {
    planner: createInitialPlanner(),
    loaded: false, // true once localStorage has been read
    errors: emptyErrors(),
    saveMessage: "",
  },
  reducers: {
    plannerHydrated(state, action) {
      state.planner = action.payload;
      state.loaded = true;
    },
    foodAdded(state, action) {
      const { mealId, foodItem } = action.payload;
      state.planner.meals[mealId].push(foodItem);
    },
    foodChanged(state, action) {
      const { mealId, itemId, changes } = action.payload;
      const item = state.planner.meals[mealId].find((i) => i.id === itemId);

      if (item) Object.assign(item, changes);
      clearFoodError(state, mealId, itemId);
    },
    foodRemoved(state, action) {
      const { mealId, itemId } = action.payload;

      state.planner.meals[mealId] = state.planner.meals[mealId].filter(
        (item) => item.id !== itemId
      );
      clearFoodError(state, mealId, itemId);
    },
    foodMoved(state, action) {
      const { fromMeal, toMeal, itemId } = action.payload;

      if (fromMeal === toMeal) return;

      state.planner.meals = moveFoodItem(
        current(state.planner.meals),
        fromMeal,
        toMeal,
        itemId
      );

      // Validation errors travel with the item.
      const sourceErrors = state.errors.meals?.[fromMeal];

      if (sourceErrors?.[itemId]) {
        state.errors.meals[toMeal] = {
          ...(state.errors.meals[toMeal] || {}),
          [itemId]: sourceErrors[itemId],
        };
        delete sourceErrors[itemId];
      }
    },
    foodReordered(state, action) {
      const { mealId, from, to } = action.payload;

      state.planner.meals = reorderFoodItem(
        current(state.planner.meals),
        mealId,
        from,
        to
      );
    },
    calorieTargetChanged(state, action) {
      state.planner.calorieTarget = action.payload;
      state.errors.calorieTarget = validateCalorieTarget(action.payload);
    },
    plannerReset(state) {
      state.planner = createInitialPlanner();
      state.errors = emptyErrors();
      state.saveMessage = "Meal plan cleared";
    },
    validationFailed(state, action) {
      state.errors = action.payload;
      state.saveMessage = "Please fix the highlighted fields";
    },
    saveMessageSet(state, action) {
      state.saveMessage = action.payload;
    },
  },
});

export const {
  plannerHydrated,
  foodAdded,
  foodChanged,
  foodRemoved,
  foodMoved,
  foodReordered,
  calorieTargetChanged,
  plannerReset,
  validationFailed,
  saveMessageSet,
} = mealPlannerSlice.actions;

export default mealPlannerSlice.reducer;
