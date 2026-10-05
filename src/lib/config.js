// Central configuration. Values come from environment variables so the
// same build can point at different backends.

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// While the real CaloVision API is not connected, the app runs against a
// local mock backend (see src/lib/api/mock.js). Set
// NEXT_PUBLIC_USE_MOCK_API=false once the real endpoints are mapped in
// src/lib/api/endpoints.js.
export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

// Features that depend on backend confirmation (guide section 25).
export const FEATURES = {
  googleAuth: false,
  emailVerification: false,
  // Diet preferences are only collected if the backend stores them.
  dietPreferences: true,
};

export const SESSION_COOKIE = "cv_session";
export const TOKEN_STORAGE_KEY = "cv_token";

export const PASSWORD_MIN_LENGTH = 8;
