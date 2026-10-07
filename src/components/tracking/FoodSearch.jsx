"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

import FoodDetailDialog from "./FoodDetailDialog";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import PageHeader from "../ui/PageHeader";
import SelectField from "../ui/SelectField";
import { Skeleton } from "../ui/Skeleton";
import TextField from "../ui/TextField";
import { useSearchFoodsQuery } from "../../lib/store/endpoints/trackingApi";
import { useSelectedDate } from "../../lib/store/useSelectedDate";
import { useDebouncedValue } from "../../lib/useDebouncedValue";
import {
  MEAL_OPTIONS,
  MEAL_ORDER,
  defaultMealForNow,
  formatNumber,
} from "../../lib/tracking";

// Manual food logging: search -> pick a food -> choose quantity and meal ->
// save. Searching waits for a pause in typing so the API isn't hit on every
// key press.
export default function FoodSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const { date } = useSelectedDate();

  const requestedMeal = params.get("meal");
  const [mealType, setMealType] = useState(
    MEAL_ORDER.includes(requestedMeal) ? requestedMeal : defaultMealForNow()
  );

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const debounced = useDebouncedValue(query.trim(), 300);
  const searching = debounced.length > 0;

  const { data: foods, isFetching, isError, error, refetch } =
    useSearchFoodsQuery({ q: debounced }, { skip: !searching });

  // The box has changed but the debounce hasn't caught up yet.
  const waiting = query.trim() !== debounced;

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <Link
        href="/app/food/add"
        className="mb-2 inline-flex items-center gap-2 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        All ways to add food
      </Link>

      <PageHeader
        eyebrow="Food"
        title="Search food"
        description="Search by name or type, then choose how much you had."
      />

      <div className="grid gap-4 sm:max-w-[760px] sm:grid-cols-[1fr_200px]">
        <TextField
          label="Food"
          type="search"
          autoComplete="off"
          placeholder="e.g. chicken, rice, banana"
          icon={<Search size={17} />}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          data-autofocus
        />

        <SelectField
          label="Add to"
          options={MEAL_OPTIONS}
          value={mealType}
          onChange={(event) => setMealType(event.target.value)}
        />
      </div>

      <div className="mt-6" aria-live="polite">
        {!searching && !waiting ? (
          <EmptyState
            icon={Search}
            title="Search for a food"
            description="Start typing above. Results appear as you pause."
          />
        ) : waiting || (isFetching && !foods) ? (
          <ResultsSkeleton />
        ) : isError ? (
          <ErrorState
            title="Search failed"
            message={error?.message}
            onRetry={refetch}
          />
        ) : foods.length === 0 ? (
          <EmptyState
            icon={Search}
            title={`No results for “${debounced}”`}
            description="Check the spelling or try a more general word, like “chicken”."
          />
        ) : (
          <ul
            aria-label="Search results"
            className={`grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,24rem),1fr))] transition-opacity ${isFetching ? "opacity-60" : ""}`}
          >
            {foods.map((food) => (
              <li key={food.id}>
                <button
                  type="button"
                  onClick={() => setSelected(food)}
                  className="flex w-full items-center gap-4 rounded-[20px] border border-gray-100 bg-white p-4 text-left shadow-sm transition-all hover:border-[#4dbb08]/40 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {food.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {food.category} · per {food.reference.amount}{" "}
                      {food.reference.unit}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      P {formatNumber(food.reference.protein, 1)}g · C{" "}
                      {formatNumber(food.reference.carbs, 1)}g · F{" "}
                      {formatNumber(food.reference.fat, 1)}g
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-bold text-gray-900">
                    {formatNumber(food.reference.calories)}
                    <span className="ml-1 text-xs font-medium text-gray-400">
                      kcal
                    </span>
                  </p>

                  <ChevronRight size={18} className="shrink-0 text-gray-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FoodDetailDialog
        food={selected}
        mealType={mealType}
        date={date}
        onClose={() => setSelected(null)}
        onLogged={() => router.push("/app/food")}
      />
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div role="status" aria-label="Searching" className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex items-center gap-4 rounded-[20px] border border-gray-100 bg-white p-4"
        >
          <div className="flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-3 h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}
