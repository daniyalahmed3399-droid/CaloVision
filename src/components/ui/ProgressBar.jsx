// Progress toward a target. Exposed to assistive tech as a progressbar; going
// over the target changes the colour AND the caller shows the number, so
// colour is never the only signal.
export default function ProgressBar({
  value,
  max,
  label,
  tone = "green",
  className = "",
}) {
  const hasTarget = Number.isFinite(max) && max > 0;
  const percent = hasTarget ? Math.min((value / max) * 100, 100) : 0;
  const over = hasTarget && value > max;

  const fill = over
    ? "bg-amber-500"
    : { green: "bg-[#4dbb08]", blue: "bg-sky-500", orange: "bg-orange-400", purple: "bg-violet-500" }[tone];

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={hasTarget ? max : undefined}
      aria-valuenow={hasTarget ? Math.round(value) : undefined}
      className={`h-2 overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${fill}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
