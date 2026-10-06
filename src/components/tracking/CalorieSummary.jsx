import { Flame } from "lucide-react";

import ProgressBar from "../ui/ProgressBar";
import { formatNumber } from "../../lib/tracking";

// Calories for the day. Every number is what the backend returned: the
// target, what was eaten, what exercise burned, and what's left.
export default function CalorieSummary({ day }) {
  const target = day.targets?.calories;
  const eaten = day.totals.calories;
  const burned = day.exercise.caloriesBurned;
  const remaining = day.remainingCalories;
  const over = Number.isFinite(remaining) && remaining < 0;

  return (
    <section
      aria-labelledby="calorie-summary-title"
      className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
          <Flame size={22} />
        </div>

        <h2
          id="calorie-summary-title"
          className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]"
        >
          Calories
        </h2>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="text-5xl font-extrabold tracking-tight text-gray-900">
          {formatNumber(eaten)}
        </span>

        <span className="pb-2 text-sm font-medium text-gray-500">
          {Number.isFinite(target)
            ? `of ${formatNumber(target)} kcal target`
            : "kcal eaten"}
        </span>
      </div>

      {Number.isFinite(target) ? (
        <ProgressBar
          value={eaten}
          max={target}
          label="Calories eaten compared with target"
          className="mt-5 !h-3"
        />
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Your daily target isn&apos;t available yet.
        </p>
      )}

      <dl className="mt-6 grid grid-cols-3 gap-3">
        <Stat label="Target" value={Number.isFinite(target) ? formatNumber(target) : "—"} />
        <Stat label="Burned" value={formatNumber(burned)} hint="exercise" />
        <Stat
          label={over ? "Over by" : "Remaining"}
          value={Number.isFinite(remaining) ? formatNumber(Math.abs(remaining)) : "—"}
          warn={over}
        />
      </dl>

      <p className="mt-4 text-[11px] leading-5 text-gray-400">
        Remaining = target − food eaten + exercise burned.
      </p>
    </section>
  );
}

function Stat({ label, value, hint, warn = false }) {
  return (
    <div
      className={`rounded-2xl p-4 ${warn ? "bg-amber-50" : "bg-[#f6f9f1]"}`}
    >
      <dt className="text-xs font-medium text-gray-500">{label}</dt>

      <dd
        className={`mt-1 text-xl font-bold ${warn ? "text-amber-700" : "text-gray-900"}`}
      >
        {value}
        <span className="ml-1 text-xs font-medium text-gray-400">
          {hint || "kcal"}
        </span>
      </dd>
    </div>
  );
}
