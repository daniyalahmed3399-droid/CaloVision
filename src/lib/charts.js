// Pure helpers for the SVG line charts (no React, no DOM): axis ticks and
// line segments. Chart *values* come from the backend; this only decides how
// to draw them.

// "Nice" axis ticks covering [min, max]: round steps like 1, 2, 2.5, 5, 10
// times a power of ten. Returns { min, max, ticks }.
export function niceScale(min, max, count = 5) {
  let low = Number.isFinite(min) ? min : 0;
  let high = Number.isFinite(max) ? max : low + 1;

  if (high === low) {
    // A flat series still needs a visible range.
    const pad = Math.abs(low) * 0.05 || 1;
    low -= pad;
    high += pad;
  }

  const rough = (high - low) / count;
  const power = 10 ** Math.floor(Math.log10(rough));
  const step =
    [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= rough) ||
    10 * power;

  const start = Math.floor(low / step) * step;
  const end = Math.ceil(high / step) * step;
  const ticks = [];

  for (let value = start; value <= end + step / 2; value += step) {
    ticks.push(Math.round(value * 1e6) / 1e6);
  }

  return { min: start, max: end, ticks };
}

// Splits values into runs of consecutive points: [[{i, v}, ...], ...].
// A null/undefined value ends a run, unless `connectGaps` is set (sparse
// series such as weigh-ins), where the line simply skips the missing days.
export function buildRuns(values, connectGaps = false) {
  const runs = [];
  let current = [];

  values.forEach((value, i) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      if (!connectGaps && current.length) {
        runs.push(current);
        current = [];
      }
      return;
    }

    current.push({ i, v: value });
  });

  if (current.length) runs.push(current);

  return runs;
}

// SVG path for a run of {x, y} points ("M x y L x y ...").
export function linePath(points) {
  return points
    .map((p, index) => `${index === 0 ? "M" : "L"}${round(p.x)} ${round(p.y)}`)
    .join(" ");
}

// Same line closed down to the baseline, for the soft fill under it.
export function areaPath(points, baselineY) {
  if (points.length === 0) return "";

  const first = points[0];
  const last = points[points.length - 1];

  return `${linePath(points)} L${round(last.x)} ${round(baselineY)} L${round(first.x)} ${round(baselineY)} Z`;
}

const round = (n) => Math.round(n * 100) / 100;

// Indexes of x-axis labels to show: about `maxLabels` evenly spaced, always
// including the first and last day.
export function labelIndexes(length, maxLabels) {
  if (length <= 0) return [];
  if (length <= maxLabels) return Array.from({ length }, (_, i) => i);

  const step = Math.ceil((length - 1) / (maxLabels - 1));
  const indexes = [];

  for (let i = 0; i < length - 1; i += step) indexes.push(i);

  // Keep the last label from crowding the one before it.
  if (length - 1 - indexes[indexes.length - 1] < step / 2) indexes.pop();
  indexes.push(length - 1);

  return indexes;
}
