import { createSlice } from "@reduxjs/toolkit";

// State for the BMI calculator section on the landing page.
const bmiSlice = createSlice({
  name: "bmi",
  initialState: {
    unit: "metric",
    heightCm: "",
    weightKg: "",
    heightFt: "",
    heightIn: "",
    weightLbs: "",
    bmi: null,
    category: "",
    error: "",
  },
  reducers: {
    fieldChanged(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
      state.error = "";
    },
    unitChanged(state, action) {
      state.unit = action.payload;
      state.bmi = null;
      state.category = "";
      state.error = "";
    },
    resultSet(state, action) {
      state.bmi = action.payload.bmi;
      state.category = action.payload.category;
      state.error = "";
    },
    // A validation error also clears any previous result, so a stale BMI is
    // never shown next to invalid input.
    errorSet(state, action) {
      state.error = action.payload;
      state.bmi = null;
      state.category = "";
    },
  },
});

export const { fieldChanged, unitChanged, resultSet, errorSet } =
  bmiSlice.actions;

export default bmiSlice.reducer;
