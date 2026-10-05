"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Labelled input with an inline error. type="password" gets a show/hide
// toggle. Errors are linked with aria-describedby and never rely on colour
// alone.
export default function TextField({
  label,
  error,
  hint,
  icon,
  suffix,
  type = "text",
  className = "",
  ...props
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  const isPassword = type === "password";
  const messageId = `${id}-message`;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? messageId : undefined}
          className={`h-14 w-full rounded-xl border bg-gray-50 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-4 ${
            icon ? "pl-11" : "pl-4"
          } ${isPassword || suffix ? "pr-14" : "pr-4"} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-gray-200 focus:border-[#4dbb08] focus:ring-[#4dbb08]/10"
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-700"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {suffix && !isPassword && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
            {suffix}
          </span>
        )}
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={`mt-1.5 text-xs ${
            error ? "font-medium text-red-600" : "text-gray-500"
          }`}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
