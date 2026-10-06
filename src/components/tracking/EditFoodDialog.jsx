"use client";

import { useState } from "react";

import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import { toFormError } from "../../lib/api/errors";
import { useAppDispatch } from "../../lib/store/hooks";
import { useUpdateFoodLogMutation } from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import {
  MEAL_OPTIONS,
  hasErrors,
  validateFoodEntry,
} from "../../lib/tracking";

// Change the quantity of a logged food, or move it to another meal. The
// recalculated nutrition comes back from the backend.
export default function EditFoodDialog({ log, onClose }) {
  return (
    <Modal
      open={Boolean(log)}
      onClose={onClose}
      title={log ? `Edit ${log.name}` : "Edit food"}
    >
      {log && <EditFoodForm log={log} onClose={onClose} />}
    </Modal>
  );
}

function EditFoodForm({ log, onClose }) {
  const dispatch = useAppDispatch();
  const [updateFoodLog, { isLoading }] = useUpdateFoodLogMutation();

  const [quantity, setQuantity] = useState(String(log.quantity));
  const [mealType, setMealType] = useState(log.mealType);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const found = validateFoodEntry({
      foodId: log.foodId,
      quantity,
      unit: log.unit,
      mealType,
      date: log.date,
    });
    setErrors(found);
    setFormError("");

    if (hasErrors(found)) return;

    try {
      await updateFoodLog({
        id: log.id,
        date: log.date,
        quantity: Number(quantity),
        mealType,
      }).unwrap();

      dispatch(toastShown({ message: `${log.name} updated` }));
      onClose();
    } catch (error) {
      const failure = toFormError(error);
      setErrors(failure.fieldErrors);
      setFormError(failure.message);
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormAlert>{formError}</FormAlert>

      <TextField
        label="Quantity"
        type="number"
        inputMode="decimal"
        step="any"
        suffix={log.unit}
        value={quantity}
        onChange={(event) => {
          setQuantity(event.target.value);
          setErrors({});
        }}
        error={errors.quantity}
        data-autofocus
      />

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

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="green" className="flex-1" loading={isLoading}>
          Save changes
        </Button>
      </div>
    </form>
  );
}
