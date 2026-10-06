"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import { toastDismissed } from "../../lib/store/slices/uiSlice";

const AUTO_DISMISS_MS = 4500;

function Toast({ toast }) {
  const dispatch = useAppDispatch();
  const isError = toast.type === "error";
  const Icon = isError ? Info : CheckCircle2;

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch(toastDismissed(toast.id)),
      AUTO_DISMISS_MS
    );

    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white p-4 text-sm shadow-lg ${
        isError ? "border-red-200 text-red-700" : "border-green-200 text-gray-800"
      }`}
    >
      <Icon
        size={18}
        className={`mt-0.5 shrink-0 ${isError ? "text-red-500" : "text-[#4dbb08]"}`}
      />

      <p className="flex-1 font-medium">{toast.message}</p>

      <button
        type="button"
        onClick={() => dispatch(toastDismissed(toast.id))}
        aria-label="Dismiss notification"
        className="-mr-1 rounded-lg p-1 text-gray-400 hover:text-gray-700"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// Renders the toast queue from the ui slice. Mounted once in the app shell;
// anything can show one with dispatch(toastShown({ type, message })).
export default function Toaster() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-24 z-[70] flex flex-col gap-2 sm:left-auto sm:right-6 sm:w-[360px] lg:bottom-6"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
