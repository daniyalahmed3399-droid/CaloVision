import { createSlice } from "@reduxjs/toolkit";

import { logout } from "./authSlice";

// App-wide interface state: drawers, menus and display toggles that more
// than one component might care about. Pure hover effects and animation
// state stay inside their component.
const uiSlice = createSlice({
  name: "ui",
  initialState: {
    appSidebarOpen: false, // mobile drawer inside /app
    publicNavOpen: false, // mobile menu on the marketing site
    profileMenuOpen: false,
    billingYearly: false, // pricing toggle
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
  },
  extraReducers: (builder) => {
    // Close account-only UI on logout so it doesn't reappear open for the
    // next user. Public display choices (pricing toggle) are kept.
    builder.addCase(logout.fulfilled, (state) => {
      state.profileMenuOpen = false;
      state.appSidebarOpen = false;
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
} = uiSlice.actions;

export default uiSlice.reducer;
