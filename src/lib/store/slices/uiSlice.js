import { createSlice, nanoid } from "@reduxjs/toolkit";

import { logout } from "./authSlice";

// App-wide interface state: drawers, menus, toasts and display toggles that
// more than one component might care about. Pure hover effects and animation
// state stay inside their component.
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    appSidebarOpen: false, // mobile drawer inside /app
    publicNavOpen: false, // mobile menu on the marketing site
    profileMenuOpen: false,
    billingYearly: false, // pricing toggle
    toasts: [], // [{ id, type: "success" | "error", message }]
  },
  reducers: {
    appSidebarSet(state, action) {
      state.appSidebarOpen = action.payload;
    },
    publicNavSet(state, action) {
      state.publicNavOpen = action.payload;
    },
    publicNavToggled(state) {
      state.publicNavOpen = !state.publicNavOpen;
    },
    profileMenuSet(state, action) {
      state.profileMenuOpen = action.payload;
    },
    profileMenuToggled(state) {
      state.profileMenuOpen = !state.profileMenuOpen;
    },
    billingYearlySet(state, action) {
      state.billingYearly = action.payload;
    },
    // dispatch(toastShown({ type: "success", message: "Saved" }))
    toastShown: {
      reducer(state, action) {
        // Keep the stack short so a burst of errors can't fill the screen.
        state.toasts = [...state.toasts, action.payload].slice(-3);
      },
      prepare: ({ type = "success", message }) => ({
        payload: { id: nanoid(), type, message },
      }),
    },
    toastDismissed(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Close account-only UI on logout so it doesn't reappear open for the
    // next user. Public display choices (pricing toggle) are kept.
    builder.addCase(logout.fulfilled, (state) => {
      state.profileMenuOpen = false;
      state.appSidebarOpen = false;
      state.toasts = [];
    });
  },
});

export const {
  appSidebarSet,
  publicNavSet,
  publicNavToggled,
  profileMenuSet,
  profileMenuToggled,
  billingYearlySet,
  toastShown,
  toastDismissed,
} = uiSlice.actions;

export default uiSlice.reducer;
