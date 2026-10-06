"use client";

import { useCallback } from "react";

import { addDays, isFuture, todayString } from "../dates";
import { useAppDispatch, useAppSelector } from "./hooks";
import { dateSelected } from "./slices/trackingSlice";

// The day the tracking screens are showing (shared across dashboard, meal
// history and activity). Defaults to today and never goes into the future.
export function useSelectedDate() {
  const dispatch = useAppDispatch();
  const stored = useAppSelector((state) => state.tracking.selectedDate);
  const today = todayString();
  const date = stored ?? today;

  const setDate = useCallback(
    (next) => {
      // Picking today goes back to "follow today".
      dispatch(dateSelected(next === todayString() ? null : next));
    },
    [dispatch]
  );

  const shift = useCallback(
    (days) => {
      const next = addDays(date, days);
      if (!isFuture(next)) setDate(next);
    },
    [date, setDate]
  );

  return { date, today, isToday: date === today, setDate, shift };
}
