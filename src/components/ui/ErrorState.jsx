import { AlertTriangle, RotateCw } from "lucide-react";

import Button from "./Button";

// A failed request is never shown as "no data": it gets its own state with a
// way to try again.
export default function ErrorState({
  title = "We couldn't load this",
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center rounded-[24px] border border-red-100 bg-white px-4 py-10 text-center sm:px-6 sm:py-12 ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle size={26} />
      </div>

      <h2 className="mt-5 text-lg font-bold text-gray-900">{title}</h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">{message}</p>

      {onRetry && (
        <Button variant="secondary" className="mt-6 !h-12" onClick={onRetry}>
          <RotateCw size={16} />
          Try again
        </Button>
      )}
    </div>
  );
}
