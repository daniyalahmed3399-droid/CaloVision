"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Utensils,
  Activity,
  TrendingUp,
  ClipboardList,
  Settings,
  X,
} from "lucide-react";
import { motion } from "motion/react";

const navigationItems = [
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
    label: "Diet Plans",
    href: "/app/plans",
    icon: ClipboardList,
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings,
  },
];

export default function Sidebar({ mobile = false, onClose }) {
  const pathname = usePathname();

  return (
    <aside
      className={
        mobile
          ? "flex h-full w-full flex-col bg-white p-5"
          : "fixed left-0 top-0 hidden h-screen w-[270px] flex-col border-r border-black/5 bg-white p-5 lg:flex"
      }
    >
      {/* Logo */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={onClose}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#4dbb08] text-lg font-extrabold text-white">
            C
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-[#171717]">
              CaloVision
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Nutrition
            </p>
          </div>
        </Link>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="mt-10 flex-1 space-y-2">
        <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-400">
          Menu
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/app/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block"
            >
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[#eaf7df] text-[#3c9705]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={19} strokeWidth={2} />

                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Card */}
      <div className="rounded-2xl bg-[#f6f9f1] p-4">
        <p className="text-sm font-bold text-gray-900">
          Your nutrition journey
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          Track your meals, activity and progress in one place.
        </p>
      </div>
    </aside>
  );
}