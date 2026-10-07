"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";

import FeatureNotReady from "./FeatureNotReady";
import Button from "../ui/Button";
import PageHeader from "../ui/PageHeader";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import {
  MEAL_OPTIONS,
  MEAL_ORDER,
  MEAL_TEXT_MAX,
  defaultMealForNow,
  validateMealDescription,
} from "../../lib/tracking";

const EXAMPLES = [
  "2 eggs, toast and a cup of milk",
  "200g chicken breast with 150g rice",
  "Oatmeal with a banana and honey",
];

// UI PREVIEW of "describe your meal". It takes what the user types, checks it
// (empty / too long) and runs the same "analyzing" state the real feature will
// have, but there is no text-analysis service yet: nothing is sent or saved,
// and "Analyze meal" ends with a notice saying the feature isn't connected.
// When the backend exists, replace the fake wait in `analyze` with the real
// call, then show a review step (foods found, editable quantities, totals from
// the backend) and save only after the user confirms.
export default function AiTextMealLog() {
  const params = useSearchParams();
  const requestedMeal = params.get("meal");

  const [mealType, setMealType] = useState(
    MEAL_ORDER.includes(requestedMeal) ? requestedMeal : defaultMealForNow()
  );
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone] = useState(false);

  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const analyze = (event) => {
    event.preventDefault();

    // Guards a second click or Enter while the first is "running".
    if (analyzing) return;

    const message = validateMealDescription(description);

    setError(message);
    setDone(false);

    if (message) return;

    setAnalyzing(true);

    timer.current = setTimeout(() => {
      setAnalyzing(false);
      setDone(true);
    }, 1200);
  };

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link
        href="/app/food/add"
        className="mb-2 inline-flex items-center gap-2 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        All ways to add food
      </Link>

      <PageHeader
        eyebrow="Food"
        title="Describe your meal"
        description="Write what you ate in your own words and we'll work out the foods and nutrition."
      />

      <p className="mb-5 rounded-xl bg-[#f6f9f1] px-4 py-3 text-xs leading-5 text-gray-600">
        <span className="font-semibold text-gray-800">Preview:</span> this screen
        shows how describing a meal will work. The analysis isn&apos;t connected
        yet, so what you type stays on this page and nothing is saved.
      </p>

      <form
        onSubmit={analyze}
        noValidate
        className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm min-[400px]:p-6 sm:p-8"
      >
        <div className="space-y-5">
          <TextAreaField
            label="What did you eat?"
            placeholder="e.g. 2 eggs, toast and a cup of milk"
            value={description}
            maxLength={MEAL_TEXT_MAX}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
              setDone(false);
            }}
            error={error}
            hint="Include amounts if you know them, like “200g chicken” or “2 slices of bread”."
            disabled={analyzing}
            data-autofocus
          />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Try an example
            </p>

            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((example) => (
                <button
                  key={example}
                  type="button"
                  disabled={analyzing}
                  onClick={() => {
                    setDescription(example);
                    setError("");
                    setDone(false);
                  }}
                  className="min-h-10 rounded-full border border-gray-200 bg-white px-4 py-2 text-left text-xs font-medium text-gray-600 transition-colors hover:border-[#4dbb08]/50 hover:bg-[#f6f9f1] disabled:opacity-50"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <SelectField
            label="Add to"
            options={MEAL_OPTIONS}
            value={mealType}
            onChange={(event) => setMealType(event.target.value)}
            disabled={analyzing}
            className="sm:max-w-[240px]"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={`/app/food/add/search?meal=${mealType}`}
              className="py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900"
            >
              Prefer to pick foods yourself? Search the food list
            </Link>

            <Button
              type="submit"
              variant="green"
              loading={analyzing}
              className="sm:min-w-[180px]"
            >
              {!analyzing && <Sparkles size={18} />}
              {analyzing ? "Analyzing…" : "Analyze meal"}
            </Button>
          </div>

          {done && (
            <FeatureNotReady
              title="Meal descriptions can't be analyzed yet"
              mealType={mealType}
              showDescribe={false}
            >
              This feature will work once the CaloVision service is fully
              connected. What you wrote wasn&apos;t sent or saved. For now you
              can search the food list to log this meal.
            </FeatureNotReady>
          )}
        </div>
      </form>
    </div>
  );
}
