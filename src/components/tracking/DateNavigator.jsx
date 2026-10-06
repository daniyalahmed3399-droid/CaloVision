"use client";

import { useId } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { formatShortDate, isDateString, isFuture, relativeLabel } from "../../lib/dates";
import { useSelectedDate } from "../../lib/store/useSelectedDate";

// Previous day / selected date / next day, plus a calendar picker. Shared by
// the dashboard, meal history and activity pages (the date lives in the
// store). Future dates are not selectable.
export default function DateNavigator() {
  const { date, today, isToday, shift, setDate } = useSelectedDate();
  const pickerId = useId();

  return (
    <div
      role="group"
      aria-label="Choose date"
      className="flex items-center gap-1.5 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm"
    >
      <button
        type="button"
        onClick={() => shift(-1)}
        aria-label="Previous day"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="min-w-[132px] px-1 text-center" aria-live="polite">
        <p className="text-sm font-bold text-gray-900">{relativeLabel(date)}</p>
        <p className="text-[11px] font-medium text-gray-400">
          {formatShortDate(date)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => shift(1)}
        disabled={isToday}
        aria-label="Next day"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <ChevronRight size={20} />
      </button>

      <div className="relative">
        <label htmlFor={pickerId} className="sr-only">
          Pick a date
        </label>

        <input
          id={pickerId}
          type="date"
          value={date}
          max={today}
          onChange={(event) => {
            const value = event.target.value;
            if (isDateString(value) && !isFuture(value)) setDate(value);
          }}
          className="peer absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
        />

        <span className="pointer-events-none flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 peer-hover:bg-gray-100 peer-focus-visible:ring-4 peer-focus-visible:ring-[#4dbb08]/30">
          <CalendarDays size={19} />
        </span>
      </div>

      {!isToday && (
        <button
          type="button"
          onClick={() => setDate(today)}
          className="mr-1 rounded-xl bg-[#eaf7df] px-3 py-2 text-xs font-bold text-[#3c9705] transition-colors hover:bg-[#dff1cf]"
        >
          Today
        </button>
      )}
    </div>
  );
}
