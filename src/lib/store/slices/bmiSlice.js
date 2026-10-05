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
  },
  reducers: {
    fieldChanged(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    unitChanged(state, action) {
      state.unit = action.payload;
      state.bmi = null;
      state.category = "";
    },
    resultSet(state, action) {
      state.bmi = action.payload.bmi;
      state.category = action.payload.category;
    },
  },
});

export const { fieldChanged, unitChanged, resultSet } = bmiSlice.actions;

export default bmiSlice.reducer;
