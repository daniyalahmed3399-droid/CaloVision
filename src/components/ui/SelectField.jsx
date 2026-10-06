"use client";

import { useId } from "react";

// Labelled <select> with an inline error, matching TextField's pattern
// (label linked with htmlFor, error linked with aria-describedby).
export default function SelectField({
  label,
  error,
  options,
  className = "",
  ...props
}) {
  const id = useId();
  const messageId = `${id}-message`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <select
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? messageId : undefined}
        className={`h-14 w-full rounded-xl border bg-gray-50 px-4 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#4dbb08] focus:ring-[#4dbb08]/10"
        }`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p id={messageId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
