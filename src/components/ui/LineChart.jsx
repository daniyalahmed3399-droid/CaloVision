"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  areaPath,
  buildRuns,
  labelIndexes,
  linePath,
  niceScale,
} from "../../lib/charts";

const MARGIN = { top: 14, bottom: 26, left: 46, right: 12, rightAxis: 46 };

// A small hand-drawn SVG line chart (no chart library). Lines draw themselves
// in on load, hover / touch / arrow keys show a tooltip for one day, and a
// series can sit on a second (right-hand) axis.
//
//   labels   one "YYYY-MM-DD" per point
//   series   [{ key, label, color, values, axis, area, dots, connectGaps, format }]
//            values has one number (or null for "no data") per label;
//            axis is "left" (default) or "right"; area adds a soft fill;
//            dots always draws the points (sparse series such as weigh-ins);
//            connectGaps joins points across missing days instead of breaking
//            the line; format(value) is for the tooltip.
//   axes     { left: { zero, format }, right: { zero, format } } - zero starts
//            the axis at 0; format labels the ticks
//   refLines [{ value, axis, label }] dashed reference lines (targets, goals)
//   height / tickCount  chart height in px and roughly how many y ticks to aim
//            for (use fewer on short charts)
export default function LineChart({
  labels,
  series,
  axes = {},
  refLines = [],
  height = 190,
  tickCount = 5,
  ariaLabel,
  formatLabel = (label) => label,
}) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(null);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const element = box.current;

    if (!element) return undefined;

    // Measure straight away (the observer only reports on the next frame,
    // which doesn't come while the page is hidden), then keep it updated.
    setWidth(element.clientWidth);

    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width))
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const count = labels.length;
  const hasRight = series.some((item) => item.axis === "right");
  const left = MARGIN.left;
  const right = hasRight ? MARGIN.rightAxis : MARGIN.right;
  const plotWidth = Math.max(width - left - right, 1);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;
  const baseline = MARGIN.top + plotHeight;

  // One scale per axis, covering every series and reference line on it.
  const scaleFor = (axis) => {
    const config = axes[axis] || {};
    const values = [
      ...series
        .filter((item) => (item.axis || "left") === axis)
        .flatMap((item) => item.values),
      ...refLines
        .filter((line) => (line.axis || "left") === axis)
        .map((line) => line.value),
    ].filter((value) => Number.isFinite(value));

    let min = values.length ? Math.min(...values) : 0;
    let max = values.length ? Math.max(...values) : 1;

    if (config.zero) min = 0;
    if (max <= min) max = min + 1;

    return niceScale(min, max, tickCount);
  };

  const scales = { left: scaleFor("left"), right: hasRight ? scaleFor("right") : null };

  const x = (index) =>
    left + (count <= 1 ? plotWidth / 2 : (index * plotWidth) / (count - 1));

  const y = (value, axis = "left") => {
    const scale = scales[axis] || scales.left;

    return (
      MARGIN.top +
      plotHeight * (1 - (value - scale.min) / (scale.max - scale.min))
    );
  };

  const formatTick = (axis, value) => {
    const format = axes[axis]?.format;

    return format ? format(value) : String(value);
  };

  // Sparse charts (only dots, such as weigh-ins) jump between the days that
  // have data instead of landing on empty days.
  const sparse = series.length > 0 && series.every((item) => item.dots);
  const dataIndexes = sparse
    ? labels
        .map((_, index) => index)
        .filter((index) => series.some((item) => Number.isFinite(item.values[index])))
    : null;

  const indexFromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const position = (event.clientX - rect.left - left) / plotWidth;
    const index = Math.min(
      Math.max(Math.round(position * (count - 1)), 0),
      count - 1
    );

    if (!dataIndexes?.length) return index;

    return dataIndexes.reduce((best, candidate) =>
      Math.abs(candidate - index) < Math.abs(best - index) ? candidate : best
    );
  };

  const onKeyDown = (event) => {
    // The days the keyboard can stop on: every day, or just the days with data.
    const stops = dataIndexes?.length
      ? dataIndexes
      : labels.map((_, index) => index);
    const last = stops[stops.length - 1];
    const first = stops[0];
    const from = active === null ? last + (event.key === "ArrowRight" ? 1 : 0) : active;
    let next = null;

    if (event.key === "ArrowLeft") {
      next = [...stops].reverse().find((index) => index < from) ?? first;
    } else if (event.key === "ArrowRight") {
      next = stops.find((index) => index > from) ?? last;
    } else if (event.key === "Home") next = first;
    else if (event.key === "End") next = last;
    else if (event.key === "Escape") {
      setActive(null);
      return;
    }

    if (next !== null) {
      event.preventDefault();
      setKeyboard(true);
      setActive(next);
    }
  };

  const draw = (delay) =>
    reduceMotion
      ? { initial: false }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { duration: 1.1, delay, ease: "easeOut" },
        };

  const ticksEvery = Math.max(2, Math.floor(plotWidth / 64));
  const shownLabels = new Set(labelIndexes(count, ticksEvery));
  const tooltipLeft = Math.min(Math.max(x(active ?? 0), 78), Math.max(width - 78, 78));

  return (
    <div
      ref={box}
      role="group"
      aria-label={`${ariaLabel}. Use the left and right arrow keys to read each day.`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onBlur={() => {
        setActive(null);
        setKeyboard(false);
      }}
      className="relative w-full rounded-xl outline-none focus-visible:ring-4 focus-visible:ring-[#4dbb08]/30"
      style={{ height }}
    >
      {width > 0 && (
        <svg
          width={width}
          height={height}
          aria-hidden="true"
          className="block touch-pan-y select-none"
          onPointerMove={(event) => {
            setKeyboard(false);
            setActive(indexFromPointer(event));
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setActive(null);
          }}
        >
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.key}
                id={`${gradientId}-${item.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={item.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={item.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* grid + left axis */}
          {scales.left.ticks.map((tick) => (
            <g key={`l-${tick}`}>
              <line
                x1={left}
                x2={left + plotWidth}
                y1={y(tick)}
                y2={y(tick)}
                stroke="#e9efe3"
                strokeWidth="1"
              />
              <text
                x={left - 8}
                y={y(tick) + 4}
                textAnchor="end"
                fontSize="11"
                fill={hasRight ? series.find((s) => (s.axis || "left") === "left")?.color : "#9ca3af"}
              >
                {formatTick("left", tick)}
              </text>
            </g>
          ))}

          {/* right axis labels (no extra gridlines) */}
          {scales.right?.ticks.map((tick) => (
            <text
              key={`r-${tick}`}
              x={left + plotWidth + 8}
              y={y(tick, "right") + 4}
              textAnchor="start"
              fontSize="11"
              fill={series.find((s) => s.axis === "right")?.color}
            >
              {formatTick("right", tick)}
            </text>
          ))}

          {/* reference lines (target, goal) */}
          {refLines.map((line) => (
            <g key={line.label}>
              <line
                x1={left}
                x2={left + plotWidth}
                y1={y(line.value, line.axis)}
                y2={y(line.value, line.axis)}
                stroke="#9ca3af"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={left + 4}
                y={y(line.value, line.axis) - 4}
                fontSize="10"
                fill="#9ca3af"
              >
                {line.label}
              </text>
            </g>
          ))}

          {/* x labels */}
          {labels.map((label, index) =>
            shownLabels.has(index) ? (
              <text
                key={label}
                x={x(index)}
                y={height - 6}
                textAnchor={index === 0 ? "start" : index === count - 1 ? "end" : "middle"}
                fontSize="11"
                fill="#9ca3af"
              >
                {formatLabel(label)}
              </text>
            ) : null
          )}

          {/* data. The key replays the drawing when the data changes. */}
          <g key={labels[0] + labels[count - 1]}>
            {series.map((item, seriesIndex) => {
              const axis = item.axis || "left";
              const runs = buildRuns(item.values, item.connectGaps).map((run) =>
                run.map((point) => ({ ...point, x: x(point.i), y: y(point.v, axis) }))
              );

              return (
                <g key={item.key}>
                  {item.area &&
                    runs
                      .filter((run) => run.length > 1)
                      .map((run, runIndex) => (
                        <motion.path
                          key={`a-${runIndex}`}
                          d={areaPath(run, baseline)}
                          fill={`url(#${gradientId}-${item.key})`}
                          {...(reduceMotion
                            ? { initial: false }
                            : {
                                initial: { opacity: 0 },
                                animate: { opacity: 1 },
                                transition: { duration: 0.8, delay: 0.5 + seriesIndex * 0.15 },
                              })}
                        />
                      ))}

                  {runs
                    .filter((run) => run.length > 1)
                    .map((run, runIndex) => (
                      <motion.path
                        key={`p-${runIndex}`}
                        d={linePath(run)}
                        fill="none"
                        stroke={item.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...draw(seriesIndex * 0.15)}
                      />
                    ))}

                  {/* single points, and every point on sparse series */}
                  {runs.flatMap((run) =>
                    run
                      .filter((point) => item.dots || run.length === 1)
                      .map((point) => (
                        <motion.circle
                          key={point.i}
                          cx={point.x}
                          cy={point.y}
                          r="3.5"
                          fill="#fff"
                          stroke={item.color}
                          strokeWidth="2"
                          {...(reduceMotion
                            ? { initial: false }
                            : {
                                initial: { opacity: 0, scale: 0.4 },
                                animate: { opacity: 1, scale: 1 },
                                transition: { duration: 0.4, delay: 0.9 + seriesIndex * 0.15 },
                              })}
                          style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                        />
                      ))
                  )}
                </g>
              );
            })}
          </g>

          {/* hover / keyboard marker */}
          {active !== null && (
            <g pointerEvents="none">
              <line
                x1={x(active)}
                x2={x(active)}
                y1={MARGIN.top}
                y2={baseline}
                stroke="#cfd8c6"
                strokeWidth="1"
              />
              {series.map((item) => {
                const value = item.values[active];

                return Number.isFinite(value) ? (
                  <circle
                    key={item.key}
                    cx={x(active)}
                    cy={y(value, item.axis || "left")}
                    r="4.5"
                    fill="#fff"
                    stroke={item.color}
                    strokeWidth="2.5"
                  />
                ) : null;
              })}
            </g>
          )}
        </svg>
      )}

      {active !== null && (
        <div
          aria-live={keyboard ? "polite" : "off"}
          className="pointer-events-none absolute top-0 z-10 min-w-[8.5rem] -translate-x-1/2 rounded-xl border border-gray-100 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: tooltipLeft }}
        >
          <p className="font-bold text-gray-900">{formatLabel(labels[active])}</p>

          {series.map((item) => {
            const value = item.values[active];

            return (
              <p key={item.key} className="mt-1 flex items-center gap-1.5 text-gray-600">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                {item.label}:{" "}
                <span className="font-semibold text-gray-900">
                  {Number.isFinite(value)
                    ? item.format
                      ? item.format(value)
                      : value
                    : "No data"}
                </span>
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}
