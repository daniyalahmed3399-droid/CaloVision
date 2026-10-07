"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, Footprints, Plus, Scale } from "lucide-react";

import DashboardSkeleton from "./DashboardSkeleton";
import DateNavigator from "./DateNavigator";
import DailyTips from "./DailyTips";
import DayOverview from "./DayOverview";
import ExerciseCard from "./ExerciseCard";
import LogStepsDialog from "./LogStepsDialog";
import LogWeightDialog from "./LogWeightDialog";
import MealLogSection from "./MealLogSection";
import MonthlyCharts from "./MonthlyCharts";
import StepsCard from "./StepsCard";
import TransformationGallery from "./TransformationGallery";
import WeightCard from "./WeightCard";
import ErrorState from "../ui/ErrorState";
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

  return (
    <div className="mx-auto w-full max-w-[2800px]">
      {/* The greeting and "Today" are shown in the top bar, so there is no
          page header here: the h1 is for screen readers only, and the date
          picker sits above the cards on narrow screens or at the top of the
          side column on wide ones, so the cards start at the very top. */}
      <h1 className="sr-only">{isToday ? "Today" : relativeLabel(date)}</h1>

      {/* The 30-day graphs run across the full width, above both the day's
          cards and the side column. They load on their own, so they show
          (or show their own loading and error states) whatever happens to
          the day's data. */}
      <MonthlyCharts />

      <div className="mb-5 xl:hidden">
        <DateNavigator />
      </div>

      {/* The day's cards on the left and the photo gallery as a vertical
          column on the right (from xl; below that it drops under the cards).
          The gallery column grows with the screen, and the cards use CSS
          container queries (@...) so they rearrange to the width they are
          actually given, whatever the screen size or browser zoom. */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_clamp(16rem,22vw,24rem)] xl:items-start">
      <div className="@container min-w-0">
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

          {/* Meals and the activity cards sit side by side once the main
              area is wide (@4xl); narrower, they stack with the activity
              cards in two columns. On very wide areas (@7xl) the meals form
              two columns and the activity cards two as well. */}
          <div className="grid gap-6 @4xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="grid content-start gap-4 @7xl:grid-cols-2 @7xl:items-start">
              <h2 className="sr-only @7xl:col-span-2">Meals</h2>

              {isNothingLogged(day) && (
                <div className="flex flex-col items-start gap-3 @7xl:col-span-2 rounded-[20px] border border-dashed border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
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
                className="block px-1 py-2.5 text-sm font-semibold text-[#3c9705] hover:underline @7xl:col-span-2"
              >
                View meal history →
              </Link>
            </div>

            <div className="grid content-start gap-4 @xl:grid-cols-2 @4xl:grid-cols-1 @7xl:grid-cols-2">
              <h2 className="sr-only">Activity and body</h2>

              <QuickActions
                className="@xl:col-span-2 @4xl:col-span-1 @7xl:col-span-2"
                onSteps={() => setStepsOpen(true)}
                onWeight={() => setWeightOpen(true)}
              />

              <StepsCard steps={day.steps} onEdit={() => setStepsOpen(true)} />

              <WeightCard
                weight={day.weight}
                unit={unit}
                onLog={() => setWeightOpen(true)}
              />

              <div className="@xl:col-span-2 @4xl:col-span-1 @7xl:col-span-2">
                <ExerciseCard exercise={day.exercise} />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Static content (photo gallery, then the daily tips): shown whether
          or not the day's data has loaded, so a failed request doesn't hide
          it. */}
      <div className="space-y-6">
        <div className="hidden xl:block">
          <DateNavigator />
        </div>

        <TransformationGallery />
        <DailyTips />
      </div>
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
