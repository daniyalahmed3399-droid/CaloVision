import { CM_PER_INCH, LB_PER_KG, LIMITS } from "./options";

const isNumber = (value) => value !== "" && Number.isFinite(Number(value));

// Converts whatever the user typed into metric values. This is unit
// conversion only; targets themselves come from the backend.
export function toMetric(form) {
  if (form.units === "metric") {
    return {
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      targetWeightKg: Number(form.targetWeight),
    };
  }

  return {
    heightCm:
      (Number(form.heightFeet) * 12 + Number(form.heightInches)) *
      CM_PER_INCH,
    weightKg: Number(form.weightLb) / LB_PER_KG,
    targetWeightKg: Number(form.targetWeightLb) / LB_PER_KG,
  };
}

export function validateBody(form) {
  const errors = {};
  const age = Number(form.age);

  if (!isNumber(form.age)) errors.age = "Enter your age.";
  else if (age < LIMITS.age.min || age > LIMITS.age.max) {
    errors.age = `Enter an age between ${LIMITS.age.min} and ${LIMITS.age.max}.`;
  }

  if (!form.gender) errors.gender = "Select an option.";

  if (form.units === "metric") {
    if (!isNumber(form.heightCm)) errors.height = "Enter your height.";
    if (!isNumber(form.weightKg)) errors.weight = "Enter your weight.";
  } else {
    if (!isNumber(form.heightFeet) || !isNumber(form.heightInches)) {
      errors.height = "Enter your height in feet and inches.";
    } else if (Number(form.heightInches) >= 12) {
      errors.height = "Inches must be between 0 and 11.";
    }
    if (!isNumber(form.weightLb)) errors.weight = "Enter your weight.";
  }

  if (!errors.height || !errors.weight) {
    const { heightCm, weightKg } = toMetric(form);

    if (
      !errors.height &&
      (heightCm < LIMITS.heightCm.min || heightCm > LIMITS.heightCm.max)
    ) {
      errors.height =
        form.units === "metric"
          ? `Enter a height between ${LIMITS.heightCm.min} and ${LIMITS.heightCm.max} cm.`
          : "Enter a height between 3'11\" and 7'7\".";
    }

    if (
      !errors.weight &&
      (weightKg < LIMITS.weightKg.min || weightKg > LIMITS.weightKg.max)
    ) {
      errors.weight =
        form.units === "metric"
          ? `Enter a weight between ${LIMITS.weightKg.min} and ${LIMITS.weightKg.max} kg.`
          : "Enter a weight between 66 and 661 lb.";
    }
  }

  return errors;
}

export function validateGoal(form) {
  const errors = {};

  if (!form.goal) {
    errors.goal = "Choose a goal to continue.";
    return errors;
  }

  if (form.goal === "maintain") return errors;

  const targetEntered =
    form.units === "metric"
      ? isNumber(form.targetWeight)
      : isNumber(form.targetWeightLb);

  if (!targetEntered) {
    errors.targetWeight = "Enter your target weight.";
    return errors;
  }

  const { weightKg, targetWeightKg } = toMetric(form);

  if (
    targetWeightKg < LIMITS.weightKg.min ||
    targetWeightKg > LIMITS.weightKg.max
  ) {
    errors.targetWeight = "Enter a realistic target weight.";
  } else if (form.goal === "lose" && targetWeightKg >= weightKg) {
    errors.targetWeight =
      "Your target should be lower than your current weight.";
  } else if (form.goal === "gain" && targetWeightKg <= weightKg) {
    errors.targetWeight =
      "Your target should be higher than your current weight.";
  }

  return errors;
}

export function validateActivity(form) {
  return form.activity ? {} : { activity: "Choose an activity level." };
}

// Builds the payload sent to the backend (metric, only fields we collect).
export function buildProfile(form) {
  const { heightCm, weightKg, targetWeightKg } = toMetric(form);

  return {
    name: form.name.trim(),
    age: Number(form.age),
    gender: form.gender,
    units: form.units,
    heightCm: Math.round(heightCm * 10) / 10,
    weightKg: Math.round(weightKg * 10) / 10,
    goal: form.goal,
    targetWeightKg:
      form.goal === "maintain"
        ? Math.round(weightKg * 10) / 10
        : Math.round(targetWeightKg * 10) / 10,
    activity: form.activity,
    dietPreferences: form.dietPreferences,
  };
}
