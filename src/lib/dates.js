// Calendar dates are plain "YYYY-MM-DD" strings in the user's local time.
// Using strings (not Date objects) keeps them serializable in Redux and
// avoids timezone shifts when they are sent to the backend.

const pad = (n) => String(n).padStart(2, "0");

export function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayString() {
  return toDateString(new Date());
}

// Parses at local noon so DST changes can never move the day.
export function parseDateString(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
}

export function isDateString(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  // Rejects impossible dates such as 2026-02-31.
  return toDateString(parseDateString(value)) === value;
}

export function addDays(value, days) {
  const date = parseDateString(value);
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

export function isFuture(value) {
  return value > todayString();
}

export function formatLongDate(value) {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(parseDateString(value));
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(parseDateString(value));
}

// "Today", "Yesterday", "Tomorrow", otherwise the weekday and date.
export function relativeLabel(value) {
  const today = todayString();

  if (value === today) return "Today";
  if (value === addDays(today, -1)) return "Yesterday";

  return formatLongDate(value);
}
