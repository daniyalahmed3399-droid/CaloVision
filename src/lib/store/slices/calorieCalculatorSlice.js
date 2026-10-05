import { createSlice } from "@reduxjs/toolkit";

export const initialCalorieForm = {
  age: "",
  gender: "",

  // Metric
  heightCm: "",
  weightKg: "",

  // Imperial
  heightFeet: "",
  heightInches: "",
  weightLb: "",

  activity: "",
  goal: "",
};

// State for the public /calorie-calculator tool.
const calorieCalculatorSlice = createSlice({
  name: "calorieCalculator",
  initialState: {
    unit: "metric",
    form: initialCalorieForm,
    result: null,
    error: "",
  },
  reducers: {
    fieldChanged(state, action) {
      const { name, value } = action.payload;
      state.form[name] = value;
      state.error = "";
    },
    unitChanged(state, action) {
      state.unit = action.payload;
      state.result = null;
      state.error = "";
    },
    resultSet(state, action) {
      state.result = action.payload;
    },
    errorSet(state, action) {
      state.error = action.payload;
    },
    calculatorReset(state) {
      state.form = initialCalorieForm;
      state.result = null;
      state.error = "";
    },
  },
});

export const {
  fieldChanged,
  unitChanged,
  resultSet,
  errorSet,
  calculatorReset,
} = calorieCalculatorSlice.actions;

export default calorieCalculatorSlice.reducer;
