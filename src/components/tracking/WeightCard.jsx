import { Scale } from "lucide-react";

import Button from "../ui/Button";
import { formatShortDate } from "../../lib/dates";
import { formatWeight } from "../../lib/tracking";

// The latest weight on or before the selected day, shown in the unit the
// user chose at onboarding (stored in kg either way).
export default function WeightCard({ weight, unit, onLog }) {
  return (
    <section
      aria-labelledby="weight-title"
      className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Scale size={20} />
        </div>

        <h3 id="weight-title" className="text-base font-bold text-gray-900">
          Weight
        </h3>
      </div>

      {weight ? (
        <>
          <p className="mt-4 text-[clamp(1.5rem,7vw,1.875rem)] font-extrabold text-gray-900">
            {formatWeight(weight.kg, unit)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Logged {formatShortDate(weight.date)}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No weight logged yet.</p>
      )}

      <Button variant="secondary" className="mt-4 !h-11 w-full !text-xs" onClick={onLog}>
        Log weight
      </Button>
    </section>
  );
}
