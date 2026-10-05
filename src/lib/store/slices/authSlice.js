import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCurrentUser,
  login as loginRequest,
  logoutRequest,
  register as registerRequest,
  saveOnboarding as saveOnboardingRequest,
} from "../../api/auth";
import { ApiError } from "../../api/errors";
import { clearSession, getToken, setSession } from "../../session";

// Redux state must be serializable, so failed thunks reject with a plain
// object. `useAuth` turns it back into an ApiError for the UI.
const toPayload = (error) =>
  error instanceof ApiError
    ? {
        status: error.status,
        message: error.message,
        fieldErrors: error.fieldErrors,
      }
    : { status: 0, message: "Something went wrong. Please try again.", fieldErrors: {} };

// Restore the session on first load.
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { rejectWithValue }) => {
    const token = getToken();

    if (!token) {
      clearSession();
      return rejectWithValue({ status: 401 });
    }

    try {
      return await getCurrentUser(token);
    } catch (error) {
      // Only an expired session clears the token. A network or server
      // error must not throw away a valid session.
      if (error instanceof ApiError && error.status === 401) clearSession();
      return rejectWithValue(toPayload(error));
    }
  }
);

const startSession = ({ token, user }) => {
  setSession(token);
  return user;
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return startSession(await loginRequest(credentials));
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (credentials, { rejectWithValue }) => {
    try {
      return startSession(await registerRequest(credentials));
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  const token = getToken();

  try {
    if (token) await logoutRequest(token);
  } catch {
    // Logging out locally must always succeed.
  }

  clearSession();
});

// Saves the profile and returns the updated user (with backend targets)
// WITHOUT storing it, so onboarding can show the target review first.
// Dispatch `userUpdated` when the user continues.
export const saveOnboarding = createAsyncThunk(
  "auth/saveOnboarding",
  async (profile, { rejectWithValue }) => {
    try {
      return await saveOnboardingRequest(getToken(), profile);
    } catch (error) {
      return rejectWithValue(toPayload(error));
    }
  }
);

// status: "loading" | "authenticated" | "unauthenticated"
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "loading" },
  reducers: {
    userUpdated(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    const authenticated = (state, action) => {
      state.user = action.payload;
      state.status = "authenticated";
    };

    builder
      .addCase(restoreSession.fulfilled, authenticated)
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      })
      .addCase(login.fulfilled, authenticated)
      .addCase(signUp.fulfilled, authenticated)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { userUpdated } = authSlice.actions;
export default authSlice.reducer;
