import { LIMITS } from "../components/onboarding/options";

// Accepted ranges. Metric limits match the rest of the app (calorie
// calculator, onboarding). Imperial limits are set in whole inches/pounds so
// the error message is exactly true at both ends: 47 in = 3'11", 90 in =
// 7'6", and 66-661 lb is the same 30-300 kg span.
export const BMI_LIMITS = {
  heightCm: LIMITS.heightCm,
  weightKg: LIMITS.weightKg,
  heightIn: { min: 47, max: 90 },
  weightLb: { min: 66, max: 661 },
};

const isNumber = (value) =>
  value !== "" &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));

const outside = (value, { min, max }) =>
  Number(value) < min || Number(value) > max;

// Returns a user-facing error message, or "" when the input is usable.
export function validateBmiInput({
  unit,
  heightCm,
  weightKg,
  heightFt,
  heightIn,
  weightLbs,
}) {
  if (unit === "metric") {
    if (!isNumber(heightCm) || !isNumber(weightKg)) {
      return "Enter your height and weight.";
    }

    if (outside(heightCm, BMI_LIMITS.heightCm)) {
      return `Enter a height between ${BMI_LIMITS.heightCm.min} and ${BMI_LIMITS.heightCm.max} cm.`;
    }

    if (outside(weightKg, BMI_LIMITS.weightKg)) {
      return `Enter a weight between ${BMI_LIMITS.weightKg.min} and ${BMI_LIMITS.weightKg.max} kg.`;
    }

    return "";
  }

  if (!isNumber(heightFt) || !isNumber(heightIn) || !isNumber(weightLbs)) {
    return "Enter your height (feet and inches) and weight.";
  }

  if (Number(heightFt) < 0 || Number(heightIn) < 0) {
    return "Height can't be negative.";
  }

  if (Number(heightIn) >= 12) {
    return "Inches must be between 0 and 11.";
  }

  const totalInches = Number(heightFt) * 12 + Number(heightIn);

  if (outside(totalInches, BMI_LIMITS.heightIn)) {
    return "Enter a height between 3'11\" and 7'6\".";
  }

  if (outside(weightLbs, BMI_LIMITS.weightLb)) {
    return `Enter a weight between ${BMI_LIMITS.weightLb.min} and ${BMI_LIMITS.weightLb.max} lb.`;
  }

  return "";
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obesity";
}

// Assumes the input has already passed validateBmiInput.
export function calculateBmi({
  unit,
  heightCm,
  weightKg,
  heightFt,
  heightIn,
  weightLbs,
}) {
  let value;

  if (unit === "metric") {
    const meters = Number(heightCm) / 100;
    value = Number(weightKg) / (meters * meters);
  } else {
    const inches = Number(heightFt) * 12 + Number(heightIn);
    value = (Number(weightLbs) / (inches * inches)) * 703;
  }

  return { bmi: value.toFixed(1), category: bmiCategory(value) };
}
