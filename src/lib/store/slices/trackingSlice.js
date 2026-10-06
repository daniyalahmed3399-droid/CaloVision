import { createSlice } from "@reduxjs/toolkit";

import { logout } from "./authSlice";

// Which calendar day the tracking screens are showing. It is shared by the
// dashboard, meal history and activity pages, so changing the date on one
// carries over to the others. `null` means "follow today", which keeps the
// app correct if it is left open past midnight.
const trackingSlice = createSlice({
  name: "tracking",
  initialState: { selectedDate: null },
  reducers: {
    dateSelected(state, action) {
      state.selectedDate = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => ({ selectedDate: null }));
  },
});

export const { dateSelected } = trackingSlice.actions;

export default trackingSlice.reducer;
