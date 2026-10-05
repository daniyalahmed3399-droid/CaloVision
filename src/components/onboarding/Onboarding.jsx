"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Flame,
  Ruler,
  Scale,
  Sparkles,
  User,
} from "lucide-react";

import { useAuth } from "../../lib/store/useAuth";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  dietToggled,
  errorsSet,
  fieldChanged,
  stepMoved,
  stepSet,
  unitsChanged,
} from "../../lib/store/slices/onboardingSlice";
import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import TextField from "../ui/TextField";
import OptionCard from "./OptionCard";
import TargetReview from "./TargetReview";
import {
  ACTIVITY_OPTIONS,
  DIET_OPTIONS,
  GOAL_OPTIONS,
} from "./options";
import {
  buildProfile,
  validateActivity,
  validateBody,
  validateGoal,
} from "./validate";
import { FEATURES } from "../../lib/config";

export default function Onboarding() {
  const { user, saveOnboarding, applyUser, logout } = useAuth();

  // All wizard state lives in the onboarding slice, so progress survives
  // navigating away and back. Saving/error flags come from the
  // saveOnboarding thunk.
  const dispatch = useAppDispatch();
  const { form, errors, stepIndex, saving, saveError, reviewUser } =
    useAppSelector((state) => state.onboarding);

  // Steps after the welcome screen are counted ("Step 1 of 4"). Diet
  // preferences are only shown when the backend stores them.
  const steps = useMemo(
    () => [
      "welcome",
      "body",
      "goal",
      "activity",
      ...(FEATURES.dietPreferences ? ["preferences"] : []),
      "review",
    ],
    []
  );

  const step = steps[stepIndex];
  const countedSteps = steps.length - 1;
  const lastInputStep = steps[steps.length - 2];

  const update = (name, value) =>
    dispatch(fieldChanged({ field: name, value }));

  const field = (name) => ({
    value: form[name],
    onChange: (event) => update(name, event.target.value),
  });

  const goBack = () => dispatch(stepMoved(-1));

  const goNext = () => {
    const validators = {
      body: validateBody,
      goal: validateGoal,
      activity: validateActivity,
    };

    const nextErrors = validators[step]?.(form) || {};
    dispatch(errorsSet(nextErrors));

    if (Object.keys(nextErrors).length > 0) return;

    if (step === lastInputStep) {
      // On success the slice stores the returned user and moves to the
      // review step; on failure it stores the error message.
      saveOnboarding(buildProfile(form)).catch(() => {});
    } else {
      dispatch(stepMoved(1));
    }
  };

  const toggleDiet = (value) => dispatch(dietToggled(value));

  const setUnits = (units) => dispatch(unitsChanged(units));

  const progress = step === "welcome" ? 0 : (stepIndex / countedSteps) * 100;

  return (
    <div className="min-h-screen bg-[#f6f9f1]">
      {/* Header */}
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[760px] items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-extrabold text-gray-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4dbb08] text-white">
              <Flame size={19} />
            </span>
            CaloVision
          </Link>

          <button
            type="button"
            onClick={logout}
            className="text-sm font-semibold text-gray-500 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[760px] px-5 py-10 sm:py-14">
        {/* Progress */}
        {step !== "welcome" && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>
                Step {stepIndex} of {countedSteps}
              </span>
            </div>

            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={countedSteps}
              aria-valuenow={stepIndex}
              aria-label="Onboarding progress"
              className="h-2 overflow-hidden rounded-full bg-[#dfeacf]"
            >
              <motion.div
                className="h-full rounded-full bg-[#4dbb08]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
          >
            {/* WELCOME */}
            {step === "welcome" && (
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
                  <Sparkles size={30} />
                </div>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
                  Welcome to CaloVision
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
                  We need a few details to personalise your daily targets.
                  It only takes a minute, and you can change everything
                  later in Settings.
                </p>

                <Button
                  variant="green"
                  className="mx-auto mt-8 w-full max-w-xs"
                  onClick={() => dispatch(stepSet(1))}
                >
                  Let&apos;s get started
                  <ArrowRight size={18} />
                </Button>
              </div>
            )}

            {/* BODY DETAILS */}
            {step === "body" && (
              <>
                <StepHeading
                  title="Tell us about you"
                  description="We use this to estimate how much energy your body needs."
                />

                <div
                  role="group"
                  aria-label="Measurement units"
                  className="mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-[#f5f7f2] p-1.5"
                >
                  {[
                    ["metric", "Metric", "(cm / kg)"],
                    ["imperial", "Imperial", "(ft / lb)"],
                  ].map(([value, label, units]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={form.units === value}
                      onClick={() => setUnits(value)}
                      className={`rounded-xl py-3 text-sm font-bold transition-all ${
                        form.units === value
                          ? "bg-white text-[#3c9705] shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      {label}
                      <span className="ml-1 text-xs font-medium">
                        {units}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField
                    className="sm:col-span-2"
                    label="Name (optional)"
                    autoComplete="name"
                    placeholder="What should we call you?"
                    icon={<User size={17} />}
                    {...field("name")}
                  />

                  <TextField
                    label="Age"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 28"
                    suffix="years"
                    error={errors.age}
                    {...field("age")}
                  />

                  <div>
                    <label
                      htmlFor="onboarding-gender"
                      className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                      Gender
                    </label>

                    <select
                      id="onboarding-gender"
                      value={form.gender}
                      onChange={(event) =>
                        update("gender", event.target.value)
                      }
                      aria-invalid={Boolean(errors.gender)}
                      className={`h-14 w-full rounded-xl border bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-4 ${
                        errors.gender
                          ? "border-red-400 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-[#4dbb08] focus:ring-[#4dbb08]/10"
                      }`}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>

                    {errors.gender && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  {form.units === "metric" ? (
                    <>
                      <TextField
                        label="Height"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 175"
                        suffix="cm"
                        icon={<Ruler size={17} />}
                        error={errors.height}
                        {...field("heightCm")}
                      />

                      <TextField
                        label="Current weight"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 72"
                        suffix="kg"
                        icon={<Scale size={17} />}
                        error={errors.weight}
                        {...field("weightKg")}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="mb-2 block text-sm font-semibold text-gray-800">
                          Height
                        </span>

                        <div className="grid grid-cols-2 gap-3">
                          <TextField
                            label="Feet"
                            type="number"
                            inputMode="numeric"
                            placeholder="5"
                            suffix="ft"
                            {...field("heightFeet")}
                          />

                          <TextField
                            label="Inches"
                            type="number"
                            inputMode="numeric"
                            placeholder="9"
                            suffix="in"
                            {...field("heightInches")}
                          />
                        </div>

                        {errors.height && (
                          <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.height}
                          </p>
                        )}
                      </div>

                      <TextField
                        label="Current weight"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 158"
                        suffix="lb"
                        icon={<Scale size={17} />}
                        error={errors.weight}
                        {...field("weightLb")}
                      />
                    </>
                  )}
                </div>
              </>
            )}

            {/* GOAL */}
            {step === "goal" && (
              <>
                <StepHeading
                  title="What's your goal?"
                  description="Your calorie target is adjusted around this."
                />

                <div
                  role="radiogroup"
                  aria-label="Goal"
                  className="grid gap-3"
                >
                  {GOAL_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      name="goal"
                      value={option.value}
                      label={option.label}
                      description={option.description}
                      checked={form.goal === option.value}
                      onChange={() => update("goal", option.value)}
                    />
                  ))}
                </div>

                {errors.goal && (
                  <p className="mt-3 text-xs font-medium text-red-600">
                    {errors.goal}
                  </p>
                )}

                {form.goal && form.goal !== "maintain" && (
                  <div className="mt-6">
                    {form.units === "metric" ? (
                      <TextField
                        label="Target weight"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 68"
                        suffix="kg"
                        icon={<Scale size={17} />}
                        error={errors.targetWeight}
                        {...field("targetWeight")}
                      />
                    ) : (
                      <TextField
                        label="Target weight"
                        type="number"
                        inputMode="decimal"
                        placeholder="e.g. 150"
                        suffix="lb"
                        icon={<Scale size={17} />}
                        error={errors.targetWeight}
                        {...field("targetWeightLb")}
                      />
                    )}
                  </div>
                )}
              </>
            )}

            {/* ACTIVITY */}
            {step === "activity" && (
              <>
                <StepHeading
                  title="How active are you?"
                  description="Think about a typical week."
                />

                <div
                  role="radiogroup"
                  aria-label="Activity level"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {ACTIVITY_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      name="activity"
                      value={option.value}
                      label={option.label}
                      description={option.description}
                      checked={form.activity === option.value}
                      onChange={() => update("activity", option.value)}
                    />
                  ))}
                </div>

                {errors.activity && (
                  <p className="mt-3 text-xs font-medium text-red-600">
                    {errors.activity}
                  </p>
                )}
              </>
            )}

            {/* DIET PREFERENCES */}
            {step === "preferences" && (
              <>
                <StepHeading
                  title="Any diet preferences?"
                  description="Optional. Select everything that applies, or skip."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  {DIET_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.value}
                      multiple
                      name="dietPreferences"
                      value={option.value}
                      label={option.label}
                      checked={form.dietPreferences.includes(option.value)}
                      onChange={() => toggleDiet(option.value)}
                    />
                  ))}
                </div>
              </>
            )}

            {/* TARGET REVIEW */}
            {step === "review" && reviewUser && (
              <TargetReview
                user={reviewUser}
                onConfirm={() => applyUser(reviewUser)}
              />
            )}

            {/* Navigation */}
            {step !== "welcome" && (
              <div className="mt-8">
                <div className="mb-4">
                  <FormAlert>{saveError}</FormAlert>
                </div>

                {step !== "review" ? (
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={goBack}
                      disabled={saving}
                    >
                      <ArrowLeft size={18} />
                      Back
                    </Button>

                    <Button
                      variant="green"
                      loading={saving}
                      onClick={goNext}
                      className="flex-1"
                    >
                      {saving
                        ? "Calculating your targets…"
                        : step === lastInputStep
                          ? "See my targets"
                          : "Continue"}
                      {!saving && <ArrowRight size={18} />}
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold text-gray-500 hover:text-gray-900"
                  >
                    ← Change my answers
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {user?.email && step === "welcome" && (
          <p className="mt-6 text-center text-xs text-gray-400">
            Signed in as {user.email}
          </p>
        )}
      </main>
    </div>
  );
}

function StepHeading({ title, description }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
        {title}
      </h1>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>
    </div>
  );
}
