import { createApi } from "@reduxjs/toolkit/query/react";

import { request } from "../api/client";
import { ApiError } from "../api/errors";
import { getToken } from "../session";

// RTK Query base for all backend data (dashboard, food logs, progress,
// plans, ...). It reuses the central `request` client, so endpoints are
// still declared in src/lib/api/endpoints.js and errors are still ApiError.
//
// Feature code adds endpoints with `api.injectEndpoints`:
//
//   export const foodApi = api.injectEndpoints({
//     endpoints: (build) => ({
//       getToday: build.query({ query: () => ({ name: "today" }) }),
//       logMeal: build.mutation({
//         query: (body) => ({ name: "logMeal", body }),
//         invalidatesTags: ["Day"],   // refreshes anything tagged "Day"
//       }),
//     }),
//   });
//
// `name` is a key of `endpoints` in src/lib/api/endpoints.js.
const baseQuery = async ({ name, body }) => {
  try {
    const data = await request(name, { body, token: getToken() });
    return { data };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        error: {
          status: error.status,
          message: error.message,
          fieldErrors: error.fieldErrors,
        },
      };
    }

    throw error;
  }
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  // Tags are added here as features need them, e.g. "Day", "Weight",
  // "Plan". Mutations invalidate tags so screens refresh automatically.
  tagTypes: ["Day", "Activity", "Weight", "Plan", "Subscription"],
  endpoints: () => ({}),
});
