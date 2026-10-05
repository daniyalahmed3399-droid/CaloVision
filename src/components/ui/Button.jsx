import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-[#17251a] text-white shadow-lg hover:bg-[#4dbb08] disabled:hover:bg-[#17251a]",
  green:
    "bg-[#4dbb08] text-white shadow-lg hover:bg-[#3c9705] disabled:hover:bg-[#4dbb08]",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
};

// loading disables the button, which also prevents double submits.
export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`flex h-14 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4dbb08]/30 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
