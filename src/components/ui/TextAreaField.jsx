"use client";

import { useId } from "react";

// Labelled multi-line input with an inline error and optional character
// count; follows TextField's pattern (label via htmlFor, error via
// aria-describedby).
export default function TextAreaField({
  label,
  error,
  hint,
  maxLength,
  value = "",
  rows = 4,
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

      <textarea
        id={id}
        rows={rows}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        className={`w-full resize-y rounded-xl border bg-gray-50 px-4 py-4 text-sm leading-6 text-gray-800 outline-none transition focus:bg-white focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#4dbb08] focus:ring-[#4dbb08]/10"
        }`}
        {...props}
      />

      <div className="mt-1.5 flex items-start justify-between gap-3">
        {error || hint ? (
          <p
            id={messageId}
            className={`text-xs ${
              error ? "font-medium text-red-600" : "text-gray-500"
            }`}
          >
            {error || hint}
          </p>
        ) : (
          <span />
        )}

        {maxLength && (
          <p
            className={`shrink-0 text-xs ${
              value.length > maxLength ? "font-medium text-red-600" : "text-gray-400"
            }`}
          >
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
