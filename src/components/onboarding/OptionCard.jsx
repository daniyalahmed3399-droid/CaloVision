// A selectable card backed by a real radio input (or checkbox when
// `multiple`), so it works with the keyboard and screen readers. Selection
// is shown with a check mark and border, not colour alone.
import { Check } from "lucide-react";

export default function OptionCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  multiple = false,
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 focus-within:ring-4 focus-within:ring-[#4dbb08]/20 ${
        checked
          ? "border-[#4dbb08] bg-[#f1f9e9] shadow-sm"
          : "border-gray-200 bg-gray-50 hover:border-[#4dbb08]/40 hover:bg-white"
      }`}
    >
      <input
        type={multiple ? "checkbox" : "radio"}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
          multiple ? "rounded-md" : "rounded-full"
        } ${
          checked
            ? "border-[#4dbb08] bg-[#4dbb08] text-white"
            : "border-gray-300 bg-white text-transparent"
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </span>

      <span>
        <span className="block text-sm font-bold text-gray-800">
          {label}
        </span>

        {description && (
          <span className="mt-1 block text-xs leading-5 text-gray-500">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}
