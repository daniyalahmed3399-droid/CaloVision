"use client";

import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delay` ms.
// Used so search boxes don't call the API on every keystroke.
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
