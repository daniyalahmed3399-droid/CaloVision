import Link from "next/link";
import { Dumbbell, Trash2 } from "lucide-react";

import { formatNumber } from "../../lib/tracking";

// Exercise logged for the day with the calories the backend says it burned.
// Pass onDelete to show delete buttons (the activity page does; the
// dashboard is read-only).
export default function ExerciseCard({ exercise, onDelete, showLogLink = true }) {
  const { items, caloriesBurned } = exercise;

  return (
    <section
      aria-labelledby="exercise-title"
      className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
            <Dumbbell size={20} />
          </div>

          <h3 id="exercise-title" className="text-base font-bold text-gray-900">
            Exercise
          </h3>
        </div>

        {items.length > 0 && (
          <p className="text-sm font-bold text-gray-900">
            {formatNumber(caloriesBurned)}
            <span className="ml-1 text-xs font-medium text-gray-400">kcal burned</span>
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No activity logged for this day.
          {showLogLink && (
            <>
              {" "}
              <Link
                href="/app/activity"
                className="font-semibold text-[#3c9705] hover:underline"
              >
                Log exercise
              </Link>
            </>
          )}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-gray-100">
          {items.map((log) => (
            <li key={log.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {log.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{log.minutes} min</p>
              </div>

              <p className="shrink-0 text-sm font-bold text-gray-900">
                {formatNumber(log.caloriesBurned)}
                <span className="ml-1 text-xs font-medium text-gray-400">kcal</span>
              </p>

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(log)}
                  aria-label={`Delete ${log.name}`}
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
