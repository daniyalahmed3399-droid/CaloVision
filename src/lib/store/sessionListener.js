import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { api } from "./api";
import { login, logout, signUp } from "./slices/authSlice";

// Cached server data belongs to one user. Drop it whenever the signed-in
// user could change, so a second person on the same tab never sees the first
// person's meals, weight or activity.
export const sessionListener = createListenerMiddleware();

sessionListener.startListening({
  matcher: isAnyOf(login.fulfilled, signUp.fulfilled, logout.fulfilled),
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(api.util.resetApiState());
  },
});
