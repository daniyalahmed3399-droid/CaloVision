"use client";

import { useState } from "react";

import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import { Skeleton } from "../ui/Skeleton";
import TextField from "../ui/TextField";
import { toFormError } from "../../lib/api/errors";
import { formatLongDate } from "../../lib/dates";
import { useAppDispatch } from "../../lib/store/hooks";
import {
  useLogFoodMutation,
  usePreviewFoodQuery,
} from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import { useDebouncedValue } from "../../lib/useDebouncedValue";
import {
  MEAL_LABELS,
  MEAL_OPTIONS,
  formatNumber,
  hasErrors,
  validateFoodEntry,
} from "../../lib/tracking";

// Food detail: reference values, choose quantity / unit / meal, see the
// calculated nutrition (returned by the backend), then save.
export default function FoodDetailDialog({ food, mealType, date, onClose, onLogged }) {
  return (
    <Modal
      open={Boolean(food)}
      onClose={onClose}
      title={food?.name || "Add food"}
      description={food ? `${food.category} · ${formatLongDate(date)}` : ""}
    >
      {food && (
        <FoodForm
          food={food}
          mealType={mealType}
          date={date}
          onClose={onClose}
          onLogged={onLogged}
        />
      )}
    </Modal>
  );
}

function FoodForm({ food, mealType: initialMeal, date, onClose, onLogged }) {
  const dispatch = useAppDispatch();
  const [logFood, { isLoading }] = useLogFoodMutation();

  const [quantity, setQuantity] = useState(food.unit === "serving" ? "1" : "100");
  const [unit, setUnit] = useState(food.unit);
  const [mealType, setMealType] = useState(initialMeal);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const entry = { foodId: food.id, quantity, unit, mealType, date };
  const entryErrors = validateFoodEntry(entry);

  // Only quantity/unit affect the preview; ask the backend once typing
  // pauses and only when they're valid.
  const debouncedQuantity = useDebouncedValue(quantity, 300);
  const previewReady = !entryErrors.quantity && !entryErrors.unit;

  // currentData (not data): `data` keeps the previous quantity's result
  // while a new one is pending, which would show stale nutrition.
  const { currentData: preview, isFetching, isError } = usePreviewFoodQuery(
    { foodId: food.id, quantity: Number(debouncedQuantity), unit },
    { skip: !previewReady || debouncedQuantity !== quantity }
  );

  const submit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setErrors(entryErrors);
    setFormError("");

    if (hasErrors(entryErrors)) return;

    try {
      await logFood({
        date,
        mealType,
        foodId: food.id,
        quantity: Number(quantity),
        unit,
      }).unwrap();

      dispatch(
        toastShown({ message: `${food.name} added to ${MEAL_LABELS[mealType]}` })
      );
      onLogged?.();
      onClose();
    } catch (error) {
      const failure = toFormError(error);
      setErrors(failure.fieldErrors);
      setFormError(failure.message);
    }
  };

  const { reference } = food;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormAlert>{formError}</FormAlert>

      <p className="rounded-xl bg-[#f6f9f1] px-4 py-3 text-xs leading-5 text-gray-600">
        <span className="font-semibold text-gray-800">
          Per {reference.amount} {reference.unit}:
        </span>{" "}
        {formatNumber(reference.calories)} kcal · P {formatNumber(reference.protein, 1)}g
        · C {formatNumber(reference.carbs, 1)}g · F {formatNumber(reference.fat, 1)}g
      </p>

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <TextField
          label="Quantity"
          type="number"
          inputMode="decimal"
          step="any"
          value={quantity}
          onChange={(event) => {
            setQuantity(event.target.value);
            setErrors({});
          }}
          error={errors.quantity}
          data-autofocus
        />

        <SelectField
          label="Unit"
          options={food.units.map((value) => ({ value, label: value }))}
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
            setErrors({});
          }}
          error={errors.unit}
          className="min-w-[110px]"
        />
      </div>

      <SelectField
        label="Meal"
        options={MEAL_OPTIONS}
        value={mealType}
        onChange={(event) => {
          setMealType(event.target.value);
          setErrors({});
        }}
        error={errors.mealType}
      />

      <div
        aria-live="polite"
        className="rounded-2xl border border-gray-100 p-4"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          This portion
        </p>

        {!previewReady ? (
          <p className="mt-2 text-sm text-gray-400">
            Enter a valid quantity to see the nutrition.
          </p>
        ) : isError ? (
          <p className="mt-2 text-sm text-gray-500">
            Couldn&apos;t calculate this right now. You can still save.
          </p>
        ) : !preview || isFetching ? (
          <div className="mt-2 space-y-2" aria-label="Calculating">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-48" />
          </div>
        ) : (
          <>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">
              {formatNumber(preview.calories)}
              <span className="ml-1 text-sm font-medium text-gray-400">kcal</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              P {formatNumber(preview.protein, 1)}g · C {formatNumber(preview.carbs, 1)}g
              · F {formatNumber(preview.fat, 1)}g · Fibre {formatNumber(preview.fiber, 1)}g
            </p>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="green" className="flex-1" loading={isLoading}>
          Add food
        </Button>
      </div>
    </form>
  );
}
