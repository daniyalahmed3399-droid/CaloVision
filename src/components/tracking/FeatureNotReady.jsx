import Link from "next/link";
import { Info } from "lucide-react";

// Shown after "Analyze" on the photo and voice screens while those features
// are UI-only (no backend yet). Says plainly that nothing was analyzed or
// saved, and points to the ways of logging food that do work.
export default function FeatureNotReady({
  title,
  children,
  mealType,
  showDescribe = true,
}) {
  return (
    <div
      role="status"
      className="rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-amber-900"
    >
      <div className="flex items-start gap-3">
        <Info size={20} className="mt-0.5 shrink-0" />

        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>

          <p className="mt-1 text-sm leading-6">{children}</p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            {showDescribe && (
              <Link
                href={`/app/food/add/text?meal=${mealType}`}
                className="flex min-h-10 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-amber-900 shadow-sm transition-colors hover:bg-amber-100"
              >
                Describe your meal instead
              </Link>
            )}

            <Link
              href={`/app/food/add/search?meal=${mealType}`}
              className="flex min-h-10 items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-amber-900 shadow-sm transition-colors hover:bg-amber-100"
            >
              Search the food list
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
