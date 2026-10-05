import { Suspense } from "react";

import ResetPasswordForm from "../../../components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset password | CaloVision",
  description: "Choose a new CaloVision password.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
