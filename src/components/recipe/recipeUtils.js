// ------------------------------------------------------------
// Recipe Nutrition Calculator utilities
// ------------------------------------------------------------

// Nutrition values are based on:
// - g  -> nutrition per 100g
// - ml -> nutrition per 100ml
// - serving -> nutrition per 1 serving
//
// This keeps calculations simple and makes it easy to add
// more ingredients later.
//
// Values are approximate nutritional reference values.
// They are intended for a calculator, not medical advice.
// ------------------------------------------------------------

export const INGREDIENT_DATABASE = [
    {
      id: "chicken-breast",
      name: "Chicken Breast",
      category: "Protein",
      unit: "g",
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
    },
    {
      id: "brown-rice",
      name: "Brown Rice",
      category: "Grains",
      unit: "g",
      calories: 123,
      protein: 2.7,
      carbs: 25.6,
      fat: 1,
      fiber: 1.6,
    },
    {
      id: "white-rice",
      name: "White Rice",
      category: "Grains",
      unit: "g",
      calories: 130,
      protein: 2.7,
      carbs: 28.2,
      fat: 0.3,
      fiber: 0.4,
    },
    {
      id: "oats",
      name: "Oats",
      category: "Grains",
      unit: "g",
      calories: 389,
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      fiber: 10.6,
    },
    {
      id: "egg",
      name: "Egg",
      category: "Protein",
      unit: "serving",
      calories: 72,
      protein: 6.3,
      carbs: 0.4,
      fat: 4.8,
      fiber: 0,
    },
    {
      id: "milk",
      name: "Whole Milk",
      category: "Dairy",
      unit: "ml",
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3,
      fiber: 0,
    },
    {
      id: "greek-yogurt",
      name: "Greek Yogurt",
      category: "Dairy",
      unit: "g",
      calories: 59,
      protein: 10.3,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
    },
    {
      id: "banana",
      name: "Banana",
      category: "Fruit",
      unit: "g",
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fat: 0.3,
      fiber: 2.6,
    },
    {
      id: "apple",
      name: "Apple",
      category: "Fruit",
      unit: "g",
      calories: 52,
      protein: 0.3,
      carbs: 13.8,
      fat: 0.2,
      fiber: 2.4,
    },
    {
      id: "avocado",
      name: "Avocado",
      category: "Fruit",
      unit: "g",
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fat: 14.7,
      fiber: 6.7,
    },
    {
      id: "broccoli",
      name: "Broccoli",
      category: "Vegetables",
      unit: "g",
      calories: 34,
      protein: 2.8,
      carbs: 6.6,
      fat: 0.4,
      fiber: 2.6,
    },
    {
      id: "spinach",
      name: "Spinach",
      category: "Vegetables",
      unit: "g",
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
    },
    {
      id: "potato",
      name: "Potato",
      category: "Vegetables",
      unit: "g",
      calories: 77,
      protein: 2,
      carbs: 17.5,
      fat: 0.1,
      fiber: 2.2,
    },
    {
      id: "sweet-potato",
      name: "Sweet Potato",
      category: "Vegetables",
      unit: "g",
      calories: 86,
      protein: 1.6,
      carbs: 20.1,
      fat: 0.1,
      fiber: 3,
    },
    {
      id: "olive-oil",
      name: "Olive Oil",
      category: "Fats & Oils",
      unit: "ml",
      calories: 8.1,
      protein: 0,
      carbs: 0,
      fat: 0.9,
      fiber: 0,
    },
    {
      id: "peanut-butter",
      name: "Peanut Butter",
      category: "Fats & Nuts",
      unit: "g",
      calories: 588,
      protein: 25,
      carbs: 20,
      fat: 50,
      fiber: 6,
    },
    {
      id: "almonds",
      name: "Almonds",
      category: "Fats & Nuts",
      unit: "g",
      calories: 579,
      protein: 21.2,
      carbs: 21.6,
      fat: 49.9,
      fiber: 12.5,
    },
    {
      id: "bread",
      name: "Whole Wheat Bread",
      category: "Grains",
      unit: "serving",
      calories: 69,
      protein: 3.6,
      carbs: 11.6,
      fat: 1.1,
      fiber: 1.9,
    },
    {
      id: "cheddar-cheese",
      name: "Cheddar Cheese",
      category: "Dairy",
      unit: "g",
      calories: 403,
      protein: 24.9,
      carbs: 1.3,
      fat: 33.1,
      fiber: 0,
    },
    {
      id: "honey",
      name: "Honey",
      category: "Sweeteners",
      unit: "g",
      calories: 304,
      protein: 0.3,
      carbs: 82.4,
      fat: 0,
      fiber: 0.2,
    },
  ];
  
  // ------------------------------------------------------------
  // Units supported by the calculator
  // ------------------------------------------------------------
  
  export const UNIT_OPTIONS = [
    { value: "g", label: "g" },
    { value: "kg", label: "kg" },
    { value: "ml", label: "ml" },
    { value: "serving", label: "serving" },
  ];
  
  // ------------------------------------------------------------
  // Get an ingredient by its ID
  // ------------------------------------------------------------
  
  export function getIngredientById(id) {
    return INGREDIENT_DATABASE.find((ingredient) => ingredient.id === id);
  }
  
  // ------------------------------------------------------------
  // Convert a quantity into the base quantity expected by
  // the ingredient's nutrition data.
  //
  // Example:
  // 0.5 kg = 500g
  // 2 kg = 2000g
  // ------------------------------------------------------------
  
  export function normalizeQuantity(quantity, unit, ingredientUnit) {
    const numericQuantity = Number(quantity);
  
    if (!Number.isFinite(numericQuantity) || numericQuantity <= 0) {
      return 0;
    }
  
    // Weight-based ingredient
    if (ingredientUnit === "g") {
      if (unit === "kg") {
        return numericQuantity * 1000;
      }
  
      if (unit === "g") {
        return numericQuantity;
      }
  
      return 0;
    }
  
    // Liquid-based ingredient
    if (ingredientUnit === "ml") {
      if (unit === "ml") {
        return numericQuantity;
      }
  
      return 0;
    }
  
    // Serving-based ingredient
    if (ingredientUnit === "serving") {
      if (unit === "serving") {
        return numericQuantity;
      }
  
      return 0;
    }
  
    return 0;
  }
  
  // ------------------------------------------------------------
  // Calculate nutrition for one ingredient
  // ------------------------------------------------------------
  
  export function calculateIngredientNutrition(ingredient, quantity, unit) {
    if (!ingredient) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      };
    }
  
    const normalizedQuantity = normalizeQuantity(
      quantity,
      unit,
      ingredient.unit
    );
  
    if (normalizedQuantity <= 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
      };
    }
  
    let multiplier;
  
    if (ingredient.unit === "g" || ingredient.unit === "ml") {
      multiplier = normalizedQuantity / 100;
    } else {
      multiplier = normalizedQuantity;
    }
  
    return {
      calories: ingredient.calories * multiplier,
      protein: ingredient.protein * multiplier,
      carbs: ingredient.carbs * multiplier,
      fat: ingredient.fat * multiplier,
      fiber: ingredient.fiber * multiplier,
    };
  }
  
  // ------------------------------------------------------------
  // Calculate the complete recipe
  // ------------------------------------------------------------
  
  export function calculateRecipeNutrition(ingredients, servings) {
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  
    ingredients.forEach((item) => {
      const ingredient = getIngredientById(item.ingredientId);
  
      if (!ingredient) return;
  
      const nutrition = calculateIngredientNutrition(
        ingredient,
        item.quantity,
        item.unit
      );
  
      totals.calories += nutrition.calories;
      totals.protein += nutrition.protein;
      totals.carbs += nutrition.carbs;
      totals.fat += nutrition.fat;
      totals.fiber += nutrition.fiber;
    });
  
    const safeServings =
      Number(servings) > 0 && Number.isFinite(Number(servings))
        ? Number(servings)
        : 1;
  
    return {
      total: totals,
  
      perServing: {
        calories: totals.calories / safeServings,
        protein: totals.protein / safeServings,
        carbs: totals.carbs / safeServings,
        fat: totals.fat / safeServings,
        fiber: totals.fiber / safeServings,
      },
    };
  }
  
  // ------------------------------------------------------------
  // Validate one ingredient row
  // ------------------------------------------------------------
  
  export function validateIngredient(item) {
    const errors = {};
  
    if (!item.ingredientId) {
      errors.ingredientId = "Please select an ingredient.";
    }
  
    const quantity = Number(item.quantity);
  
    if (item.quantity === "" || item.quantity === null) {
      errors.quantity = "Enter a quantity.";
    } else if (!Number.isFinite(quantity)) {
      errors.quantity = "Enter a valid number.";
    } else if (quantity <= 0) {
      errors.quantity = "Quantity must be greater than zero.";
    }
  
    if (!item.unit) {
      errors.unit = "Select a unit.";
    }
  
    return errors;
  }
  
  // ------------------------------------------------------------
  // Validate the complete recipe
  // ------------------------------------------------------------
  
  export function validateRecipe(ingredients, servings) {
    const errors = {
      ingredients: {},
      servings: "",
    };
  
    if (!ingredients.length) {
      errors.ingredients.general = "Add at least one ingredient.";
    }
  
    ingredients.forEach((item, index) => {
      const ingredientErrors = validateIngredient(item);
  
      if (Object.keys(ingredientErrors).length > 0) {
        errors.ingredients[index] = ingredientErrors;
      }
    });
  
    const numericServings = Number(servings);
  
    if (servings === "" || servings === null) {
      errors.servings = "Enter the number of servings.";
    } else if (!Number.isFinite(numericServings)) {
      errors.servings = "Enter a valid number.";
    } else if (numericServings <= 0) {
      errors.servings = "Servings must be greater than zero.";
    } else if (numericServings > 1000) {
      errors.servings = "Servings cannot exceed 1000.";
    }
  
    return errors;
  }
  
  // ------------------------------------------------------------
  // Check if a validation object actually contains errors
  // ------------------------------------------------------------
  
  export function hasRecipeErrors(errors) {
    if (errors.servings) {
      return true;
    }
  
    if (errors.ingredients.general) {
      return true;
    }
  
    return Object.values(errors.ingredients).some(
      (ingredientError) =>
        typeof ingredientError === "object" &&
        Object.keys(ingredientError).length > 0
    );
  }
  
  // ------------------------------------------------------------
  // Format nutrition numbers for display
  // ------------------------------------------------------------
  
  export function formatNutrition(value) {
    if (!Number.isFinite(Number(value))) {
      return "0";
    }
  
    const number = Number(value);
  
    if (number >= 1000) {
      return number.toFixed(0);
    }
  
    if (number >= 100) {
      return number.toFixed(1);
    }
  
    return number.toFixed(1);
  }