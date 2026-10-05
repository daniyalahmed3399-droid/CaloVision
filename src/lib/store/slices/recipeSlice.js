import { createSelector, createSlice, nanoid } from "@reduxjs/toolkit";

import { calculateRecipeNutrition } from "../../../components/recipe/recipeUtils";

export const createIngredient = (id = nanoid()) => ({
  id,
  ingredientId: "",
  quantity: "",
  unit: "g",
});

const emptyErrors = () => ({ ingredients: {}, servings: "" });

const initialState = {
  recipeName: "",
  servings: 4,
  ingredients: [createIngredient("initial")],
  errors: emptyErrors(),
  savedRecipes: [],
  savedMessage: "",
  showSavedRecipes: false,
  editingRecipeId: null,
};

// State for the /recipe-nutrition tool. Saved recipes are written to
// localStorage by the persistence listener (see ../persistence.js).
const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    savedRecipesLoaded(state, action) {
      state.savedRecipes = action.payload;
    },
    recipeNameChanged(state, action) {
      state.recipeName = action.payload;
    },
    servingsChanged(state, action) {
      state.servings = action.payload;
      state.errors.servings = "";
    },
    ingredientUpdated(state, action) {
      const { index, changes } = action.payload;

      Object.assign(state.ingredients[index], changes);
      // Clear this row's errors once the user edits it again.
      state.errors.ingredients[index] = {};
    },
    ingredientAdded: {
      reducer(state, action) {
        state.ingredients.push(createIngredient(action.payload));
      },
      prepare: () => ({ payload: nanoid() }),
    },
    ingredientRemoved(state, action) {
      state.ingredients.splice(action.payload, 1);
      state.errors.ingredients = {};
    },
    errorsSet(state, action) {
      state.errors = action.payload;
      if (action.payload) state.savedMessage = "";
    },
    // payload: { recipe, isEditing }
    recipeSaved(state, action) {
      const { recipe, isEditing } = action.payload;
      const exists = state.savedRecipes.some((r) => r.id === recipe.id);

      state.savedRecipes = exists
        ? state.savedRecipes.map((r) => (r.id === recipe.id ? recipe : r))
        : [recipe, ...state.savedRecipes];

      state.editingRecipeId = recipe.id;
      state.savedMessage = isEditing
        ? "Recipe updated successfully."
        : "Recipe saved successfully.";
    },
    savedMessageCleared(state) {
      state.savedMessage = "";
    },
    recipeLoaded(state, action) {
      const recipe = action.payload;

      state.recipeName = recipe.name || "";
      state.servings = recipe.servings || 1;
      state.ingredients =
        Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
          ? recipe.ingredients
          : [createIngredient()];
      state.editingRecipeId = recipe.id;
      state.errors = emptyErrors();
      state.savedMessage = "";
      state.showSavedRecipes = false;
    },
    recipeDeleted(state, action) {
      state.savedRecipes = state.savedRecipes.filter(
        (r) => r.id !== action.payload
      );

      // Deleting the recipe being edited starts a fresh one.
      if (state.editingRecipeId === action.payload) {
        return { ...initialState, savedRecipes: state.savedRecipes };
      }
    },
    calculatorReset(state) {
      return {
        ...initialState,
        ingredients: [createIngredient()],
        savedRecipes: state.savedRecipes,
      };
    },
    savedRecipesToggled(state) {
      state.showSavedRecipes = !state.showSavedRecipes;
    },
  },
});

export const {
  savedRecipesLoaded,
  recipeNameChanged,
  servingsChanged,
  ingredientUpdated,
  ingredientAdded,
  ingredientRemoved,
  errorsSet,
  recipeSaved,
  savedMessageCleared,
  recipeLoaded,
  recipeDeleted,
  calculatorReset,
  savedRecipesToggled,
} = recipeSlice.actions;

// Nutrition is derived, never stored: it recalculates (memoized) whenever
// the ingredients or servings change.
export const selectRecipeNutrition = createSelector(
  [(state) => state.recipe.ingredients, (state) => state.recipe.servings],
  (ingredients, servings) => calculateRecipeNutrition(ingredients, servings)
);

export default recipeSlice.reducer;
