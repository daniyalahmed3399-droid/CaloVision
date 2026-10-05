import { createSlice } from "@reduxjs/toolkit";

import { logout, saveOnboarding } from "./authSlice";

export const initialOnboardingForm = {
  name: "",
  age: "",
  gender: "",
  units: "metric",
  heightCm: "",
  weightKg: "",
  heightFeet: "",
  heightInches: "",
  weightLb: "",
  goal: "",
  targetWeight: "",
  targetWeightLb: "",
  activity: "",
  dietPreferences: [],
};

const initialState = {
  form: initialOnboardingForm,
  errors: {},
  stepIndex: 0,
  saving: false,
  saveError: "",
  // The user returned by the backend after saving, shown on the target
  // review step. Not applied to auth state until the user continues.
  reviewUser: null,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    fieldChanged(state, action) {
      const { field, value } = action.payload;
      state.form[field] = value;
      state.errors = {};
      state.saveError = "";
    },
    dietToggled(state, action) {
      const list = state.form.dietPreferences;
      const index = list.indexOf(action.payload);

      if (index === -1) list.push(action.payload);
      else list.splice(index, 1);

      state.errors = {};
      state.saveError = "";
    },
    unitsChanged(state, action) {
      state.form.units = action.payload;
      state.errors = {};
    },
    errorsSet(state, action) {
      state.errors = action.payload;
    },
    stepSet(state, action) {
      state.stepIndex = action.payload;
      state.errors = {};
      state.saveError = "";
    },
    stepMoved(state, action) {
      state.stepIndex = Math.max(0, state.stepIndex + action.payload);
      state.errors = {};
      state.saveError = "";
    },
    onboardingReset() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Never leak one person's answers to the next user of this tab.
      .addCase(logout.fulfilled, () => initialState)
      .addCase(saveOnboarding.pending, (state) => {
        state.saving = true;
        state.saveError = "";
      })
      .addCase(saveOnboarding.fulfilled, (state, action) => {
        state.saving = false;
        state.reviewUser = action.payload;
        // The review step always follows the last input step.
        state.stepIndex += 1;
      })
      .addCase(saveOnboarding.rejected, (state, action) => {
        state.saving = false;
        state.saveError =
          action.payload?.message || "Something went wrong. Please try again.";
      });
  },
});

export const {
  fieldChanged,
  dietToggled,
  unitsChanged,
  errorsSet,
  stepSet,
  stepMoved,
  onboardingReset,
} = onboardingSlice.actions;

export default onboardingSlice.reducer;
