"use client";

import {
  Menu,
  Bell,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";

export default function TopBar({ onMenuClick }) {
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
        <div className="hidden sm:block">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
            CaloVision
          </p>

          <h1 className="mt-0.5 text-lg font-extrabold text-gray-900">
            Your Nutrition Dashboard
          </h1>
        </div>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
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
            className="relative rounded-xl bg-white p-2.5 text-gray-500 shadow-sm transition-colors hover:text-[#4dbb08]"
          >
            <Bell size={19} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4dbb08]" />
          </motion.button>

          {/* Profile */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-white p-1.5 pr-2.5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4dbb08] text-sm font-bold text-white">
              U
            </div>

            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-gray-900">
                User
              </p>

              <p className="text-[10px] text-gray-400">
                Account
              </p>
            </div>

            <ChevronDown
              size={15}
              className="hidden text-gray-400 md:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}