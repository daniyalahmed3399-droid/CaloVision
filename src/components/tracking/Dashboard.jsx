"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Footprints, Plus, Scale } from "lucide-react";

import DashboardSkeleton from "./DashboardSkeleton";
import DateNavigator from "./DateNavigator";
import DayOverview from "./DayOverview";
import ExerciseCard from "./ExerciseCard";
import LogStepsDialog from "./LogStepsDialog";
import LogWeightDialog from "./LogWeightDialog";
import MealLogSection from "./MealLogSection";
import StepsCard from "./StepsCard";
import TransformationGallery from "./TransformationGallery";
import WeightCard from "./WeightCard";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";
import { relativeLabel } from "../../lib/dates";
import { useGetDayQuery } from "../../lib/store/endpoints/trackingApi";
import { useAuth } from "../../lib/store/useAuth";
import { useSelectedDate } from "../../lib/store/useSelectedDate";
import { MEAL_LABELS, MEAL_ORDER, weightUnitFor } from "../../lib/tracking";

// "How am I doing today?" Everything shown is data from the backend; any
// food, exercise, steps or weight saved anywhere in the app invalidates the
// day's cache entry, so this page refreshes itself.
export default function Dashboard() {
  const { user } = useAuth();
  const { date, today, isToday } = useSelectedDate();
  const unit = weightUnitFor(user);

  // currentData (not data): when the date changes, `data` would keep showing
  // the previous day under the new date's heading while loading.
  const { currentData: day, isFetching, isError, error, refetch } =
    useGetDayQuery({ date });
  const isLoading = isFetching && !day;

  const [stepsOpen, setStepsOpen] = useState(false);
  const [weightOpen, setWeightOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        eyebrow={firstName ? `Hi, ${firstName}` : "Welcome back"}
        title={isToday ? "Today" : relativeLabel(date)}
        description="Your calories, macros, meals and activity for the day."
        action={<DateNavigator />}
      />

      {/* Extra-large screens: the day's cards on the left and the photo
          gallery as a vertical column on the right. Below that there is no
          room for a side column, so the gallery drops under the cards. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start">
      <div className="min-w-0">
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError && !day ? (
        <ErrorState
          title="We couldn't load your day"
          message={error?.message}
          onRetry={refetch}
        />
      ) : (
        <div
          aria-busy={isFetching}
          className={`space-y-6 transition-opacity ${isFetching ? "opacity-60" : ""}`}
        >
          {isError && (
            <ErrorState
              title="Couldn't refresh"
              message={`${error?.message || "Something went wrong."} Showing the last data we have.`}
              onRetry={refetch}
              className="!py-6"
            />
          )}

          <DayOverview day={day} />

          {/* Meals and the activity cards sit side by side only when the
              main area is wide (2xl); otherwise they stack, with the activity
              cards in a two-column grid. */}
          <div className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-4">
              <h2 className="sr-only">Meals</h2>

              {isNothingLogged(day) && (
                <div className="flex flex-col items-start gap-3 rounded-[20px] border border-dashed border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-600">
                    Nothing logged for this day yet. Start with your first meal.
                  </p>

                  <Link
                    href="/app/food/add"
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-[#4dbb08] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#3c9705]"
                  >
                    <Plus size={16} />
                    Add food
                  </Link>
                </div>
              )}

              {MEAL_ORDER.map((meal) => (
                <MealLogSection
                  key={meal}
                  meal={meal}
                  label={MEAL_LABELS[meal]}
                  data={day.meals[meal]}
                />
              ))}

              <Link
                href="/app/food"
                className="block px-1 py-2.5 text-sm font-semibold text-[#3c9705] hover:underline"
              >
                View meal history →
              </Link>
            </div>

            <div className="grid content-start gap-4 sm:grid-cols-2 2xl:grid-cols-1">
              <h2 className="sr-only">Activity and body</h2>

              <QuickActions
                className="sm:col-span-2 2xl:col-span-1"
                onSteps={() => setStepsOpen(true)}
                onWeight={() => setWeightOpen(true)}
              />

              <StepsCard steps={day.steps} onEdit={() => setStepsOpen(true)} />

              <WeightCard
                weight={day.weight}
                unit={unit}
                onLog={() => setWeightOpen(true)}
              />

              <div className="sm:col-span-2 2xl:col-span-1">
                <ExerciseCard exercise={day.exercise} />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Static inspiration content: shown whether or not the day's data has
          loaded, so a failed request doesn't hide it. */}
      <TransformationGallery />
      </div>

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
    </div>
  );
}

// No food, no exercise and no steps for the day.
function isNothingLogged(day) {
  return (
    MEAL_ORDER.every((meal) => day.meals[meal].items.length === 0) &&
    day.exercise.items.length === 0 &&
    (day.steps.count === null || day.steps.count === undefined)
  );
}

function QuickActions({ onSteps, onWeight, className = "" }) {
  const base =
    "flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-center text-xs font-bold text-gray-700 shadow-sm transition-colors hover:border-[#4dbb08]/40 hover:bg-[#f6f9f1]";

  return (
    <nav aria-label="Quick actions" className={`grid grid-cols-4 gap-3 ${className}`}>
      <Link href="/app/food/add" className={base}>
        <Plus size={20} className="text-[#4dbb08]" />
        Food
      </Link>

      <Link href="/app/activity" className={base}>
        <Dumbbell size={20} className="text-orange-500" />
        Exercise
      </Link>

      <button type="button" onClick={onSteps} className={base}>
        <Footprints size={20} className="text-sky-600" />
        Steps
      </button>

      <button type="button" onClick={onWeight} className={base}>
        <Scale size={20} className="text-violet-600" />
        Weight
      </button>
    </nav>
  );
}
