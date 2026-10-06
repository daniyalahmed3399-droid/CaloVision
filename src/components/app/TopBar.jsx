"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";

import { useAuth } from "../../lib/store/useAuth";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  profileMenuSet,
  profileMenuToggled,
} from "../../lib/store/slices/uiSlice";

const PAGE_TITLES = [
  ["/app/food", "Food"],
  ["/app/activity", "Activity"],
  ["/app/progress", "Progress"],
  ["/app/plans", "Diet Plans"],
  ["/app/settings", "Settings"],
  ["/app/dashboard", "Today"],
];

export default function TopBar({ onMenuClick }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const dispatch = useAppDispatch();
  const menuOpen = useAppSelector((state) => state.ui.profileMenuOpen);
  const setMenuOpen = (open) => dispatch(profileMenuSet(open));
  const menuRef = useRef(null);

  const title =
    PAGE_TITLES.find(([path]) => pathname.startsWith(path))?.[1] ||
    "CaloVision";

  const displayName = user?.name || user?.email?.split("@")[0] || "User";

  // Close the profile menu on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return;

    const close = () => dispatch(profileMenuSet(false));

    const onClick = (event) => {
      if (!menuRef.current?.contains(event.target)) close();
    };
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, dispatch]);

  const today = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f6f9f1]/90 backdrop-blur-xl">
      <div className="flex h-[80px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-xl bg-white p-2.5 text-gray-600 shadow-sm transition-colors hover:text-[#4dbb08] lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Page Context */}
        <div className="ml-3 lg:ml-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            {today}
          </p>

          {/* Not a heading: each page supplies its own single <h1>. */}
          <p className="mt-0.5 text-lg font-extrabold text-gray-900">
            {title}
          </p>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/app/food/add"
            className="flex items-center gap-1.5 rounded-xl bg-[#4dbb08] px-3 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#3c9705] sm:px-4"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add food</span>
            <span className="sr-only sm:hidden">Add food</span>
          </Link>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            aria-label="Help"
            className="hidden rounded-xl bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:text-[#4dbb08] sm:block"
          >
            <HelpCircle size={19} />
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            aria-label="Notifications"
            className="relative hidden rounded-xl bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:text-[#4dbb08] sm:block"
          >
            <Bell size={19} />
          </motion.button>

          {/* Profile */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => dispatch(profileMenuToggled())}
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-xl bg-white p-1.5 pr-2.5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4dbb08] text-sm font-bold uppercase text-white">
                {displayName[0]}
              </div>

              <div className="hidden max-w-[120px] text-left md:block">
                <p className="truncate text-xs font-bold text-gray-900">
                  {displayName}
                </p>

                <p className="text-[10px] text-gray-400">Account</p>
              </div>

              <ChevronDown
                size={15}
                className="hidden text-gray-400 md:block"
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-lg"
              >
                <p className="truncate px-3 py-2 text-xs text-gray-400">
                  {user?.email}
                </p>

                <Link
                  href="/app/settings"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={17} />
                  Settings
                </Link>

                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
