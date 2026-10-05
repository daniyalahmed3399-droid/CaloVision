"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

import { ApiError } from "../api/errors";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  login,
  logout,
  saveOnboarding,
  signUp,
  userUpdated,
} from "./slices/authSlice";

// false while the server renders and while the browser hydrates, true after.
// Used so the first client render always matches the server HTML.
const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

// Auth facade over the store. Components call these like plain async
// functions; failures throw an ApiError so forms can show field errors.
export function useAuth() {
  const dispatch = useAppDispatch();
  const hydrated = useHydrated();

  // The store restores the session right after mount, but React hydrates
  // Suspense boundaries later than that. Reading the live status during
  // hydration could therefore differ from the server HTML (a spinner) and
  // trigger a hydration error. Until hydrated, report the server's view.
  const storeUser = useAppSelector((state) => state.auth.user);
  const storeStatus = useAppSelector((state) => state.auth.status);
  const user = hydrated ? storeUser : null;
  const status = hydrated ? storeStatus : "loading";

  const run = useCallback(
    async (thunk) => {
      try {
        return await dispatch(thunk).unwrap();
      } catch (payload) {
        throw new ApiError(
          payload?.status ?? 0,
          payload?.message || "Something went wrong. Please try again.",
          payload?.fieldErrors || {}
        );
      }
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      user,
      status,
      login: (credentials) => run(login(credentials)),
      signUp: (credentials) => run(signUp(credentials)),
      logout: () => dispatch(logout()),
      saveOnboarding: (profile) => run(saveOnboarding(profile)),
      applyUser: (nextUser) => dispatch(userUpdated(nextUser)),
    }),
    [user, status, run, dispatch]
  );
}
