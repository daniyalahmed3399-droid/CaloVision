import { LIMITS, LB_PER_KG } from "../components/onboarding/options";
import { isDateString, isFuture } from "./dates";

// Pure validation and display helpers for the tracking screens (food,
// exercise, steps, weight). No maths on nutrition here: calorie and macro
// values always come from the backend.

export const MEAL_ORDER = ["breakfast", "lunch", "dinner", "snacks"];

export const MEAL_LABELS = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

export const MEAL_OPTIONS = MEAL_ORDER.map((id) => ({
  value: id,
  label: MEAL_LABELS[id],
}));

export const TRACKING_LIMITS = {
  foodQuantity: { max: 10000 },
  exerciseMinutes: { min: 1, max: 1440 },
  steps: { min: 0, max: 100000 },
  weightKg: LIMITS.weightKg,
  weightLb: { min: 66, max: 661 },
};

const isNumber = (value) =>
  value !== "" &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));

function validateDate(date) {
  if (!isDateString(date)) return "Choose a valid date.";
  if (isFuture(date)) return "You can't log entries for a future date.";
  return "";
}

// ---- food ----

export function validateFoodEntry({ foodId, quantity, unit, mealType, date }) {
  const errors = {};

  if (!foodId) errors.foodId = "Choose a food.";

  if (!isNumber(quantity)) {
    errors.quantity = "Enter a quantity.";
  } else if (Number(quantity) <= 0) {
    errors.quantity = "Quantity must be greater than zero.";
  } else if (Number(quantity) > TRACKING_LIMITS.foodQuantity.max) {
    errors.quantity = "That quantity is too large.";
  }

  if (!unit) errors.unit = "Choose a unit.";
  if (!MEAL_ORDER.includes(mealType)) errors.mealType = "Choose a meal.";

  const dateError = validateDate(date);
  if (dateError) errors.date = dateError;

  return errors;
}

// ---- exercise ----

export function validateExerciseEntry({ exerciseId, minutes, date }) {
  const errors = {};
  const { min, max } = TRACKING_LIMITS.exerciseMinutes;

  if (!exerciseId) errors.exerciseId = "Choose an exercise.";

  if (!isNumber(minutes)) {
    errors.minutes = "Enter how many minutes.";
  } else if (Number(minutes) < min || Number(minutes) > max) {
    errors.minutes = `Enter between ${min} and ${max} minutes.`;
  }

  const dateError = validateDate(date);
  if (dateError) errors.date = dateError;

  return errors;
}

// ---- steps ----

export function validateSteps({ steps, date }) {
  const errors = {};
  const { min, max } = TRACKING_LIMITS.steps;

  if (!isNumber(steps)) {
    errors.steps = "Enter your step count.";
  } else if (!Number.isInteger(Number(steps))) {
    errors.steps = "Steps must be a whole number.";
  } else if (Number(steps) < min || Number(steps) > max) {
    errors.steps = `Enter between ${min.toLocaleString("en-US")} and ${max.toLocaleString("en-US")} steps.`;
  }

  const dateError = validateDate(date);
  if (dateError) errors.date = dateError;

  return errors;
}

// ---- weight ----

export function validateWeight({ weight, unit, date }) {
  const errors = {};
  const range =
    unit === "lb" ? TRACKING_LIMITS.weightLb : TRACKING_LIMITS.weightKg;

  if (!isNumber(weight)) {
    errors.weight = "Enter your weight.";
  } else if (Number(weight) < range.min || Number(weight) > range.max) {
    errors.weight = `Enter a weight between ${range.min} and ${range.max} ${unit === "lb" ? "lb" : "kg"}.`;
  }

  const dateError = validateDate(date);
  if (dateError) errors.date = dateError;

  return errors;
}

// Weight is stored in kg; this only converts what the user typed. Two
// decimals keep the round trip exact: a one-decimal value typed in pounds
// displays back as the same number (one decimal of kg would lose up to
// 0.1 lb).
export function weightInputToKg(weight, unit) {
  const value = Number(weight);

  return unit === "lb"
    ? Math.round((value / LB_PER_KG) * 100) / 100
    : Math.round(value * 100) / 100;
}

export function formatWeight(kg, unit) {
  if (!Number.isFinite(kg)) return "";

  return unit === "lb"
    ? `${Math.round(kg * LB_PER_KG * 10) / 10} lb`
    : `${Math.round(kg * 10) / 10} kg`;
}

export const hasErrors = (errors) => Object.keys(errors).length > 0;

// ---- display ----

const MEAL_BY_HOUR = [
  [11, "breakfast"],
  [16, "lunch"],
  [21, "dinner"],
];

// Sensible default meal for "add food" based on the time of day.
export function defaultMealForNow(date = new Date()) {
  const hour = date.getHours();
  const match = MEAL_BY_HOUR.find(([limit]) => hour < limit);

  return match ? match[1] : "snacks";
}

export function formatNumber(value, digits = 0) {
  if (!Number.isFinite(value)) return "0";

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

// Weight preference follows the unit chosen at onboarding.
export function weightUnitFor(user) {
  return user?.profile?.units === "imperial" ? "lb" : "kg";
}
