"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Activity,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { motion } from "motion/react";

const mobileItems = [
  {
    label: "Dashboard",
    href: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Food",
    href: "/app/food",
    icon: Utensils,
  },
  {
    label: "Activity",
    href: "/app/activity",
    icon: Activity,
  },
  {
    label: "Progress",
    href: "/app/progress",
    icon: TrendingUp,
  },
  {
    label: "More",
    href: "/app/settings",
    icon: MoreHorizontal,
  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/5 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {mobileItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/app/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-w-[62px] flex-col items-center"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex h-9 w-12 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-[#eaf7df] text-[#4dbb08]"
                    : "text-gray-400"
                }`}
              >
                <Icon size={19} />
              </motion.div>

              <span
                className={`mt-0.5 text-[10px] font-bold ${
                  isActive ? "text-[#3c9705]" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}