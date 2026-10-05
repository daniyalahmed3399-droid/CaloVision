import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import {
  loadPlannerFromStorage,
  savePlannerToStorage,
} from "../../components/meal-planner/mealPlannerUtils";
import {
  calorieTargetChanged,
  foodAdded,
  foodChanged,
  foodMoved,
  foodRemoved,
  foodReordered,
  plannerHydrated,
  plannerReset,
  saveMessageSet,
} from "./slices/mealPlannerSlice";
import {
  recipeDeleted,
  recipeSaved,
  savedMessageCleared,
  savedRecipesLoaded,
} from "./slices/recipeSlice";

// Everything that is saved to localStorage lives here, so slices stay pure
// and storage behaviour is in one place. Keys are unchanged from the
// pre-Redux version, so existing saved data keeps working.
export const PLANNER_STORAGE_KEY = "calovision-meal-planner";
export const RECIPES_STORAGE_KEY = "calovision_saved_recipes";

function loadRecipes() {
  try {
    const stored = localStorage.getItem(RECIPES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load saved recipes:", error);
    return [];
  }
}

// Reads saved data into the store. Dispatched once on the client.
export const hydratePersisted = () => (dispatch) => {
  dispatch(plannerHydrated(loadPlannerFromStorage(PLANNER_STORAGE_KEY)));
  dispatch(savedRecipesLoaded(loadRecipes()));
};

export const persistenceListener = createListenerMiddleware();

// Auto-save the meal planner after every edit (but not before the saved
// data has been loaded, so defaults can't overwrite it).
persistenceListener.startListening({
  matcher: isAnyOf(
    foodAdded,
    foodChanged,
    foodRemoved,
    foodMoved,
    foodReordered,
    calorieTargetChanged,
    plannerReset
  ),
  effect: async (action, api) => {
    const { mealPlanner } = api.getState();

    if (!mealPlanner.loaded) return;

    savePlannerToStorage(PLANNER_STORAGE_KEY, mealPlanner.planner);

    // Resetting shows its own "Meal plan cleared" message.
    if (plannerReset.match(action)) return;

    api.cancelActiveListeners();
    api.dispatch(saveMessageSet("Changes saved automatically"));
    await api.delay(1800);
    api.dispatch(saveMessageSet(""));
  },
});

// Persist saved recipes whenever one is added, edited or deleted.
persistenceListener.startListening({
  matcher: isAnyOf(recipeSaved, recipeDeleted),
  effect: async (action, api) => {
    try {
      localStorage.setItem(
        RECIPES_STORAGE_KEY,
        JSON.stringify(api.getState().recipe.savedRecipes)
      );
    } catch (error) {
      console.error("Could not save recipes:", error);
    }

    if (recipeSaved.match(action)) {
      api.cancelActiveListeners();
      await api.delay(2500);
      api.dispatch(savedMessageCleared());
    }
  },
});
