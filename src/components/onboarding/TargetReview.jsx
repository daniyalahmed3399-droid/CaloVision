import { ArrowRight, CheckCircle2, Flame } from "lucide-react";

import Button from "../ui/Button";

// Shows the targets RETURNED BY THE BACKEND. Nothing is calculated here.
// Missing values are hidden rather than invented.
export default function TargetReview({ user, onConfirm }) {
  const targets = user.targets;

  const macros = [
    { label: "Protein", value: targets?.proteinG, unit: "g" },
    { label: "Carbs", value: targets?.carbsG, unit: "g" },
    { label: "Fat", value: targets?.fatG, unit: "g" },
  ].filter((macro) => Number.isFinite(macro.value));

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf5df] text-[#4dbb08]">
          <CheckCircle2 size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Your daily targets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {user.name ? `${user.name}, here` : "Here"} is your personalised
            plan.
          </p>
        </div>
      </div>

      {Number.isFinite(targets?.calories) ? (
        <div className="relative mt-7 overflow-hidden rounded-2xl bg-[#17251a] p-6 text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[26px] border-white/5" />

          <p className="relative text-xs font-semibold uppercase tracking-[0.15em] text-white/50">
            Daily calorie target
          </p>

          <div className="relative mt-2 flex items-end gap-2">
            <Flame size={32} className="mb-1 text-[#8fe34d]" />

            <span className="text-5xl font-extrabold tracking-tight text-[#8fe34d] sm:text-6xl">
              {targets.calories.toLocaleString()}
            </span>

            <span className="mb-2 text-sm text-white/60">kcal/day</span>
          </div>
        </div>
      ) : (
        <p className="mt-7 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
          Your targets aren&apos;t available yet. You can continue and
          they&apos;ll appear once they&apos;re ready.
        </p>
      )}

      {macros.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {macros.map((macro) => (
            <div
              key={macro.label}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
            >
              <p className="text-xs font-medium text-gray-500">
                {macro.label}
              </p>

              <p className="mt-2 text-xl font-bold text-gray-900">
                {macro.value}
                <span className="ml-0.5 text-xs font-medium text-gray-400">
                  {macro.unit}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {Number.isFinite(targets?.bmi) && (
        <p className="mt-4 text-xs text-gray-500">
          Estimated BMI: <strong>{targets.bmi}</strong>
        </p>
      )}

      <p className="mt-4 text-[11px] leading-5 text-gray-400">
        These are estimates, not medical advice. You can update your details
        and goals any time in Settings.
      </p>

      <Button
        variant="green"
        className="mt-8 w-full"
        onClick={onConfirm}
      >
        Continue to dashboard
        <ArrowRight size={18} />
      </Button>
    </div>
  );
}
