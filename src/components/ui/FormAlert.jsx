import { CheckCircle2, Info } from "lucide-react";

export default function FormAlert({ type = "error", children }) {
  if (!children) return null;

  const isError = type === "error";
  const Icon = isError ? Info : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-800"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
