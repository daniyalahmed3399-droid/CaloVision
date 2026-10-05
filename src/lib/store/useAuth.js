"use client";

import { useCallback, useMemo } from "react";

import { ApiError } from "../api/errors";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  login,
  logout,
  saveOnboarding,
  signUp,
  userUpdated,
} from "./slices/authSlice";

// Auth facade over the store. Components call these like plain async
// functions; failures throw an ApiError so forms can show field errors.
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const status = useAppSelector((state) => state.auth.status);

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
