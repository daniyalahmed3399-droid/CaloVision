"use client";

import { useState } from "react";

import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";
import { toFormError } from "../../lib/api/errors";
import { formatLongDate } from "../../lib/dates";
import { useAppDispatch } from "../../lib/store/hooks";
import { useLogExerciseMutation } from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import {
  TRACKING_LIMITS,
  formatNumber,
  hasErrors,
  validateExerciseEntry,
} from "../../lib/tracking";

// Asks how long an exercise lasted. Calories burned come back from the
// backend and are never calculated here.
export default function LogExerciseDialog({ exercise, date, onClose }) {
  return (
    <Modal
      open={Boolean(exercise)}
      onClose={onClose}
      title={exercise?.name || "Log exercise"}
      description={`${exercise?.category || ""} · ${formatLongDate(date)}`}
    >
      {exercise && (
        <ExerciseForm exercise={exercise} date={date} onClose={onClose} />
      )}
    </Modal>
  );
}

function ExerciseForm({ exercise, date, onClose }) {
  const dispatch = useAppDispatch();
  const [logExercise, { isLoading }] = useLogExerciseMutation();

  const [minutes, setMinutes] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const found = validateExerciseEntry({
      exerciseId: exercise.id,
      minutes,
      date,
    });
    setErrors(found);
    setFormError("");

    if (hasErrors(found)) return;

    try {
      const log = await logExercise({
        date,
        exerciseId: exercise.id,
        minutes: Number(minutes),
      }).unwrap();

      dispatch(
        toastShown({
          message: `${exercise.name} logged: ${formatNumber(log.caloriesBurned)} kcal burned`,
        })
      );
      onClose();
    } catch (error) {
      const failure = toFormError(error);
      setErrors(failure.fieldErrors);
      setFormError(failure.message);
    }
  };

  const { min, max } = TRACKING_LIMITS.exerciseMinutes;

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <FormAlert>{formError}</FormAlert>

      <TextField
        label="Duration"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step="1"
        suffix="min"
        placeholder="e.g. 30"
        value={minutes}
        onChange={(event) => {
          setMinutes(event.target.value);
          setErrors({});
        }}
        error={errors.minutes || errors.date}
        data-autofocus
      />

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="green" className="flex-1" loading={isLoading}>
          Save exercise
        </Button>
      </div>
    </form>
  );
}
