import { api } from "../api";

// Backend data for the Today dashboard, meal history, exercise, steps and
// weight. Cache tags drive refreshes: every mutation invalidates the day it
// changed, so the dashboard and history update the moment something is
// logged, edited or deleted.
//
//   { type: "Day", id: "2026-10-06" }  one date's summary + logs
//   "Day"                              every cached date (weight changes the
//                                      "latest weight" on all later days)
//   "Weight"                           the weight history list
const dayTag = (date) => [{ type: "Day", id: date }];

export const trackingApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ---- reads ----
    getDay: build.query({
      query: ({ date }) => ({ name: "day", params: { date } }),
      providesTags: (_result, _error, { date }) => dayTag(date),
    }),

    searchFoods: build.query({
      query: ({ q }) => ({ name: "foodSearch", params: { q } }),
    }),

    // Calculated nutrition for a quantity, computed by the backend.
    previewFood: build.query({
      query: (body) => ({ name: "foodPreview", body }),
    }),

    getExerciseCategories: build.query({
      query: () => ({ name: "exerciseCategories" }),
    }),

    searchExercises: build.query({
      query: ({ q, category }) => ({
        name: "exerciseSearch",
        params: { q, category },
      }),
    }),

    getWeightHistory: build.query({
      query: ({ limit = 7 } = {}) => ({
        name: "weightHistory",
        params: { limit },
      }),
      providesTags: ["Weight"],
    }),

    // ---- food ----
    logFood: build.mutation({
      query: (body) => ({ name: "foodLogCreate", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    updateFoodLog: build.mutation({
      query: (body) => ({ name: "foodLogUpdate", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    deleteFoodLog: build.mutation({
      query: (body) => ({ name: "foodLogDelete", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    // ---- exercise ----
    logExercise: build.mutation({
      query: (body) => ({ name: "exerciseLogCreate", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    deleteExerciseLog: build.mutation({
      query: (body) => ({ name: "exerciseLogDelete", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    // ---- steps ----
    setSteps: build.mutation({
      query: (body) => ({ name: "stepsSet", body }),
      invalidatesTags: (_result, _error, { date }) => dayTag(date),
    }),

    // ---- weight ----
    logWeight: build.mutation({
      query: (body) => ({ name: "weightLog", body }),
      invalidatesTags: ["Day", "Weight"],
    }),
  }),
});

export const {
  useGetDayQuery,
  useSearchFoodsQuery,
  usePreviewFoodQuery,
  useGetExerciseCategoriesQuery,
  useSearchExercisesQuery,
  useGetWeightHistoryQuery,
  useLogFoodMutation,
  useUpdateFoodLogMutation,
  useDeleteFoodLogMutation,
  useLogExerciseMutation,
  useDeleteExerciseLogMutation,
  useSetStepsMutation,
  useLogWeightMutation,
} = trackingApi;
