// API NEEDED: the CaloVision API documentation has not been provided, so
// no endpoint URLs are invented here. Fill in each entry with the real
// method and path once the backend docs arrive, then set
// NEXT_PUBLIC_USE_MOCK_API=false.
//
// Shape: { method: "POST", path: "/..." }

export const endpoints = {
  register: null,
  login: null,
  google: null,
  forgotPassword: null,
  resetPassword: null,
  refreshSession: null,
  logout: null,
  currentUser: null,
  saveOnboarding: null,

  // Tracking. `path` may contain :params (filled from the request's `params`
  // object); any remaining params are sent as a query string on GET.
  day: null, // GET: summary + logs for one date ({ date })
  foodSearch: null, // GET: ({ q })
  foodPreview: null, // calculated nutrition for a quantity ({ foodId, quantity, unit })
  foodLogCreate: null,
  foodLogUpdate: null,
  foodLogDelete: null,
  exerciseCategories: null,
  exerciseSearch: null, // GET: ({ q, category })
  exerciseLogCreate: null,
  exerciseLogDelete: null,
  stepsSet: null,
  weightLog: null,
  weightHistory: null, // GET: ({ limit })
};
