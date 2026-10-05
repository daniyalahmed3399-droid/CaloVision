// Client-side session storage.
//
// The token lives in localStorage; a non-sensitive marker cookie lets
// proxy.js redirect logged-out visitors before a page renders. When the
// real backend sets its own httpOnly session cookie, drop the token storage
// and point proxy.js at that cookie instead.

import { SESSION_COOKIE, TOKEN_STORAGE_KEY } from "./config";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setSession(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // Storage unavailable; the cookie below still lets the session work.
  }

  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }

  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
