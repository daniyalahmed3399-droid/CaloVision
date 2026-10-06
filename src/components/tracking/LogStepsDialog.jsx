"use client";

import { useState } from "react";

import Button from "../ui/Button";
import FormAlert from "../ui/FormAlert";
import Modal from "../ui/Modal";
import TextField from "../ui/TextField";
import { toFormError } from "../../lib/api/errors";
import { formatLongDate } from "../../lib/dates";
import { useAppDispatch } from "../../lib/store/hooks";
import { useSetStepsMutation } from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import { formatNumber, hasErrors, validateSteps } from "../../lib/tracking";

// Manual step entry (phone health-app sync isn't possible in a browser).
export default function LogStepsDialog({ open, onClose, date, current }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Steps"
      description={formatLongDate(date)}
    >
      <StepsForm date={date} current={current} onClose={onClose} />
    </Modal>
  );
}

// Mounted only while the dialog is open, so its fields start fresh each time.
function StepsForm({ date, current, onClose }) {
  const dispatch = useAppDispatch();
  const [setSteps, { isLoading }] = useSetStepsMutation();

  const [steps, setStepsValue] = useState(current ?? "");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    const found = validateSteps({ steps, date });
    setErrors(found);
    setFormError("");

    if (hasErrors(found)) return;

    try {
      await setSteps({ date, steps: Number(steps) }).unwrap();
      dispatch(
        toastShown({ message: `Steps saved: ${formatNumber(Number(steps))}` })
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

      <TextField
        label="Steps taken"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="e.g. 8500"
        value={steps}
        onChange={(event) => {
          setStepsValue(event.target.value);
          setErrors({});
        }}
        error={errors.steps || errors.date}
        data-autofocus
      />

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="green" className="flex-1" loading={isLoading}>
          Save steps
        </Button>
      </div>
    </form>
  );
}
