import { createApi } from "@reduxjs/toolkit/query/react";

import { USE_MOCK_API } from "../config";
import { request } from "../api/client";
import { ApiError } from "../api/errors";
import { mockTracking } from "../api/mockTracking";
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
// `name` is a key of `endpoints` in src/lib/api/endpoints.js; `params` fill
// path placeholders / the query string, `body` is the JSON payload.
const baseQuery = async ({ name, body, params }) => {
  const args = { body, params, token: getToken() };

  try {
    // Mock mode routes tracking calls to the local stand-in backend;
    // otherwise the central client calls the real endpoint.
    const data =
      USE_MOCK_API && mockTracking[name]
        ? await mockTracking[name](args)
        : await request(name, args);

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
