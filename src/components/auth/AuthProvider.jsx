"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  login as loginRequest,
  logoutRequest,
  register as registerRequest,
  saveOnboarding as saveOnboardingRequest,
} from "../../lib/api/auth";
import { ApiError } from "../../lib/api/errors";
import { clearSession, getToken, setSession } from "../../lib/session";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>.");
  }

  return context;
}

// status: "loading" | "authenticated" | "unauthenticated"
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  // Restore the session on first load.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      const token = getToken();

      if (!token) {
        clearSession();
        setStatus("unauthenticated");
        return;
      }

      try {
        const currentUser = await getCurrentUser(token);

        if (cancelled) return;

        setUser(currentUser);
        setStatus("authenticated");
      } catch (error) {
        if (cancelled) return;

        // Only an expired/invalid session logs the user out. A network or
        // server error should not throw away a valid session.
        if (error instanceof ApiError && error.status === 401) {
          clearSession();
          setStatus("unauthenticated");
        } else {
          setStatus("unauthenticated");
        }
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback(({ token, user: nextUser }) => {
    setSession(token);
    setUser(nextUser);
    setStatus("authenticated");
    return nextUser;
  }, []);

  const login = useCallback(
    async (credentials) => startSession(await loginRequest(credentials)),
    [startSession]
  );

  const signUp = useCallback(
    async (credentials) => startSession(await registerRequest(credentials)),
    [startSession]
  );

  const logout = useCallback(async () => {
    const token = getToken();

    try {
      if (token) await logoutRequest(token);
    } catch {
      // Logging out locally must always succeed.
    }

    clearSession();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Saves the profile and returns the updated user (with backend targets)
  // WITHOUT putting it in context yet, so the onboarding flow can show the
  // target review. Call applyUser(...) when the user continues.
  const saveOnboarding = useCallback(
    (profile) => saveOnboardingRequest(getToken(), profile),
    []
  );

  const applyUser = useCallback((nextUser) => setUser(nextUser), []);

  const value = useMemo(
    () => ({
      user,
      status,
      login,
      signUp,
      logout,
      saveOnboarding,
      applyUser,
    }),
    [user, status, login, signUp, logout, saveOnboarding, applyUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
