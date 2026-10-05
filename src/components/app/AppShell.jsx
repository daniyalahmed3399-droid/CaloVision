"use client";

import { useState } from "react";
import { motion } from "motion/react";

import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";

export default function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f9f1] text-[#171717]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />

          <motion.div
            className="fixed left-0 top-0 z-50 h-full w-[280px] lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}

      {/* Main Application Area */}
      <div className="lg:pl-[270px]">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="min-h-[calc(100vh-80px)] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}