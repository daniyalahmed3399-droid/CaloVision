"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChefHat,
  Info,
  Plus,
  Save,
  Trash2,
  Utensils,
} from "lucide-react";
import Link from "next/link";

import IngredientRow from "./IngredientRow";
import NutritionSummary from "./NutritionSummary";

import {
  hasRecipeErrors,
  validateRecipe,
} from "./recipeUtils";

import {
  useAppDispatch,
  useAppSelector,
} from "../../lib/store/hooks";
import {
  calculatorReset,
  errorsSet,
  ingredientAdded,
  ingredientRemoved,
  ingredientUpdated,
  recipeDeleted,
  recipeLoaded,
  recipeNameChanged,
  recipeSaved,
  savedRecipesToggled,
  selectRecipeNutrition,
  servingsChanged,
} from "../../lib/store/slices/recipeSlice";

export default function RecipeNutritionCalculator() {
  // Recipe form, validation errors and saved recipes live in the recipe
  // slice. Saved recipes are written to localStorage by the persistence
  // listener, and the success message clears itself there too.
  const dispatch = useAppDispatch();

  const {
    recipeName,
    servings,
    ingredients,
    errors,
    savedRecipes,
    savedMessage,
    showSavedRecipes,
    editingRecipeId,
  } = useAppSelector((state) => state.recipe);

  // Nutrition is derived by a memoized selector, so it updates whenever
  // the ingredients or servings change.
  const nutrition = useAppSelector(selectRecipeNutrition);

  const setRecipeName = (name) =>
    dispatch(recipeNameChanged(name));

  const setServings = (value) =>
    dispatch(servingsChanged(value));

  const toggleSavedRecipes = () =>
    dispatch(savedRecipesToggled());

  // ----------------------------------------------------------
  // Ingredient actions
  // ----------------------------------------------------------

  const updateIngredient = (index, changes) => {
    dispatch(ingredientUpdated({ index, changes }));
  };

  const addIngredient = () => {
    dispatch(ingredientAdded());
  };

  const removeIngredient = (index) => {
    dispatch(ingredientRemoved(index));
  };

  // ----------------------------------------------------------
  // Save or update a recipe
  // ----------------------------------------------------------

  const saveRecipe = () => {
    const isEditing = Boolean(editingRecipeId);

    // Don't save invalid recipes.
    const validationErrors = validateRecipe(
      ingredients,
      servings
    );

    dispatch(errorsSet(validationErrors));

    if (hasRecipeErrors(validationErrors)) {
      return;
    }

    const recipe = {
      id:
        editingRecipeId ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}`,

      name: recipeName.trim() || "My Nutrition Recipe",

      servings: Number(servings),

      ingredients: ingredients.map((ingredient) => ({
        ...ingredient,
      })),

      nutrition,

      updatedAt: new Date().toISOString(),
    };

    dispatch(recipeSaved({ recipe, isEditing }));
  };

  // ----------------------------------------------------------
  // Load / delete / reset
  // ----------------------------------------------------------

  const loadRecipe = (recipe) => {
    dispatch(recipeLoaded(recipe));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteRecipe = (recipeId) => {
    dispatch(recipeDeleted(recipeId));
  };

  const resetCalculator = () => {
    dispatch(calculatorReset());
  };

  return (
    <div className="min-h-screen bg-[#f6f9f1] pb-20">
      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <section className="relative overflow-hidden bg-[#4dbb08] px-6 pb-16 pt-32 lg:px-8 lg:pb-20">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[50px] border-white/10" />

        <div className="pointer-events-none absolute -bottom-40 left-[10%] h-72 w-72 rounded-full border-[45px] border-white/10" />

        <div className="relative z-10 mx-auto max-w-[1200px]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to CaloVision
          </Link>

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
              <ChefHat size={18} />
              Recipe Nutrition
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build Your Recipe,
              <span className="block text-[#f5d547]">
                Know Your Nutrition
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
              Add your ingredients and quantities to
              instantly calculate calories, protein,
              carbohydrates, fat, and fiber for the
              complete recipe and each serving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================== */}
      {/* MAIN CALCULATOR */}
      {/* ================================================== */}

      <section className="px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* ================================================== */}
          {/* LEFT COLUMN */}
          {/* ================================================== */}

          <div className="space-y-6">
            {/* ------------------------------------------------ */}
            {/* Recipe Details */}
            {/* ------------------------------------------------ */}

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
                duration: 0.6,
              }}
              className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
                    Recipe Details
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Start Your Recipe
                  </h2>
                </div>

                {editingRecipeId && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={14} />
                    Editing saved recipe
                  </span>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Recipe name */}
                <div>
                  <label
                    htmlFor="recipe-name"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Recipe Name
                  </label>

                  <input
                    id="recipe-name"
                    type="text"
                    value={recipeName}
                    onChange={(event) =>
                      setRecipeName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Chicken Rice Bowl"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white"
                  />
                </div>

                {/* Servings */}
                <div>
                  <label
                    htmlFor="recipe-servings"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    Number of Servings
                  </label>

                  <input
                    id="recipe-servings"
                    type="number"
                    min="1"
                    max="1000"
                    step="0.5"
                    value={servings}
                    onChange={(event) =>
                      setServings(
                        event.target.value
                      )
                    }
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white ${
                      errors.servings
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  />

                  {errors.servings && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.servings}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ------------------------------------------------ */}
            {/* Ingredients */}
            {/* ------------------------------------------------ */}

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
                duration: 0.6,
                delay: 0.1,
              }}
              className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
            >
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
                    Ingredients
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-gray-900">
                    Add Ingredients
                  </h2>
                </div>

                <span className="flex w-fit items-center gap-2 rounded-full bg-[#f3f7ef] px-3 py-2 text-xs font-semibold text-gray-600">
                  <Utensils size={14} />

                  {ingredients.length}{" "}
                  {ingredients.length === 1
                    ? "ingredient"
                    : "ingredients"}
                </span>
              </div>

              {/* General ingredient error */}
              {errors.ingredients.general && (
                <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  <Info
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {errors.ingredients.general}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {ingredients.map(
                    (ingredient, index) => (
                      <IngredientRow
                        key={ingredient.id}
                        ingredient={ingredient}
                        index={index}
                        error={
                          errors.ingredients[index]
                        }
                        onChange={
                          updateIngredient
                        }
                        onRemove={
                          removeIngredient
                        }
                      />
                    )
                  )}
                </AnimatePresence>
              </div>

              {/* Add ingredient */}
              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={addIngredient}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#b9d99e] bg-[#f8fbf5] px-5 py-4 text-sm font-semibold text-[#4b8d1d] transition-colors hover:border-[#4dbb08] hover:bg-[#f3f9ed]"
              >
                <Plus size={18} />
                Add Another Ingredient
              </motion.button>
            </motion.div>

            {/* ------------------------------------------------ */}
            {/* Help information */}
            {/* ------------------------------------------------ */}

            <div className="rounded-2xl border border-green-100 bg-[#f3f7ef] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#4dbb08]">
                  <Info size={17} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    How to use the calculator
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-gray-600">
                    Select an ingredient, enter its
                    quantity, and choose the appropriate
                    unit. You can add as many ingredients
                    as your recipe needs. Change the number
                    of servings at any time to instantly see
                    the updated nutrition per serving.
                  </p>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* Actions */}
            {/* ------------------------------------------------ */}

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={saveRecipe}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#17251a] px-6 py-4 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#4dbb08]"
              >
                <Save size={17} />

                {editingRecipeId
                  ? "Update Recipe"
                  : "Save Recipe"}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={resetCalculator}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-4 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                Start New
              </motion.button>
            </div>

            {/* ------------------------------------------------ */}
            {/* Save success message */}
            {/* ------------------------------------------------ */}

            <AnimatePresence>
              {savedMessage && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                  }}
                  className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700"
                >
                  <CheckCircle2 size={18} />
                  {savedMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================================================== */}
          {/* RIGHT COLUMN - NUTRITION */}
          {/* ================================================== */}

          <div className="lg:sticky lg:top-28 lg:self-start">
            <NutritionSummary
              nutrition={nutrition.perServing}
              servings={servings}
            />
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SAVED RECIPES */}
      {/* ================================================== */}

      <section className="px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
            <button
              type="button"
              onClick={toggleSavedRecipes}
              className="flex w-full items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f7ef] text-[#4dbb08]">
                  <BookOpen size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Saved Recipes
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {savedRecipes.length === 0
                      ? "Your saved recipes will appear here."
                      : `${savedRecipes.length} saved ${
                          savedRecipes.length === 1
                            ? "recipe"
                            : "recipes"
                        }`}
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold text-[#4dbb08]">
                {showSavedRecipes
                  ? "Hide"
                  : "View"}
              </span>
            </button>

            <AnimatePresence>
              {showSavedRecipes && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    {savedRecipes.length ===
                    0 ? (
                      <div className="rounded-xl bg-gray-50 p-8 text-center">
                        <BookOpen
                          size={28}
                          className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-500">
                          No saved recipes yet.
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Create a recipe and press
                          Save Recipe.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-2">
                        {savedRecipes.map(
                          (recipe) => (
                            <SavedRecipeCard
                              key={recipe.id}
                              recipe={recipe}
                              onLoad={loadRecipe}
                              onDelete={
                                deleteRecipe
                              }
                            />
                          )
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* DISCLAIMER */}
      {/* ================================================== */}

      <div className="mx-auto mt-8 max-w-[1200px] px-5 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] leading-5 text-gray-400">
          Nutrition values are estimates based on the
          ingredient data available in CaloVision. Actual
          nutritional values can vary by brand, preparation
          method, and ingredient. This calculator is for
          informational purposes only.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// SAVED RECIPE CARD
// ============================================================

function SavedRecipeCard({
  recipe,
  onLoad,
  onDelete,
}) {
  return (
    <motion.div
      layout
      whileHover={{
        y: -2,
      }}
      className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-gray-900">
            {recipe.name}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {recipe.ingredients?.length || 0}{" "}
            ingredients · {recipe.servings || 1}{" "}
            servings
          </p>

          <p className="mt-2 text-xs font-semibold text-[#4dbb08]">
            {Math.round(
              recipe.nutrition?.perServing
                ?.calories || 0
            )}{" "}
            kcal / serving
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onLoad(recipe)}
            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-[#4dbb08] hover:text-white"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(recipe.id)
            }
            aria-label={`Delete ${recipe.name}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm transition-colors hover:bg-red-500 hover:text-white"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}