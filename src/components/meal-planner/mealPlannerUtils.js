// ============================================================
// CaloVision - Meal Planner Utilities
// ============================================================

// ------------------------------------------------------------
// Meal types
// ------------------------------------------------------------

export const MEAL_TYPES = [
    {
      id: "breakfast",
      label: "Breakfast",
      description: "Start your day with a balanced meal.",
    },
    {
      id: "lunch",
      label: "Lunch",
      description: "A nutritious meal to keep you going.",
    },
    {
      id: "dinner",
      label: "Dinner",
      description: "Finish your day with a satisfying meal.",
    },
    {
      id: "snacks",
      label: "Snacks",
      description: "Small meals and snacks throughout the day.",
    },
  ];
  
  // ------------------------------------------------------------
  // Food database
  //
  // Nutrition values are based on the food's reference unit.
  // Most foods use values per 100g.
  // Eggs, bread, etc. use "serving" because they are easier
  // to measure as individual portions.
  // ------------------------------------------------------------
  
  export const FOOD_DATABASE = [
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
      id: "salmon",
      name: "Salmon",
      category: "Protein",
      unit: "g",
      calories: 208,
      protein: 20.4,
      carbs: 0,
      fat: 13.4,
      fiber: 0,
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
      id: "whole-milk",
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
      id: "whole-wheat-bread",
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
  // Units
  // ------------------------------------------------------------
  
  export const UNIT_OPTIONS = [
    {
      value: "g",
      label: "g",
    },
    {
      value: "kg",
      label: "kg",
    },
    {
      value: "ml",
      label: "ml",
    },
    {
      value: "serving",
      label: "serving",
    },
  ];
  
  // ------------------------------------------------------------
  // Default nutrition object
  // ------------------------------------------------------------
  
  export function createEmptyNutrition() {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
    };
  }
  
  // ------------------------------------------------------------
  // Find food by ID
  // ------------------------------------------------------------
  
  export function getFoodById(foodId) {
    return FOOD_DATABASE.find(
      (food) => food.id === foodId
    );
  }
  
  // ------------------------------------------------------------
  // Create a new food item
  // ------------------------------------------------------------
  
  export function createFoodItem(
    foodId = "",
    quantity = "",
    unit = "g"
  ) {
    return {
      id: createItemId(),
      foodId,
      quantity,
      unit,
    };
  }
  
  // ------------------------------------------------------------
  // Generate a unique item ID
  //
  // crypto.randomUUID() is preferred when available.
  // The fallback keeps the feature compatible with browsers
  // that do not support it.
  // ------------------------------------------------------------
  
  export function createItemId() {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
    ) {
      return crypto.randomUUID();
    }
  
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 9)}`;
  }
  
  // ------------------------------------------------------------
  // Determine which units are valid for a food
  // ------------------------------------------------------------
  
  export function getAvailableUnits(food) {
    if (!food) {
      return UNIT_OPTIONS;
    }
  
    if (food.unit === "g") {
      return UNIT_OPTIONS.filter(
        (unit) =>
          unit.value === "g" ||
          unit.value === "kg"
      );
    }
  
    if (food.unit === "ml") {
      return UNIT_OPTIONS.filter(
        (unit) => unit.value === "ml"
      );
    }
  
    if (food.unit === "serving") {
      return UNIT_OPTIONS.filter(
        (unit) => unit.value === "serving"
      );
    }
  
    return UNIT_OPTIONS;
  }
  
  // ------------------------------------------------------------
  // Convert the user's quantity into the food's base unit
  // ------------------------------------------------------------
  
  export function normalizeQuantity(
    quantity,
    selectedUnit,
    foodUnit
  ) {
    const numericQuantity = Number(quantity);
  
    if (
      !Number.isFinite(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return 0;
    }
  
    // Foods measured per 100g
    if (foodUnit === "g") {
      if (selectedUnit === "g") {
        return numericQuantity;
      }
  
      if (selectedUnit === "kg") {
        return numericQuantity * 1000;
      }
  
      return 0;
    }
  
    // Foods measured per 100ml
    if (foodUnit === "ml") {
      if (selectedUnit === "ml") {
        return numericQuantity;
      }
  
      return 0;
    }
  
    // Foods measured per serving
    if (foodUnit === "serving") {
      if (selectedUnit === "serving") {
        return numericQuantity;
      }
  
      return 0;
    }
  
    return 0;
  }
  
  // ------------------------------------------------------------
  // Calculate nutrition for one food item
  // ------------------------------------------------------------
  
  export function calculateFoodNutrition(
    food,
    quantity,
    unit
  ) {
    const emptyNutrition =
      createEmptyNutrition();
  
    if (!food) {
      return emptyNutrition;
    }
  
    const normalizedQuantity =
      normalizeQuantity(
        quantity,
        unit,
        food.unit
      );
  
    if (normalizedQuantity <= 0) {
      return emptyNutrition;
    }
  
    let multiplier = 0;
  
    // Database values are per 100g / 100ml
    if (
      food.unit === "g" ||
      food.unit === "ml"
    ) {
      multiplier =
        normalizedQuantity / 100;
    }
  
    // Database values are already per serving
    if (food.unit === "serving") {
      multiplier = normalizedQuantity;
    }
  
    return {
      calories:
        food.calories * multiplier,
  
      protein:
        food.protein * multiplier,
  
      carbs:
        food.carbs * multiplier,
  
      fat:
        food.fat * multiplier,
  
      fiber:
        food.fiber * multiplier,
    };
  }
  
  // ------------------------------------------------------------
  // Add two nutrition objects together
  // ------------------------------------------------------------
  
  export function addNutrition(
    first,
    second
  ) {
    return {
      calories:
        (first?.calories || 0) +
        (second?.calories || 0),
  
      protein:
        (first?.protein || 0) +
        (second?.protein || 0),
  
      carbs:
        (first?.carbs || 0) +
        (second?.carbs || 0),
  
      fat:
        (first?.fat || 0) +
        (second?.fat || 0),
  
      fiber:
        (first?.fiber || 0) +
        (second?.fiber || 0),
    };
  }
  
  // ------------------------------------------------------------
  // Calculate nutrition for an entire meal
  // ------------------------------------------------------------
  
  export function calculateMealNutrition(
    items = []
  ) {
    return items.reduce(
      (total, item) => {
        const food =
          getFoodById(item.foodId);
  
        const nutrition =
          calculateFoodNutrition(
            food,
            item.quantity,
            item.unit
          );
  
        return addNutrition(
          total,
          nutrition
        );
      },
      createEmptyNutrition()
    );
  }
  
  // ------------------------------------------------------------
  // Calculate nutrition for the complete day
  // ------------------------------------------------------------
  
  export function calculateDailyNutrition(
    meals
  ) {
    const dailyNutrition =
      createEmptyNutrition();
  
    if (!meals) {
      return dailyNutrition;
    }
  
    MEAL_TYPES.forEach((meal) => {
      const mealItems =
        Array.isArray(meals[meal.id])
          ? meals[meal.id]
          : [];
  
      const mealNutrition =
        calculateMealNutrition(
          mealItems
        );
  
      Object.keys(dailyNutrition).forEach(
        (key) => {
          dailyNutrition[key] +=
            mealNutrition[key];
        }
      );
    });
  
    return dailyNutrition;
  }
  
  // ------------------------------------------------------------
  // Calculate calories remaining
  // ------------------------------------------------------------
  
  export function calculateRemainingCalories(
    targetCalories,
    consumedCalories
  ) {
    const target = Number(targetCalories) || 0;
    const consumed =
      Number(consumedCalories) || 0;
  
    return target - consumed;
  }
  
  // ------------------------------------------------------------
  // Calculate progress percentage
  // ------------------------------------------------------------
  
  export function calculateProgress(
    current,
    target
  ) {
    const currentValue =
      Number(current) || 0;
  
    const targetValue =
      Number(target) || 0;
  
    if (targetValue <= 0) {
      return 0;
    }
  
    return Math.min(
      Math.max(
        (currentValue / targetValue) * 100,
        0
      ),
      100
    );
  }
  
  // ------------------------------------------------------------
  // Create the initial meal planner state
  // ------------------------------------------------------------
  
  export function createInitialPlanner() {
    return {
      calorieTarget: 2000,
  
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: [],
      },
    };
  }
  
  // ------------------------------------------------------------
  // Validate a food item
  // ------------------------------------------------------------
  
  export function validateFoodItem(item) {
    const errors = {};
  
    if (!item?.foodId) {
      errors.foodId =
        "Please select a food.";
    }
  
    if (
      item?.quantity === "" ||
      item?.quantity === null ||
      item?.quantity === undefined
    ) {
      errors.quantity =
        "Enter a quantity.";
    } else {
      const quantity =
        Number(item.quantity);
  
      if (!Number.isFinite(quantity)) {
        errors.quantity =
          "Enter a valid number.";
      } else if (quantity <= 0) {
        errors.quantity =
          "Quantity must be greater than zero.";
      } else if (quantity > 10000) {
        errors.quantity =
          "Quantity is too large.";
      }
    }
  
    if (!item?.unit) {
      errors.unit =
        "Please select a unit.";
    }
  
    const food =
      getFoodById(item?.foodId);
  
    if (
      food &&
      item?.unit &&
      !getAvailableUnits(food).some(
        (unit) =>
          unit.value === item.unit
      )
    ) {
      errors.unit =
        "This unit is not valid for the selected food.";
    }
  
    return errors;
  }
  
  // ------------------------------------------------------------
  // Validate the daily planner
  // ------------------------------------------------------------
  
  export function validatePlanner(
    planner
  ) {
    const errors = {
      calorieTarget: "",
      meals: {},
    };
  
    const calorieTarget =
      Number(planner?.calorieTarget);
  
    if (
      planner?.calorieTarget === "" ||
      planner?.calorieTarget === null ||
      planner?.calorieTarget === undefined
    ) {
      errors.calorieTarget =
        "Enter a calorie target.";
    } else if (
      !Number.isFinite(calorieTarget)
    ) {
      errors.calorieTarget =
        "Enter a valid calorie target.";
    } else if (calorieTarget <= 0) {
      errors.calorieTarget =
        "Calorie target must be greater than zero.";
    } else if (calorieTarget > 10000) {
      errors.calorieTarget =
        "Calorie target cannot exceed 10,000 kcal.";
    }
  
    MEAL_TYPES.forEach((meal) => {
      const items =
        planner?.meals?.[meal.id] || [];
  
      errors.meals[meal.id] = {};
  
      items.forEach((item) => {
        const itemErrors =
          validateFoodItem(item);
  
        if (
          Object.keys(itemErrors).length > 0
        ) {
          errors.meals[meal.id][item.id] =
            itemErrors;
        }
      });
    });
  
    return errors;
  }
  
  // ------------------------------------------------------------
  // Check if validation contains errors
  // ------------------------------------------------------------
  
  export function hasPlannerErrors(
    errors
  ) {
    if (!errors) {
      return false;
    }
  
    if (errors.calorieTarget) {
      return true;
    }
  
    return Object.values(
      errors.meals || {}
    ).some((mealErrors) =>
      Object.values(mealErrors).some(
        (itemErrors) =>
          Object.keys(itemErrors).length > 0
      )
    );
  }
  
  // ------------------------------------------------------------
  // Format nutrition values
  // ------------------------------------------------------------
  
  export function formatNutrition(
    value,
    decimals = 1
  ) {
    const number = Number(value);
  
    if (!Number.isFinite(number)) {
      return "0";
    }
  
    if (number === 0) {
      return "0";
    }
  
    return number.toFixed(decimals);
  }
  
  // ------------------------------------------------------------
  // Format calories as a whole number
  // ------------------------------------------------------------
  
  export function formatCalories(value) {
    const number = Number(value);
  
    if (!Number.isFinite(number)) {
      return "0";
    }
  
    return Math.round(number).toLocaleString();
  }
  
  // ------------------------------------------------------------
  // Safely read planner data from localStorage
  // ------------------------------------------------------------
  
  export function loadPlannerFromStorage(
    storageKey
  ) {
    if (typeof window === "undefined") {
      return createInitialPlanner();
    }
  
    try {
      const saved =
        window.localStorage.getItem(
          storageKey
        );
  
      if (!saved) {
        return createInitialPlanner();
      }
  
      const parsed =
        JSON.parse(saved);
  
      if (
        !parsed ||
        typeof parsed !== "object"
      ) {
        return createInitialPlanner();
      }
  
      return sanitizePlanner(parsed);
    } catch (error) {
      console.error(
        "Unable to load meal planner:",
        error
      );
  
      return createInitialPlanner();
    }
  }
  
  // ------------------------------------------------------------
  // Safely save planner data to localStorage
  // ------------------------------------------------------------
  
  export function savePlannerToStorage(
    storageKey,
    planner
  ) {
    if (typeof window === "undefined") {
      return false;
    }
  
    try {
      const safePlanner =
        sanitizePlanner(planner);
  
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(safePlanner)
      );
  
      return true;
    } catch (error) {
      console.error(
        "Unable to save meal planner:",
        error
      );
  
      return false;
    }
  }
  
  // ------------------------------------------------------------
  // Make sure localStorage data has the correct structure
  // ------------------------------------------------------------
  
  export function sanitizePlanner(
    planner
  ) {
    const initial =
      createInitialPlanner();
  
    const calorieTarget =
      Number(planner?.calorieTarget);
  
    const safeCalorieTarget =
      Number.isFinite(calorieTarget) &&
      calorieTarget > 0 &&
      calorieTarget <= 10000
        ? calorieTarget
        : initial.calorieTarget;
  
    const safeMeals = {};
  
    MEAL_TYPES.forEach((meal) => {
      const items =
        planner?.meals?.[meal.id];
  
      if (!Array.isArray(items)) {
        safeMeals[meal.id] = [];
        return;
      }
  
      safeMeals[meal.id] =
        items
          .filter(
            (item) =>
              item &&
              typeof item === "object"
          )
          .map((item) => ({
            id:
              item.id ||
              createItemId(),
  
            foodId:
              typeof item.foodId === "string"
                ? item.foodId
                : "",
  
            quantity:
              item.quantity ?? "",
  
            unit:
              typeof item.unit === "string"
                ? item.unit
                : "g",
          }));
    });
  
    return {
      calorieTarget:
        safeCalorieTarget,
  
      meals: safeMeals,
    };
  }
  
  // ------------------------------------------------------------
  // Move an item from one meal to another
  // ------------------------------------------------------------
  
  export function moveFoodItem(
    meals,
    fromMeal,
    toMeal,
    itemId
  ) {
    if (
      !meals?.[fromMeal] ||
      !meals?.[toMeal]
    ) {
      return meals;
    }
  
    const itemIndex =
      meals[fromMeal].findIndex(
        (item) => item.id === itemId
      );
  
    if (itemIndex === -1) {
      return meals;
    }
  
    const item =
      meals[fromMeal][itemIndex];
  
    const updatedFromMeal =
      meals[fromMeal].filter(
        (currentItem) =>
          currentItem.id !== itemId
      );
  
    const updatedToMeal = [
      ...meals[toMeal],
      item,
    ];
  
    return {
      ...meals,
  
      [fromMeal]:
        updatedFromMeal,
  
      [toMeal]:
        updatedToMeal,
    };
  }
  
  // ------------------------------------------------------------
  // Reorder an item inside the same meal
  // ------------------------------------------------------------
  
  export function reorderFoodItem(
    meals,
    mealId,
    fromIndex,
    toIndex
  ) {
    const mealItems =
      meals?.[mealId];
  
    if (!Array.isArray(mealItems)) {
      return meals;
    }
  
    if (
      fromIndex < 0 ||
      fromIndex >= mealItems.length ||
      toIndex < 0 ||
      toIndex >= mealItems.length
    ) {
      return meals;
    }
  
    const updatedItems = [
      ...mealItems,
    ];
  
    const [movedItem] =
      updatedItems.splice(
        fromIndex,
        1
      );
  
    updatedItems.splice(
      toIndex,
      0,
      movedItem
    );
  
    return {
      ...meals,
      [mealId]:
        updatedItems,
    };
  }