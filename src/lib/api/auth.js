// Auth + onboarding service. UI code only imports from here.
// Each function maps to one backend capability from the guide's API
// checklist; the mock or the real client is chosen in one place.

import { USE_MOCK_API } from "../config";
import { request } from "./client";
import { mockApi } from "./mock";

export function register(credentials) {
  return USE_MOCK_API
    ? mockApi.register(credentials)
    : request("register", { body: credentials });
}

export function login(credentials) {
  return USE_MOCK_API
    ? mockApi.login(credentials)
    : request("login", { body: credentials });
}

export function forgotPassword(payload) {
  return USE_MOCK_API
    ? mockApi.forgotPassword(payload)
    : request("forgotPassword", { body: payload });
}

export function resetPassword(payload) {
  return USE_MOCK_API
    ? mockApi.resetPassword(payload)
    : request("resetPassword", { body: payload });
}

export function getCurrentUser(token) {
  return USE_MOCK_API
    ? mockApi.currentUser({ token })
    : request("currentUser", { token });
}

export function saveOnboarding(token, profile) {
  return USE_MOCK_API
    ? mockApi.saveOnboarding({ token, profile })
    : request("saveOnboarding", { token, body: profile });
}

export function logoutRequest(token) {
  // Mock has no server session to end.
  return USE_MOCK_API ? Promise.resolve() : request("logout", { token });
}
