import ProgressBar from "../ui/ProgressBar";
import { formatNumber } from "../../lib/tracking";

// One macro (protein / carbs / fat): eaten against its target, both from the
// backend. With no target it still shows what was eaten.
export default function MacroCard({ label, eaten, target, tone }) {
  const hasTarget = Number.isFinite(target);
  const over = hasTarget && eaten > target;

  return (
    <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-gray-900">{label}</h3>

        {over && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
            Over target
          </span>
        )}
      </div>

      <p className="mt-3 text-2xl font-extrabold text-gray-900">
        {formatNumber(eaten, 1)}
        <span className="ml-1 text-sm font-medium text-gray-400">
          {hasTarget ? `/ ${formatNumber(target)} g` : "g"}
        </span>
      </p>

      {hasTarget && (
        <ProgressBar
          value={eaten}
          max={target}
          tone={tone}
          label={`${label} eaten compared with target`}
          className="mt-3"
        />
      )}
    </div>
  );
}
