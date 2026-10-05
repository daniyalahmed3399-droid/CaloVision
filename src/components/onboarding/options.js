// Option lists for onboarding. Values are what gets sent to the backend, so
// confirm them against the API once it is available.

export const GOAL_OPTIONS = [
  {
    value: "lose",
    label: "Lose weight",
    description: "Eat slightly below what your body uses.",
  },
  {
    value: "maintain",
    label: "Maintain weight",
    description: "Stay where you are and keep eating well.",
  },
  {
    value: "gain",
    label: "Gain weight",
    description: "Eat slightly above what your body uses.",
  },
];

export const ACTIVITY_OPTIONS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
  },
  {
    value: "light",
    label: "Lightly active",
    description: "Exercise 1–3 days per week",
  },
  {
    value: "moderate",
    label: "Moderately active",
    description: "Exercise 3–5 days per week",
  },
  {
    value: "very",
    label: "Very active",
    description: "Exercise 6–7 days per week",
  },
  {
    value: "extra",
    label: "Extra active",
    description: "Very hard exercise or a physical job",
  },
];

export const DIET_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "halal", label: "Halal" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "nut-free", label: "Nut-free" },
  { value: "low-carb", label: "Low carb" },
];

export const LIMITS = {
  age: { min: 18, max: 100 },
  heightCm: { min: 120, max: 230 },
  weightKg: { min: 30, max: 300 },
};

export const LB_PER_KG = 2.20462262;
export const CM_PER_INCH = 2.54;
