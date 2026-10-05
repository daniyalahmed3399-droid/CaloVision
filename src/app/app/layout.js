import { Suspense } from "react";

import AuthGate from "../../components/auth/AuthGate";
import AppShell from "../../components/app/AppShell";

// Every /app/* page requires a logged-in, onboarded user.
export default function AppLayout({ children }) {
  return (
    <Suspense>
      <AuthGate mode="app">
        <AppShell>{children}</AppShell>
      </AuthGate>
    </Suspense>
  );
}
