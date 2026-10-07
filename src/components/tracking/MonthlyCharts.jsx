"use client";

import { motion } from "motion/react";
import { Flame, Footprints, Scale } from "lucide-react";

import LineChart from "../ui/LineChart";
import { Skeleton } from "../ui/Skeleton";
import { formatShortDate } from "../../lib/dates";
import { useGetMonthlyStatsQuery } from "../../lib/store/endpoints/trackingApi";
import { useAuth } from "../../lib/store/useAuth";
import { useSelectedDate } from "../../lib/store/useSelectedDate";
import { formatNumber, kgToUnit, weightUnitFor } from "../../lib/tracking";

const GREEN = "#4dbb08";
const ORANGE = "#f97316";
const BLUE = "#0ea5e9";
const VIOLET = "#8b5cf6";
const DAYS = 30;
// Compact charts: three fit across the full dashboard width.
const CHART_HEIGHT = 128;

const thousands = (value) =>
  value >= 1000 ? `${Math.round(value / 100) / 10}k` : String(value);

// Three graphs for the last 30 days (ending on the date being viewed): food
// intake, steps + exercise, and weight. All numbers (the daily series, the
// averages, the target and goal lines) come from the backend; this only draws
// them. Logging anything on a day in the window refreshes the graphs.
export default function MonthlyCharts() {
  const { user } = useAuth();
  const { date } = useSelectedDate();
  const unit = weightUnitFor(user);

  // currentData (not data): when the date changes, `data` would keep drawing
  // the previous month under the new date while loading.
  const { currentData, isFetching, isError, error, refetch } =
    useGetMonthlyStatsQuery({ date, days: DAYS });

  const loading = isFetching && !currentData;
  const failed = isError && !currentData;

  const days = currentData?.days || [];
  const labels = days.map((day) => day.date);
  const summary = currentData?.summary;
  const targets = currentData?.targets;

  const hasFood = days.some((day) => day.calories !== null);
  const hasActivity = days.some(
    (day) => day.steps !== null || day.exerciseCalories > 0
  );
  const hasWeight = days.some((day) => day.weightKg !== null);

  const weightChange = summary?.weightChangeKg;
  const weightChangeText =
    Number.isFinite(weightChange) && weightChange !== 0
      ? `${weightChange > 0 ? "+" : "−"}${Math.abs(kgToUnit(weightChange, unit))} ${unit}`
      : null;

  const cardProps = { loading, failed, error, onRetry: refetch, fetching: isFetching && !loading };

  return (
    <section aria-labelledby="monthly-title" className="@container mb-5">
      <h2 id="monthly-title" className="sr-only">
        Last 30 days
      </h2>

      {currentData?.sample && (
        <p
          role="status"
          className="mb-3 rounded-xl bg-amber-50 px-4 py-2 text-xs leading-5 text-amber-900"
        >
          <span className="font-semibold">Sample data:</span> you haven&apos;t
          logged anything in the last 30 days yet, so these graphs show an
          example month. They switch to your own numbers as you log.
        </p>
      )}

      <div className="grid gap-3 @xl:grid-cols-2 @3xl:grid-cols-3">
        <ChartCard
          index={0}
          icon={Flame}
          tone="bg-[#eaf5df] text-[#4dbb08]"
          title="Food intake"
          subtitle={
            summary?.avgCalories != null
              ? `Avg ${formatNumber(summary.avgCalories)} kcal on ${summary.daysLogged} logged days`
              : "Calories eaten per day"
          }
          legend={[
            { label: "Calories eaten", color: GREEN },
            ...(targets?.calories ? [{ label: "Target", dashed: true }] : []),
          ]}
          empty={!loading && !failed && !hasFood}
          emptyText="No meals logged in the last 30 days. Log food to see your intake here."
          {...cardProps}
        >
          <LineChart
            labels={labels}
            height={CHART_HEIGHT}
            tickCount={3}
            formatLabel={formatShortDate}
            ariaLabel={`Calories eaten per day over the last 30 days${
              summary?.avgCalories != null ? `, averaging ${formatNumber(summary.avgCalories)} kilocalories` : ""
            }`}
            axes={{ left: { zero: true, format: thousands } }}
            refLines={
              targets?.calories
                ? [{ value: targets.calories, label: "Target" }]
                : []
            }
            series={[
              {
                key: "calories",
                label: "Eaten",
                color: GREEN,
                area: true,
                // Days nothing was logged are skipped, not drawn as zero.
                connectGaps: true,
                values: days.map((day) => day.calories),
                format: (value) => `${formatNumber(value)} kcal`,
              },
            ]}
          />
        </ChartCard>

        <ChartCard
          index={1}
          icon={Footprints}
          tone="bg-sky-50 text-sky-600"
          title="Steps & exercise"
          subtitle={
            summary?.avgSteps != null || summary?.totalExerciseCalories > 0
              ? [
                  summary.avgSteps != null
                    ? `Avg ${formatNumber(summary.avgSteps)} steps`
                    : null,
                  summary.totalExerciseCalories > 0
                    ? `${formatNumber(summary.totalExerciseCalories)} kcal burned`
                    : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "Daily steps and calories burned"
          }
          legend={[
            { label: "Steps", color: BLUE },
            { label: "Calories burned", color: ORANGE },
          ]}
          empty={!loading && !failed && !hasActivity}
          emptyText="No steps or exercise logged in the last 30 days."
          {...cardProps}
        >
          <LineChart
            labels={labels}
            height={CHART_HEIGHT}
            tickCount={3}
            formatLabel={formatShortDate}
            ariaLabel={`Daily steps and calories burned over the last 30 days${
              summary?.avgSteps != null ? `, averaging ${formatNumber(summary.avgSteps)} steps` : ""
            }`}
            axes={{
              left: { zero: true, format: thousands },
              right: { zero: true, format: String },
            }}
            refLines={
              targets?.steps ? [{ value: targets.steps, label: "Goal" }] : []
            }
            series={[
              {
                key: "steps",
                label: "Steps",
                color: BLUE,
                axis: "left",
                connectGaps: true,
                values: days.map((day) => day.steps),
                format: (value) => formatNumber(value),
              },
              {
                key: "burned",
                label: "Burned",
                color: ORANGE,
                axis: "right",
                values: days.map((day) => day.exerciseCalories),
                format: (value) => `${formatNumber(value)} kcal`,
              },
            ]}
          />
        </ChartCard>

        <ChartCard
          index={2}
          className="@xl:col-span-2 @3xl:col-span-1"
          icon={Scale}
          tone="bg-violet-50 text-violet-600"
          title="Weight"
          subtitle={
            summary?.latestWeightKg != null
              ? `${kgToUnit(summary.latestWeightKg, unit)} ${unit}${weightChangeText ? ` · ${weightChangeText} this month` : ""}`
              : "Your weigh-ins"
          }
          legend={[{ label: `Weight (${unit})`, color: VIOLET }]}
          empty={!loading && !failed && !hasWeight}
          emptyText="No weight logged in the last 30 days. Log your weight to see your trend."
          {...cardProps}
        >
          <LineChart
            labels={labels}
            height={CHART_HEIGHT}
            tickCount={3}
            formatLabel={formatShortDate}
            ariaLabel={`Weight over the last 30 days in ${unit === "lb" ? "pounds" : "kilograms"}${
              summary?.latestWeightKg != null ? `, latest ${kgToUnit(summary.latestWeightKg, unit)}` : ""
            }`}
            axes={{ left: { format: String } }}
            series={[
              {
                key: "weight",
                label: "Weight",
                color: VIOLET,
                area: true,
                dots: true,
                connectGaps: true,
                values: days.map((day) => kgToUnit(day.weightKg, unit)),
                format: (value) => `${value} ${unit}`,
              },
            ]}
          />
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({
  index,
  className = "",
  icon: Icon,
  tone,
  title,
  subtitle,
  legend,
  loading,
  failed,
  error,
  fetching,
  onRetry,
  empty,
  emptyText,
  children,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className={`min-w-0 rounded-[20px] border border-gray-100 bg-white p-3.5 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}
        >
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs leading-4 text-gray-500">{subtitle}</p>
        </div>
      </div>

      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            {item.dashed ? (
              <span className="h-0 w-3 border-t border-dashed border-gray-400" />
            ) : (
              <span
                className="h-[3px] w-3 rounded-full"
                style={{ background: item.color }}
              />
            )}
            {item.label}
          </li>
        ))}
      </ul>

      <div
        aria-busy={fetching}
        className={`mt-1.5 transition-opacity ${fetching ? "opacity-60" : ""}`}
      >
        {loading ? (
          <div role="status" aria-label="Loading graph">
            <Skeleton className="h-[128px] w-full rounded-2xl" />
          </div>
        ) : failed ? (
          <div className="flex h-[128px] flex-col items-center justify-center gap-3 rounded-2xl bg-gray-50 px-4 text-center">
            <p className="text-sm text-gray-500">
              {error?.message || "We couldn't load this graph."}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="min-h-10 rounded-xl bg-[#eaf7df] px-4 text-xs font-bold text-[#3c9705] transition-colors hover:bg-[#dff1cf]"
            >
              Retry
            </button>
          </div>
        ) : empty ? (
          <div className="flex h-[128px] items-center justify-center rounded-2xl border border-dashed border-gray-200 px-4 text-center text-xs leading-5 text-gray-500">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
}
