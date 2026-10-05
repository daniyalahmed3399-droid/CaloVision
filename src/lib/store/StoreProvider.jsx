"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";

import { makeStore } from "./store";
import { hydratePersisted } from "./persistence";
import { restoreSession } from "./slices/authSlice";

// Mounted once in the root layout. Creating the store in useState keeps it
// stable for the lifetime of the page without a module-level singleton.
export default function StoreProvider({ children }) {
  const [store] = useState(makeStore);

  // Browser-only work runs after mount so the server render and the first
  // client render match: restore the saved session, then load anything that
  // was persisted to localStorage.
  useEffect(() => {
    store.dispatch(hydratePersisted());
    store.dispatch(restoreSession());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
