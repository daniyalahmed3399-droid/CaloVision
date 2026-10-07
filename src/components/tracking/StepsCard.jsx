import { Footprints } from "lucide-react";

import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar";
import { formatNumber } from "../../lib/tracking";

// Daily steps. `count` is null when nothing was logged, which is different
// from a logged 0, so the two are shown differently.
export default function StepsCard({ steps, onEdit }) {
  const logged = steps.count !== null && steps.count !== undefined;

  return (
    <section
      aria-labelledby="steps-title"
      className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Footprints size={20} />
        </div>

        <h3 id="steps-title" className="text-base font-bold text-gray-900">
          Steps
        </h3>
      </div>

      {logged ? (
        <>
          <p className="mt-4 text-[clamp(1.5rem,7vw,1.875rem)] font-extrabold text-gray-900">
            {formatNumber(steps.count)}
            {Number.isFinite(steps.goal) && (
              <span className="ml-1.5 text-sm font-medium text-gray-400">
                / {formatNumber(steps.goal)}
              </span>
            )}
          </p>

          {Number.isFinite(steps.goal) && (
            <ProgressBar
              value={steps.count}
              max={steps.goal}
              tone="blue"
              label="Steps compared with daily goal"
              className="mt-3"
            />
          )}
        </>
      ) : (
        <p className="mt-4 text-sm text-gray-500">No steps logged for this day.</p>
      )}

      <Button
        variant="secondary"
        className="mt-4 !h-11 w-full !text-xs"
        onClick={onEdit}
      >
        {logged ? "Edit steps" : "Add steps"}
      </Button>
    </section>
  );
}
