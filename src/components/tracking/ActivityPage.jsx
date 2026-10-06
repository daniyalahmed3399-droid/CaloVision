"use client";

import { useState } from "react";

import DateNavigator from "./DateNavigator";
import ExerciseCard from "./ExerciseCard";
import ExercisePicker from "./ExercisePicker";
import LogExerciseDialog from "./LogExerciseDialog";
import LogStepsDialog from "./LogStepsDialog";
import LogWeightDialog from "./LogWeightDialog";
import StepsCard from "./StepsCard";
import WeightCard from "./WeightCard";
import WeightHistory from "./WeightHistory";
import ConfirmDialog from "../ui/ConfirmDialog";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";
import { PageSkeleton } from "../ui/Skeleton";
import { toFormError } from "../../lib/api/errors";
import { formatLongDate } from "../../lib/dates";
import { useAppDispatch } from "../../lib/store/hooks";
import {
  useDeleteExerciseLogMutation,
  useGetDayQuery,
} from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import { useAuth } from "../../lib/store/useAuth";
import { useSelectedDate } from "../../lib/store/useSelectedDate";
import { weightUnitFor } from "../../lib/tracking";

// Exercise, steps and weight for the selected day. Saving any of them
// refreshes the dashboard as well (same cached day).
export default function ActivityPage() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { date, today } = useSelectedDate();
  const unit = weightUnitFor(user);

  // currentData: never show another date's activity under this date's heading.
  const { currentData: day, isFetching, isError, error, refetch } =
    useGetDayQuery({ date });
  const isLoading = isFetching && !day;
  const [deleteExerciseLog, { isLoading: removing }] =
    useDeleteExerciseLogMutation();

  const [exercise, setExercise] = useState(null); // exercise being logged
  const [stepsOpen, setStepsOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    const log = toDelete;

    try {
      await deleteExerciseLog({ id: log.id, date: log.date }).unwrap();
      dispatch(toastShown({ message: `${log.name} deleted` }));
    } catch (failure) {
      dispatch(
        toastShown({ type: "error", message: toFormError(failure).message })
      );
      refetch();
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        eyebrow="Activity"
        title="Exercise, steps & weight"
        description={`Your movement and body measurements for ${formatLongDate(date)}.`}
        action={<DateNavigator />}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : isError && !day ? (
        <ErrorState
          title="We couldn't load your activity"
          message={error?.message}
          onRetry={refetch}
        />
      ) : (
        <div
          aria-busy={isFetching}
          className={`grid gap-6 lg:grid-cols-[1.15fr_0.85fr] transition-opacity ${isFetching ? "opacity-60" : ""}`}
        >
          <h2 className="sr-only">Exercise, steps and weight</h2>
          <div className="space-y-4">
            <ExerciseCard
              exercise={day.exercise}
              showLogLink={false}
              onDelete={setToDelete}
            />

            <ExercisePicker onPick={setExercise} />
          </div>

          <div className="space-y-4">
            <StepsCard steps={day.steps} onEdit={() => setStepsOpen(true)} />

            <WeightCard
              weight={day.weight}
              unit={unit}
              onLog={() => setWeightOpen(true)}
            />

            <WeightHistory unit={unit} />
          </div>
        </div>
      )}

      <LogExerciseDialog
        exercise={exercise}
        date={date}
        onClose={() => setExercise(null)}
      />

      <LogStepsDialog
        open={stepsOpen}
        onClose={() => setStepsOpen(false)}
        date={date}
        current={day?.steps?.count ?? undefined}
      />

      <LogWeightDialog
        open={weightOpen}
        onClose={() => setWeightOpen(false)}
        date={date}
        today={today}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this exercise?"
        message={
          toDelete
            ? `${toDelete.name} (${toDelete.minutes} min) will be removed and your calories burned will update.`
            : ""
        }
        loading={removing}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
