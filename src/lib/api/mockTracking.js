// MOCK BACKEND for tracking (food, exercise, steps, weight) — development
// stand-in only, like ./mock.js. Data lives in localStorage per mock user.
//
// It deliberately plays the BACKEND's part: it validates input, computes
// nutrition and calories burned, and returns daily totals. The UI only
// displays what comes back. Replaced wholesale by real endpoints.

import { ApiError } from "./errors";
import { getMockUser } from "./mock";
import { addDays, isDateString } from "../dates";
import {
  MEAL_ORDER,
  validateExerciseEntry,
  validateFoodEntry,
  validateSteps,
  validateWeight,
} from "../tracking";
import {
  FOOD_DATABASE,
  calculateFoodNutrition,
  getAvailableUnits,
  getFoodById,
} from "../../components/meal-planner/mealPlannerUtils";

const KEY = "cv_mock_tracking";
const STEP_GOAL = 10000;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
const round1 = (n) => Math.round(n * 10) / 10;

// ---- storage ----

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function load(userId) {
  const data = readAll()[userId] || {};

  return {
    food: data.food || [],
    exercise: data.exercise || [],
    steps: data.steps || {},
    weights: data.weights || [],
  };
}

function save(userId, data) {
  const all = readAll();
  all[userId] = data;
  localStorage.setItem(KEY, JSON.stringify(all));
}

const newId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// ---- exercise catalogue (MET values drive calories burned) ----

const EXERCISES = [
  { id: "walking", name: "Walking (brisk)", category: "Cardio", met: 4.3 },
  { id: "running", name: "Running", category: "Cardio", met: 9.8 },
  { id: "cycling", name: "Cycling", category: "Cardio", met: 7.5 },
  { id: "swimming", name: "Swimming", category: "Cardio", met: 8 },
  { id: "jump-rope", name: "Jump rope", category: "Cardio", met: 11.8 },
  { id: "stair-climbing", name: "Stair climbing", category: "Cardio", met: 8.8 },
  { id: "rowing", name: "Rowing machine", category: "Cardio", met: 7 },
  { id: "hiit", name: "HIIT workout", category: "Cardio", met: 8 },
  { id: "weights", name: "Weight training", category: "Strength", met: 3.5 },
  { id: "bodyweight", name: "Bodyweight circuit", category: "Strength", met: 5 },
  { id: "yoga", name: "Yoga", category: "Flexibility", met: 2.5 },
  { id: "stretching", name: "Stretching", category: "Flexibility", met: 2.3 },
  { id: "pilates", name: "Pilates", category: "Flexibility", met: 3 },
  { id: "football", name: "Football", category: "Sports", met: 7 },
  { id: "cricket", name: "Cricket", category: "Sports", met: 4.8 },
  { id: "basketball", name: "Basketball", category: "Sports", met: 6.5 },
  { id: "tennis", name: "Tennis", category: "Sports", met: 7.3 },
  { id: "badminton", name: "Badminton", category: "Sports", met: 5.5 },
  { id: "housework", name: "Housework", category: "Daily", met: 3.3 },
  { id: "gardening", name: "Gardening", category: "Daily", met: 3.8 },
  { id: "dancing", name: "Dancing", category: "Daily", met: 5.5 },
];

const EXERCISE_CATEGORIES = ["Cardio", "Strength", "Flexibility", "Sports", "Daily"];

// ---- helpers ----

function fail(status, message, fieldErrors = {}) {
  throw new ApiError(status, message, fieldErrors);
}

function requireDate(date) {
  if (!isDateString(date)) fail(400, "Choose a valid date.", { date: "Choose a valid date." });
}

function sumNutrition(logs) {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

  logs.forEach(({ nutrition }) => {
    Object.keys(total).forEach((key) => {
      total[key] += nutrition[key] || 0;
    });
  });

  Object.keys(total).forEach((key) => {
    total[key] = round1(total[key]);
  });

  return total;
}

function foodNutrition(foodId, quantity, unit) {
  const food = getFoodById(foodId);

  if (!food) fail(404, "That food could not be found.", { foodId: "Choose a food." });

  if (!getAvailableUnits(food).some((u) => u.value === unit)) {
    fail(400, "That unit isn't valid for this food.", { unit: "Choose a valid unit." });
  }

  const raw = calculateFoodNutrition(food, Number(quantity), unit);

  return {
    food,
    nutrition: Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [key, round1(value)])
    ),
  };
}

function latestWeightKg(data, user, onOrBefore) {
  const entry = [...data.weights]
    .filter((w) => !onOrBefore || w.date <= onOrBefore)
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

  return entry ? entry.kg : user.profile?.weightKg ?? 70;
}

// Deterministic made-up month for the graphs (same user + window -> same
// numbers), used only when there is nothing real to show.
function sampleSeries(dates, user) {
  let seed = 0;
  for (const ch of `${user.id}${dates[0]}`) seed = (seed * 31 + ch.charCodeAt(0)) | 0;

  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const target = user.targets?.calories ?? 2000;
  const startKg = user.profile?.weightKg ?? 78;

  return dates.map((date, i) => ({
    date,
    calories: random() < 0.08 ? null : Math.round(target * (0.78 + random() * 0.3)),
    steps: random() < 0.08 ? null : Math.round(3500 + random() * 9000),
    exerciseCalories: random() < 0.45 ? 0 : Math.round(120 + random() * 340),
    // A weigh-in every few days, drifting down a little.
    weightKg:
      i % 3 === 0
        ? Math.round((startKg - i * 0.06 + (random() - 0.5) * 0.5) * 100) / 100
        : null,
  }));
}

// ---- handlers (same shape as lib/api/client.request) ----

export const mockTracking = {
  // Everything the dashboard and meal history need for one date.
  async day({ token, params }) {
    await delay();
    const user = getMockUser(token);
    requireDate(params?.date);
    const date = params.date;
    const data = load(user.id);

    const dayFood = data.food.filter((log) => log.date === date);
    const meals = {};

    MEAL_ORDER.forEach((meal) => {
      const items = dayFood
        .filter((log) => log.mealType === meal)
        .sort((a, b) => (a.loggedAt < b.loggedAt ? -1 : 1));

      meals[meal] = { items, totals: sumNutrition(items) };
    });

    const exerciseItems = data.exercise
      .filter((log) => log.date === date)
      .sort((a, b) => (a.loggedAt < b.loggedAt ? -1 : 1));

    const latest = [...data.weights]
      .filter((w) => w.date <= date)
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0];

    const t = user.targets;
    const totals = sumNutrition(dayFood);
    const burned = exerciseItems.reduce((sum, log) => sum + log.caloriesBurned, 0);

    return {
      date,
      targets: t
        ? { calories: t.calories, proteinG: t.proteinG, carbsG: t.carbsG, fatG: t.fatG }
        : null,
      totals,
      // target - food eaten + exercise burned; negative means over target.
      remainingCalories: t ? Math.round(t.calories - totals.calories + burned) : null,
      meals,
      exercise: { items: exerciseItems, caloriesBurned: burned },
      // count is null when nothing was logged, so "no data" and "0 steps"
      // can be told apart.
      steps: { count: date in data.steps ? data.steps[date] : null, goal: STEP_GOAL },
      weight: latest ? { kg: latest.kg, date: latest.date } : null,
    };
  },

  async foodSearch({ token, params }) {
    await delay(200);
    getMockUser(token);
    const q = String(params?.q || "").trim().toLowerCase();

    if (!q) return [];

    return FOOD_DATABASE.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q)
    )
      .slice(0, 20)
      .map((food) => ({
        id: food.id,
        name: food.name,
        category: food.category,
        unit: food.unit,
        units: getAvailableUnits(food).map((u) => u.value),
        // What the food's values are measured per.
        reference: {
          amount: food.unit === "serving" ? 1 : 100,
          unit: food.unit,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: food.fiber,
        },
      }));
  },

  // Calculated nutrition for a quantity, so the UI shows backend values.
  async foodPreview({ token, body }) {
    await delay(120);
    getMockUser(token);
    const errors = validateFoodEntry({
      mealType: "breakfast",
      date: "2000-01-01",
      ...body,
    });
    delete errors.date;
    delete errors.mealType;

    if (Object.keys(errors).length) fail(400, "Check the quantity and unit.", errors);

    return foodNutrition(body.foodId, body.quantity, body.unit).nutrition;
  },

  async foodLogCreate({ token, body }) {
    await delay();
    const user = getMockUser(token);
    const errors = validateFoodEntry(body);

    if (Object.keys(errors).length) fail(400, "Please fix the highlighted fields.", errors);

    const { food, nutrition } = foodNutrition(body.foodId, body.quantity, body.unit);
    const data = load(user.id);

    const log = {
      id: newId("food"),
      date: body.date,
      mealType: body.mealType,
      foodId: food.id,
      name: food.name,
      quantity: Number(body.quantity),
      unit: body.unit,
      nutrition,
      loggedAt: new Date().toISOString(),
    };

    data.food.push(log);
    save(user.id, data);

    return log;
  },

  async foodLogUpdate({ token, body }) {
    await delay();
    const user = getMockUser(token);
    const data = load(user.id);
    const log = data.food.find((item) => item.id === body?.id);

    if (!log) fail(404, "That entry no longer exists.");

    const next = {
      foodId: log.foodId,
      unit: log.unit,
      date: log.date,
      mealType: body.mealType ?? log.mealType,
      quantity: body.quantity ?? log.quantity,
    };
    const errors = validateFoodEntry(next);

    if (Object.keys(errors).length) fail(400, "Please fix the highlighted fields.", errors);

    log.mealType = next.mealType;
    log.quantity = Number(next.quantity);
    log.nutrition = foodNutrition(log.foodId, log.quantity, log.unit).nutrition;
    save(user.id, data);

    return log;
  },

  async foodLogDelete({ token, body }) {
    await delay(200);
    const user = getMockUser(token);
    const data = load(user.id);

    if (!data.food.some((item) => item.id === body?.id)) {
      fail(404, "That entry no longer exists.");
    }

    data.food = data.food.filter((item) => item.id !== body.id);
    save(user.id, data);

    return { id: body.id };
  },

  async exerciseCategories({ token }) {
    await delay(100);
    getMockUser(token);
    return EXERCISE_CATEGORIES;
  },

  async exerciseSearch({ token, params }) {
    await delay(150);
    getMockUser(token);
    const q = String(params?.q || "").trim().toLowerCase();
    const category = params?.category || "";

    return EXERCISES.filter(
      (item) =>
        (!category || item.category === category) &&
        (!q || item.name.toLowerCase().includes(q))
    ).map(({ id, name, category: cat }) => ({ id, name, category: cat }));
  },

  async exerciseLogCreate({ token, body }) {
    await delay();
    const user = getMockUser(token);
    const errors = validateExerciseEntry(body);

    if (Object.keys(errors).length) fail(400, "Please fix the highlighted fields.", errors);

    const exercise = EXERCISES.find((item) => item.id === body.exerciseId);

    if (!exercise) fail(404, "That exercise could not be found.", { exerciseId: "Choose an exercise." });

    const data = load(user.id);
    const kg = latestWeightKg(data, user, body.date);
    const minutes = Number(body.minutes);

    const log = {
      id: newId("ex"),
      date: body.date,
      exerciseId: exercise.id,
      name: exercise.name,
      minutes,
      // calories = MET x body weight (kg) x hours
      caloriesBurned: Math.round((exercise.met * kg * minutes) / 60),
      loggedAt: new Date().toISOString(),
    };

    data.exercise.push(log);
    save(user.id, data);

    return log;
  },

  async exerciseLogDelete({ token, body }) {
    await delay(200);
    const user = getMockUser(token);
    const data = load(user.id);

    if (!data.exercise.some((item) => item.id === body?.id)) {
      fail(404, "That entry no longer exists.");
    }

    data.exercise = data.exercise.filter((item) => item.id !== body.id);
    save(user.id, data);

    return { id: body.id };
  },

  async stepsSet({ token, body }) {
    await delay(200);
    const user = getMockUser(token);
    const errors = validateSteps(body);

    if (Object.keys(errors).length) fail(400, "Please fix the highlighted fields.", errors);

    const data = load(user.id);
    data.steps[body.date] = Number(body.steps);
    save(user.id, data);

    return { date: body.date, count: data.steps[body.date], goal: STEP_GOAL };
  },

  // Weight is received in kg; one entry per date (a second save that day
  // updates it).
  async weightLog({ token, body }) {
    await delay(200);
    const user = getMockUser(token);
    const errors = validateWeight({ weight: body?.weightKg, unit: "kg", date: body?.date });

    if (Object.keys(errors).length) {
      fail(400, "Please fix the highlighted fields.", {
        ...(errors.weight && { weight: errors.weight }),
        ...(errors.date && { date: errors.date }),
      });
    }

    const data = load(user.id);
    const entry = { date: body.date, kg: Math.round(Number(body.weightKg) * 100) / 100 };
    const existing = data.weights.findIndex((w) => w.date === entry.date);

    if (existing >= 0) data.weights[existing] = entry;
    else data.weights.push(entry);

    save(user.id, data);

    return entry;
  },

  // Daily series for the dashboard graphs: the `days` days ending on `date`
  // (food calories, steps, calories burned, weight), plus the averages the
  // cards show and the targets to draw. Real logs are used; a user with
  // nothing logged in the window gets clearly flagged SAMPLE data so the
  // graphs can be seen before any history exists.
  async monthlyStats({ token, params }) {
    await delay(300);
    const user = getMockUser(token);
    requireDate(params?.date);
    const days = Math.min(Math.max(Number(params?.days) || 30, 7), 90);
    const dates = Array.from({ length: days }, (_, i) =>
      addDays(params.date, i - (days - 1))
    );
    const data = load(user.id);

    let series = dates.map((date) => {
      const food = data.food.filter((log) => log.date === date);
      const burned = data.exercise
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.caloriesBurned, 0);
      const weight = data.weights.find((entry) => entry.date === date);

      return {
        date,
        calories: food.length ? sumNutrition(food).calories : null,
        steps: date in data.steps ? data.steps[date] : null,
        exerciseCalories: burned,
        weightKg: weight ? weight.kg : null,
      };
    });

    const hasData = series.some(
      (day) =>
        day.calories !== null ||
        day.steps !== null ||
        day.exerciseCalories > 0 ||
        day.weightKg !== null
    );

    if (!hasData) series = sampleSeries(dates, user);

    const logged = (key) => series.filter((day) => day[key] !== null);
    const average = (list, key) =>
      list.length
        ? Math.round(list.reduce((sum, day) => sum + day[key], 0) / list.length)
        : null;
    const activeDays = series.filter((day) => day.exerciseCalories > 0);
    const weights = logged("weightKg");

    return {
      from: dates[0],
      to: dates[dates.length - 1],
      days: series,
      sample: !hasData,
      targets: { calories: user.targets?.calories ?? null, steps: STEP_GOAL },
      summary: {
        avgCalories: average(logged("calories"), "calories"),
        daysLogged: logged("calories").length,
        avgSteps: average(logged("steps"), "steps"),
        totalExerciseCalories: activeDays.reduce(
          (sum, day) => sum + day.exerciseCalories,
          0
        ),
        activeDays: activeDays.length,
        firstWeightKg: weights[0]?.weightKg ?? null,
        latestWeightKg: weights[weights.length - 1]?.weightKg ?? null,
        weightChangeKg: weights.length > 1
          ? Math.round((weights[weights.length - 1].weightKg - weights[0].weightKg) * 100) / 100
          : null,
      },
    };
  },

  async weightHistory({ token, params }) {
    await delay(150);
    const user = getMockUser(token);
    const limit = Math.min(Math.max(Number(params?.limit) || 30, 1), 365);

    return [...load(user.id).weights]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit);
  },
};
