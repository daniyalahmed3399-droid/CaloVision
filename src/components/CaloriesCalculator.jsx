"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Flame,
  Info,
  Scale,
  Target,
  User,
} from "lucide-react";

const activityLevels = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little or no exercise",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Lightly Active",
    description: "Exercise 1–3 days per week",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Moderately Active",
    description: "Exercise 3–5 days per week",
    multiplier: 1.55,
  },
  {
    value: "very",
    label: "Very Active",
    description: "Exercise 6–7 days per week",
    multiplier: 1.725,
  },
  {
    value: "extra",
    label: "Extra Active",
    description: "Very hard exercise or physical job",
    multiplier: 1.9,
  },
];

const goals = [
  {
    value: "loss",
    label: "Weight Loss",
    description: "Create a moderate calorie deficit",
    adjustment: -0.15,
  },
  {
    value: "maintenance",
    label: "Maintenance",
    description: "Maintain your current weight",
    adjustment: 0,
  },
  {
    value: "gain",
    label: "Weight Gain",
    description: "Create a moderate calorie surplus",
    adjustment: 0.15,
  },
];

const initialForm = {
  age: "",
  gender: "",

  // Metric
  heightCm: "",
  weightKg: "",

  // Imperial
  heightFeet: "",
  heightInches: "",
  weightLb: "",

  activity: "",
  goal: "",
};

export default function CaloriesCalculator() {
  const [unit, setUnit] = useState("metric");
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const selectedActivity = useMemo(
    () => activityLevels.find((item) => item.value === form.activity),
    [form.activity]
  );

  const selectedGoal = useMemo(
    () => goals.find((item) => item.value === form.goal),
    [form.goal]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    setResult(null);
    setError("");
  };

  const calculateCalories = (e) => {
    e.preventDefault();

    setError("");
    setResult(null);

    const age = Number(form.age);

    if (!form.age || !form.gender || !form.activity || !form.goal) {
      setError("Please complete all required fields before calculating.");
      return;
    }

    if (!Number.isFinite(age) || age <= 0) {
      setError("Please enter a valid positive age.");
      return;
    }

    if (age < 18 || age > 100) {
      setError("Please enter an age between 18 and 100 years.");
      return;
    }

    let heightCm;
    let weightKg;

    /*
      ---------------------------------
      METRIC INPUT
      ---------------------------------

      Height = centimeters
      Weight = kilograms
    */

    if (unit === "metric") {
      heightCm = Number(form.heightCm);
      weightKg = Number(form.weightKg);

      if (!form.heightCm || !form.weightKg) {
        setError("Please enter your height and weight.");
        return;
      }

      if (
        !Number.isFinite(heightCm) ||
        !Number.isFinite(weightKg) ||
        heightCm <= 0 ||
        weightKg <= 0
      ) {
        setError("Height and weight must be positive numbers.");
        return;
      }

      if (heightCm < 120 || heightCm > 230) {
        setError("Please enter a height between 120 cm and 230 cm.");
        return;
      }

      if (weightKg < 30 || weightKg > 300) {
        setError("Please enter a weight between 30 kg and 300 kg.");
        return;
      }
    }

    /*
      ---------------------------------
      IMPERIAL INPUT
      ---------------------------------

      Height = feet + inches
      Weight = pounds

      We convert everything to metric
      before calculating BMR.
    */

    if (unit === "imperial") {
      const feet = Number(form.heightFeet);
      const inches = Number(form.heightInches);
      const weightLb = Number(form.weightLb);

      if (!form.heightFeet || !form.heightInches || !form.weightLb) {
        setError("Please enter your height and weight.");
        return;
      }

      if (
        !Number.isFinite(feet) ||
        !Number.isFinite(inches) ||
        !Number.isFinite(weightLb)
      ) {
        setError("Please enter valid numbers for your measurements.");
        return;
      }

      if (feet <= 0 || inches < 0 || weightLb <= 0) {
        setError("Height and weight must contain positive values.");
        return;
      }

      if (inches >= 12) {
        setError("Height inches must be between 0 and 11.");
        return;
      }

      /*
        Convert feet/inches → total inches
      */
      const totalInches = feet * 12 + inches;

      /*
        Convert inches → centimeters
      */
      heightCm = totalInches * 2.54;

      /*
        Convert pounds → kilograms
      */
      weightKg = weightLb * 0.45359237;

      if (heightCm < 120 || heightCm > 230) {
        setError("Please enter a height between 3'11\" and 7'7\".");
        return;
      }

      if (weightKg < 30 || weightKg > 300) {
        setError("Please enter a weight between 66 lb and 661 lb.");
        return;
      }
    }

    if (!selectedActivity || !selectedGoal) {
      setError("Please select your activity level and fitness goal.");
      return;
    }

    /*
      ---------------------------------
      BMR CALCULATION
      ---------------------------------

      Mifflin-St Jeor equation

      Male:
      BMR =
      10 × weight +
      6.25 × height -
      5 × age +
      5

      Female:
      BMR =
      10 × weight +
      6.25 × height -
      5 × age -
      161
    */

    let bmr;

    if (form.gender === "male") {
      bmr =
        10 * weightKg +
        6.25 * heightCm -
        5 * age +
        5;
    } else {
      bmr =
        10 * weightKg +
        6.25 * heightCm -
        5 * age -
        161;
    }

    /*
      Maintenance calories are calculated
      using the activity multiplier.
    */

    const maintenanceCalories = Math.round(
      bmr * selectedActivity.multiplier
    );

    /*
      Apply the fitness goal.
    */

    const targetCalories = Math.round(
      maintenanceCalories *
        (1 + selectedGoal.adjustment)
    );

    /*
      Final safety check.
    */

    if (
      !Number.isFinite(bmr) ||
      !Number.isFinite(maintenanceCalories) ||
      !Number.isFinite(targetCalories) ||
      bmr <= 0 ||
      maintenanceCalories <= 0 ||
      targetCalories <= 0
    ) {
      setError(
        "We couldn't calculate a sensible result from those values. Please check your information."
      );

      return;
    }

    setResult({
      bmr: Math.round(bmr),
      maintenance: maintenanceCalories,
      target: targetCalories,
      goal: selectedGoal.label,
      activity: selectedActivity.label,
      heightCm: Math.round(heightCm),
      weightKg: Math.round(weightKg * 10) / 10,
    });
  };

  const resetCalculator = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <section className="relative overflow-hidden bg-[#f6f9f1] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#4dbb08]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#f5d547]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-[2px] w-10 bg-[#4dbb08]" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#4dbb08] sm:text-sm">
              Calories Calculator
            </span>

            <span className="h-[2px] w-10 bg-[#4dbb08]" />
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.035em] text-gray-900 sm:text-5xl lg:text-6xl">
            Understand Your Daily
            <span className="block text-[#4dbb08]">
              Calorie Requirements
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Estimate your daily calorie needs based on your body
            measurements, activity level, and fitness goal.
          </p>
        </motion.div>

        {/* Calculator */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8 lg:p-10"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
                <Calculator size={23} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your Information
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Choose your preferred measurement system.
                </p>
              </div>
            </div>

            {/* UNIT TOGGLE */}
            <div className="mb-8 rounded-2xl bg-[#f5f7f2] p-1.5">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleUnitChange("metric")}
                  className={`rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                    unit === "metric"
                      ? "bg-white text-[#4dbb08] shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Metric
                  <span className="ml-1 text-xs font-medium">
                    (cm / kg)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUnitChange("imperial")}
                  className={`rounded-xl py-3 text-sm font-bold transition-all duration-300 ${
                    unit === "imperial"
                      ? "bg-white text-[#4dbb08] shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Imperial
                  <span className="ml-1 text-xs font-medium">
                    (ft / lb)
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={calculateCalories}>

              {/* BASIC INFORMATION */}
              <div className="grid gap-6 sm:grid-cols-2">

                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  min="18"
                  max="100"
                  icon={<User size={17} />}
                  suffix="years"
                />

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Gender
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white focus:ring-4 focus:ring-[#4dbb08]/10"
                    >
                      <option value="">
                        Select gender
                      </option>

                      <option value="male">
                        Male
                      </option>

                      <option value="female">
                        Female
                      </option>
                    </select>
                  </div>
                </div>

                {/* HEIGHT */}
                {unit === "metric" ? (
                  <InputField
                    label="Height"
                    name="heightCm"
                    type="number"
                    value={form.heightCm}
                    onChange={handleChange}
                    placeholder="e.g. 175"
                    min="120"
                    max="230"
                    icon={<ArrowRight size={17} className="rotate-90" />}
                    suffix="cm"
                  />
                ) : (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Height
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <InputField
                        label=""
                        name="heightFeet"
                        type="number"
                        value={form.heightFeet}
                        onChange={handleChange}
                        placeholder="Feet"
                        min="3"
                        max="7"
                        icon={<ArrowRight size={15} className="rotate-90" />}
                        suffix="ft"
                      />

                      <InputField
                        label=""
                        name="heightInches"
                        type="number"
                        value={form.heightInches}
                        onChange={handleChange}
                        placeholder="Inches"
                        min="0"
                        max="11"
                        icon={<ArrowRight size={15} className="rotate-90" />}
                        suffix="in"
                      />
                    </div>
                  </div>
                )}

                {/* WEIGHT */}
                {unit === "metric" ? (
                  <InputField
                    label="Weight"
                    name="weightKg"
                    type="number"
                    value={form.weightKg}
                    onChange={handleChange}
                    placeholder="e.g. 72"
                    min="30"
                    max="300"
                    icon={<Scale size={17} />}
                    suffix="kg"
                  />
                ) : (
                  <InputField
                    label="Weight"
                    name="weightLb"
                    type="number"
                    value={form.weightLb}
                    onChange={handleChange}
                    placeholder="e.g. 158"
                    min="66"
                    max="661"
                    icon={<Scale size={17} />}
                    suffix="lb"
                  />
                )}
              </div>

              {/* ACTIVITY */}
              <div className="mt-7">
                <label className="mb-3 block text-sm font-semibold text-gray-800">
                  Activity Level
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {activityLevels.map((activity) => (
                    <label
                      key={activity.value}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        form.activity === activity.value
                          ? "border-[#4dbb08] bg-[#f1f9e9] shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-[#4dbb08]/40 hover:bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="activity"
                        value={activity.value}
                        checked={form.activity === activity.value}
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            form.activity === activity.value
                              ? "bg-[#4dbb08] text-white"
                              : "bg-white text-gray-400"
                          }`}
                        >
                          <Activity size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {activity.label}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* GOAL */}
              <div className="mt-7">
                <label className="mb-3 block text-sm font-semibold text-gray-800">
                  Fitness Goal
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  {goals.map((goal) => (
                    <label
                      key={goal.value}
                      className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        form.goal === goal.value
                          ? "border-[#4dbb08] bg-[#f1f9e9] shadow-sm"
                          : "border-gray-200 bg-gray-50 hover:border-[#4dbb08]/40 hover:bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        value={goal.value}
                        checked={form.goal === goal.value}
                        onChange={handleChange}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            form.goal === goal.value
                              ? "bg-[#4dbb08] text-white"
                              : "bg-white text-gray-400"
                          }`}
                        >
                          <Target size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            {goal.label}
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-gray-500">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <Info
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>
                </motion.div>
              )}

              {/* BUTTONS */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-[#17251a] px-6 text-sm font-bold text-white shadow-lg transition-colors hover:bg-[#4dbb08]"
                >
                  Calculate My Calories
                  <ArrowRight size={18} />
                </motion.button>

                <button
                  type="button"
                  onClick={resetCalculator}
                  className="h-14 rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>

          {/* RESULTS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative overflow-hidden rounded-[28px] bg-[#17251a] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-8 lg:p-10"
          >
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[30px] border-white/5" />

            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4dbb08]">
                  <Flame size={23} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8fe34d]">
                    Your Result
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Daily Calories
                  </h2>
                </div>
              </div>

              {!result ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5">
                    <Calculator
                      size={36}
                      className="text-[#8fe34d]"
                    />
                  </div>

                  <h3 className="mt-7 text-2xl font-bold">
                    Your result will appear here
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-white/60">
                    Enter your information and calculate your
                    estimated daily calorie requirements.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* TARGET */}
                  <div className="rounded-2xl bg-white/5 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
                      Recommended target
                    </p>

                    <div className="mt-2 flex items-end gap-2">
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-extrabold tracking-tight text-[#8fe34d] sm:text-6xl"
                      >
                        {result.target.toLocaleString()}
                      </motion.span>

                      <span className="mb-2 text-sm text-white/60">
                        kcal/day
                      </span>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4dbb08]/15 px-3 py-2 text-xs font-semibold text-[#8fe34d]">
                      <CheckCircle2 size={14} />
                      {result.goal}
                    </div>
                  </div>

                  {/* BREAKDOWN */}
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <ResultBox
                      label="BMR"
                      value={result.bmr}
                      icon={<User size={16} />}
                    />

                    <ResultBox
                      label="Maintenance"
                      value={result.maintenance}
                      icon={<Flame size={16} />}
                    />
                  </div>

                  {/* EXPLANATION */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-3">
                      <Info
                        size={18}
                        className="mt-0.5 shrink-0 text-[#8fe34d]"
                      />

                      <div>
                        <h3 className="text-sm font-bold">
                          What does this mean?
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-white/60">
                          Your BMR estimates the energy your body
                          needs at rest. Maintenance calories account
                          for your activity level. Your target calories
                          are adjusted from maintenance according to
                          your selected goal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* DISCLAIMER */}
                  <p className="mt-5 text-[11px] leading-5 text-white/40">
                    These values are estimates, not medical advice.
                    Individual calorie needs can vary based on health,
                    metabolism, body composition, and other factors.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/*
  Reusable input component
*/
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  min,
  max,
  icon,
  suffix,
}) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-gray-800"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step="any"
          inputMode="decimal"
          className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-14 text-sm text-gray-800 outline-none transition focus:border-[#4dbb08] focus:bg-white focus:ring-4 focus:ring-[#4dbb08]/10"
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
          {suffix}
        </span>
      </div>
    </div>
  );
}

/*
  Result box used for BMR and maintenance calories.
*/
function ResultBox({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-white/50">
        {icon}

        <span className="text-xs font-medium">
          {label}
        </span>
      </div>

      <p className="mt-3 text-xl font-bold">
        {value.toLocaleString()}

        <span className="ml-1 text-xs font-medium text-white/40">
          kcal
        </span>
      </p>
    </div>
  );
}