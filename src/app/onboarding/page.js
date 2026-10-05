import { Suspense } from "react";

import AuthGate from "../../components/auth/AuthGate";
import Onboarding from "../../components/onboarding/Onboarding";

export const metadata = {
  title: "Set up your profile | CaloVision",
  description: "Tell us about yourself to personalise your CaloVision targets.",
};

export default function OnboardingPage() {
  return (
    <Suspense>
      <AuthGate mode="onboarding">
        <Onboarding />
      </AuthGate>
    </Suspense>
  );
}
