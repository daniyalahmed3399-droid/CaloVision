"use client";

import { useState } from "react";

import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import Modal from "../ui/Modal";
import SelectField from "../ui/SelectField";
import TextField from "../ui/TextField";
import { toFormError } from "../../lib/api/errors";
import { useAppDispatch } from "../../lib/store/hooks";
import { useLogWeightMutation } from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import { useAuth } from "../../lib/store/useAuth";
import {
  formatWeight,
  hasErrors,
  validateWeight,
  weightInputToKg,
  weightUnitFor,
} from "../../lib/tracking";

const UNIT_OPTIONS = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "lb", label: "Pounds (lb)" },
];

export default function LogWeightDialog({ open, onClose, date, today }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Log weight"
      description="Saving again on the same day updates that day's weight."
    >
      <WeightForm date={date} today={today} onClose={onClose} />
    </Modal>
  );
}

function WeightForm({ date: initialDate, today, onClose }) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [logWeight, { isLoading }] = useLogWeightMutation();

  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState(weightUnitFor(user));
  const [date, setDate] = useState(initialDate);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const clear = () => {
    setErrors({});
    setFormError("");
  };

  const submit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const found = validateWeight({ weight, unit, date });
    setErrors(found);
    setFormError("");

    if (hasErrors(found)) return;

    // The backend stores kilograms whatever unit was typed.
    const weightKg = weightInputToKg(weight, unit);

    try {
      await logWeight({ date, weightKg }).unwrap();
      dispatch(
        toastShown({ message: `Weight saved: ${formatWeight(weightKg, unit)}` })
      );
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

      <div className="grid grid-cols-[1fr_auto] gap-3">
        <TextField
          label="Weight"
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder={unit === "lb" ? "e.g. 154.3" : "e.g. 70.0"}
          value={weight}
          onChange={(event) => {
            setWeight(event.target.value);
            clear();
          }}
          error={errors.weight}
          data-autofocus
        />

        <SelectField
          label="Unit"
          options={UNIT_OPTIONS}
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
            clear();
          }}
          className="min-w-[150px]"
        />
      </div>

      <TextField
        label="Date"
        type="date"
        max={today}
        value={date}
        onChange={(event) => {
          setDate(event.target.value);
          clear();
        }}
        error={errors.date}
      />

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="green" className="flex-1" loading={isLoading}>
          Save weight
        </Button>
      </div>
    </form>
  );
}
