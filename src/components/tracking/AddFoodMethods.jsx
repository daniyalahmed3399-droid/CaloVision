import Link from "next/link";
import { Camera, MessageSquareText, Mic, Search } from "lucide-react";

import PageHeader from "../ui/PageHeader";

const METHODS = [
  {
    icon: Search,
    title: "Search food",
    description: "Find a food in the database and choose how much you had.",
    href: "/app/food/add/search",
  },
  {
    icon: Camera,
    title: "Scan a meal photo",
    description: "Upload or take a photo and get an AI estimate.",
    href: "/app/food/add/photo",
    preview: true,
  },
  {
    icon: MessageSquareText,
    title: "Describe your meal",
    description: "Type something like “2 eggs, toast and coffee”.",
    href: "/app/food/add/text",
    preview: true,
  },
  {
    icon: Mic,
    title: "Speak your meal",
    description: "Say what you ate instead of typing it.",
    href: "/app/food/add/voice",
    preview: true,
  },
];

// Step 1 of adding food: pick how to log it. Search is built; describe, photo
// and voice are UI-only previews (no analysis service yet).
export default function AddFoodMethods() {
  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        eyebrow="Food"
        title="Add food"
        description="Choose how you'd like to log this meal."
      />

      <ul className="grid gap-4 sm:grid-cols-2">
        {METHODS.map(({ icon: Icon, title, description, href, preview }) => {
          const body = (
            <>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  href ? "bg-[#eaf5df] text-[#4dbb08]" : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={24} />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">{title}</h2>

                {!href && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">
                    Coming soon
                  </span>
                )}

                {preview && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                    Preview
                  </span>
                )}
              </div>

              <p className="mt-1.5 text-sm leading-6 text-gray-500">
                {description}
              </p>
            </>
          );

          return (
            <li key={title}>
              {href ? (
                <Link
                  href={href}
                  className="block h-full rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#4dbb08]/40 hover:shadow-md"
                >
                  {body}
                </Link>
              ) : (
                <div
                  aria-disabled="true"
                  className="h-full rounded-[24px] border border-dashed border-gray-200 bg-white/60 p-6 opacity-70"
                >
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
