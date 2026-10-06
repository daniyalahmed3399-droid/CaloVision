"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Accessible dialog: focus moves inside on open and returns to the opener on
// close, Tab stays within the dialog, Escape or a click on the backdrop
// closes it, and the page behind doesn't scroll. On phones it slides up as a
// bottom sheet that scrolls if it is taller than the screen.
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className = "",
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);

  // Always call the latest onClose without re-running the focus effect.
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement;
    const node = dialogRef.current;
    const first =
      node.querySelector("[data-autofocus]") || node.querySelector(FOCUSABLE);

    (first || node).focus();
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const items = [...node.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null
      );

      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`max-h-[92vh] w-full overflow-y-auto rounded-t-[24px] bg-white p-6 shadow-xl outline-none sm:max-w-md sm:rounded-[24px] ${className}`}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-xl font-extrabold text-gray-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-gray-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 -mt-1 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
