"use client";

import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";

import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import TextField from "../ui/TextField";
import {
  useGetExerciseCategoriesQuery,
  useSearchExercisesQuery,
} from "../../lib/store/endpoints/trackingApi";
import { useDebouncedValue } from "../../lib/useDebouncedValue";

// Browse or search the exercise catalogue and pick one to log. Category
// chips filter the list; the search box waits for a pause in typing.
export default function ExercisePicker({ onPick }) {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 300);

  const { data: categories = [] } = useGetExerciseCategoriesQuery();
  const { data: exercises, isFetching, isError, error, refetch } =
    useSearchExercisesQuery({ q: debounced, category });

  const waiting = query.trim() !== debounced;

  return (
    <section
      aria-labelledby="log-exercise-title"
      className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm"
    >
      <h3 id="log-exercise-title" className="text-base font-bold text-gray-900">
        Log exercise
      </h3>

      <TextField
        className="mt-4"
        label="Search exercises"
        type="search"
        autoComplete="off"
        placeholder="e.g. running, yoga"
        icon={<Search size={17} />}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div
        role="group"
        aria-label="Filter by category"
        className="mt-4 flex flex-wrap gap-2"
      >
        {["", ...categories].map((name) => (
          <button
            key={name || "all"}
            type="button"
            aria-pressed={category === name}
            onClick={() => setCategory(name)}
            className={`min-h-10 rounded-full px-4 py-2.5 text-xs font-bold transition-colors ${
              category === name
                ? "bg-[#4dbb08] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {name || "All"}
          </button>
        ))}
      </div>

      <div className="mt-4" aria-live="polite">
        {waiting || (isFetching && !exercises) ? (
          <div role="status" aria-label="Loading exercises" className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Couldn't load exercises"
            message={error?.message}
            onRetry={refetch}
            className="!py-8"
          />
        ) : exercises.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No exercises found"
            description="Try a different word or choose another category."
          />
        ) : (
          <ul
            aria-label="Exercises"
            className={`divide-y divide-gray-100 transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            {exercises.map((exercise) => (
              <li key={exercise.id}>
                <button
                  type="button"
                  onClick={() => onPick(exercise)}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-[#f6f9f1]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {exercise.name}
                    </p>
                    <p className="text-xs text-gray-500">{exercise.category}</p>
                  </div>

                  <ChevronRight size={18} className="shrink-0 text-gray-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
