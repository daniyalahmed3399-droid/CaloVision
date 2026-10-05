import { Settings } from "lucide-react";

import ComingSoon from "../../../components/app/ComingSoon";

export const metadata = { title: "Settings | CaloVision" };

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      eyebrow="Settings"
      title="Profile & settings"
      description="Profile, units, goals, reminders and account."
    />
  );
}
