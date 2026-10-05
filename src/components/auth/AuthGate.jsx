"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "./AuthProvider";
import FullPageLoader from "../ui/FullPageLoader";

// Only follow ?next= to a page inside this app, never to another site.
function safeNextPath(value) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

// Client-side guard that complements proxy.js. proxy.js only checks that a
// session cookie exists; this confirms the session is valid and decides
// between the app and onboarding.
//
// mode "app"        -> logged in AND onboarded
// mode "onboarding" -> logged in, onboarding not finished
// mode "guest"      -> logged out only (login, signup, ...)
export default function AuthGate({ mode, children }) {
  const { user, status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const next = safeNextPath(useSearchParams().get("next"));

  let redirectTo = null;

  if (status === "unauthenticated" && mode !== "guest") {
    redirectTo = `/login?next=${encodeURIComponent(pathname)}`;
  } else if (status === "authenticated") {
    if (mode === "guest") {
      redirectTo = user.onboarded ? next || "/app/dashboard" : "/onboarding";
    } else if (mode === "app" && !user.onboarded) {
      redirectTo = "/onboarding";
    } else if (mode === "onboarding" && user.onboarded) {
      redirectTo = "/app/dashboard";
    }
  }

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  if (status === "loading" || redirectTo) {
    return <FullPageLoader />;
  }

  return children;
}
