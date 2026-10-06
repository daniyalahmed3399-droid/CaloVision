import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import onboardingReducer from "./slices/onboardingSlice";
import calorieCalculatorReducer from "./slices/calorieCalculatorSlice";
import bmiReducer from "./slices/bmiSlice";
import mealPlannerReducer from "./slices/mealPlannerSlice";
import recipeReducer from "./slices/recipeSlice";
import trackingReducer from "./slices/trackingSlice";
import { api } from "./api";
import { persistenceListener } from "./persistence";
import { sessionListener } from "./sessionListener";

// A new store is created per request/render tree (see StoreProvider), never
// as a module-level singleton, so state can't leak between users on the
// server.
//
// To add a feature: create a slice in ./slices, register its reducer below.
// For server data, inject endpoints into `api` instead of writing thunks.
export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      onboarding: onboardingReducer,
      calorieCalculator: calorieCalculatorReducer,
      bmi: bmiReducer,
      mealPlanner: mealPlannerReducer,
      recipe: recipeReducer,
      tracking: trackingReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(
          persistenceListener.middleware,
          sessionListener.middleware
        )
        .concat(api.middleware),
  });
}
