"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Utensils } from "lucide-react";

import DateNavigator from "./DateNavigator";
import DayOverview from "./DayOverview";
import EditFoodDialog from "./EditFoodDialog";
import MealLogSection from "./MealLogSection";
import ConfirmDialog from "../ui/ConfirmDialog";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";
import { PageSkeleton } from "../ui/Skeleton";
import { toFormError } from "../../lib/api/errors";
import { formatLongDate } from "../../lib/dates";
import { useAppDispatch } from "../../lib/store/hooks";
import {
  useDeleteFoodLogMutation,
  useGetDayQuery,
} from "../../lib/store/endpoints/trackingApi";
import { toastShown } from "../../lib/store/slices/uiSlice";
import { useSelectedDate } from "../../lib/store/useSelectedDate";
import { MEAL_LABELS, MEAL_ORDER } from "../../lib/tracking";

// Everything eaten on the selected date, grouped by meal, with edit and
// delete. Move between dates with the navigator to browse history.
export default function FoodHistory() {
  const dispatch = useAppDispatch();
  const { date } = useSelectedDate();

  // currentData: never show another date's meals under this date's heading.
  const { currentData: day, isFetching, isError, error, refetch } =
    useGetDayQuery({ date });
  const isLoading = isFetching && !day;
  const [deleteFoodLog, { isLoading: deleting }] = useDeleteFoodLogMutation();

  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const confirmDelete = async () => {
    const log = toDelete;

    try {
      await deleteFoodLog({ id: log.id, date: log.date }).unwrap();
      dispatch(toastShown({ message: `${log.name} deleted` }));
    } catch (failure) {
      dispatch(
        toastShown({ type: "error", message: toFormError(failure).message })
      );
      // The entry may already be gone (e.g. deleted in another tab).
      refetch();
    } finally {
      setToDelete(null);
    }
  };

  const hasFood =
    day && MEAL_ORDER.some((meal) => day.meals[meal].items.length > 0);

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        eyebrow="Food"
        title="Meals & food history"
        description={`What you logged on ${formatLongDate(date)}.`}
        action={<DateNavigator />}
      />

      {isLoading ? (
        <PageSkeleton />
      ) : isError && !day ? (
        <ErrorState
          title="We couldn't load your meals"
          message={error?.message}
          onRetry={refetch}
        />
      ) : (
        <div
          aria-busy={isFetching}
          className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}
        >
          {hasFood ? (
            <>
              <DayOverview day={day} />

              <div className="space-y-4">
                <h2 className="sr-only">Meals</h2>

                {MEAL_ORDER.map((meal) => (
                  <MealLogSection
                    key={meal}
                    meal={meal}
                    label={MEAL_LABELS[meal]}
                    data={day.meals[meal]}
                    onEdit={setEditing}
                    onDelete={setToDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={Utensils}
              title="No food logged for this day"
              description="Add what you ate and it will show up here and on your dashboard."
              action={
                <Link
                  href="/app/food/add"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#4dbb08] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3c9705]"
                >
                  <Plus size={16} />
                  Add food
                </Link>
              }
            />
          )}
        </div>
      )}

      <EditFoodDialog log={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this entry?"
        message={
          toDelete
            ? `${toDelete.name} will be removed from ${MEAL_LABELS[toDelete.mealType]} and your daily totals will update.`
            : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
