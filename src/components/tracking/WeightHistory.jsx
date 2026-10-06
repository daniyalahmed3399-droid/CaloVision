"use client";

import ErrorState from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import { formatLongDate } from "../../lib/dates";
import { useGetWeightHistoryQuery } from "../../lib/store/endpoints/trackingApi";
import { formatWeight } from "../../lib/tracking";

// The most recent weight entries, newest first.
export default function WeightHistory({ unit }) {
  const { data: entries, isLoading, isError, error, refetch } =
    useGetWeightHistoryQuery({ limit: 7 });

  return (
    <section
      aria-labelledby="weight-history-title"
      className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
    >
      <h3 id="weight-history-title" className="text-base font-bold text-gray-900">
        Recent weights
      </h3>

      <div className="mt-3">
        {isLoading ? (
          <div role="status" aria-label="Loading weight history" className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-9 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load weights"
            message={error?.message}
            onRetry={refetch}
            className="!py-8"
          />
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">
            Your weight entries will appear here.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {entries.map((entry) => (
              <li
                key={entry.date}
                className="flex items-center justify-between py-2.5 text-sm"
              >
                <span className="text-gray-600">{formatLongDate(entry.date)}</span>
                <span className="font-bold text-gray-900">
                  {formatWeight(entry.kg, unit)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
