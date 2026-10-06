"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../lib/store/useAuth";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { publicNavSet } from "../lib/store/slices/uiSlice";

const navLinks = [
  {
    label: "Home",
    href: "#home",
  },
  {
    label: "Pages",
    dropdown: true,
    items: [
      {
        label: "Calories Calculator",
        href: "/calorie-calculator",
      },
      {
        label: "Recipe Nutrition Calculator",
        href: "/recipe-nutrition",
      },
      {
        label: "Daily Meal Planner",
        href: "/meal-planner",
      },
    ],
  },
  {
    label: "AI Coaching",
    href: "#ai-coaching",
  },
  {
    label: "Elements",
    href: "#elements",
    dropdown: true,
  },
  {
    label: "Contact Us",
    href: "#contact",
  },
];

// Fixed, full-width bar flush with the top of the screen. It stays put while
// the page scrolls underneath it.
export default function Navbar() {
  const dispatch = useAppDispatch();
  const mobileOpen = useAppSelector((state) => state.ui.publicNavOpen);
  const setMobileOpen = (open) => dispatch(publicNavSet(open));
  const { status } = useAuth();
  const loggedIn = status === "authenticated";

  return (
    <>
      {/* ================================================== */}
      {/* DESKTOP NAVBAR */}
      {/* ================================================== */}

      <header className="fixed inset-x-0 top-0 z-[100] hidden border-b border-gray-100 bg-white shadow-[0_2px_20px_rgba(0,0,0,0.06)] lg:block">
        <nav
          aria-label="Main"
          className="mx-auto flex h-[76px] max-w-[1320px] items-center px-6 xl:px-8"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#4dbb08]">
                <span className="text-xl font-black text-white">
                  C
                </span>
              </div>

              <div className="leading-none">
                <span className="block text-[21px] font-extrabold tracking-[-0.04em] text-gray-900">
                  Calo
                  <span className="text-[#4dbb08]">
                    Vision
                  </span>
                </span>

                <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.25em] text-gray-400">
                  Nutrition & Wellness
                </span>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="ml-auto flex items-center">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <NavItem
                  key={link.label}
                  link={link}
                />
              ))}
            </div>

            {/* Account */}
            <div className="ml-3 flex items-center gap-1 border-l border-gray-200 pl-3 xl:ml-4 xl:gap-2 xl:pl-4">
              {loggedIn ? (
                <Link
                  href="/app/dashboard"
                  className="whitespace-nowrap rounded-xl bg-[#4dbb08] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#3c9705]"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="whitespace-nowrap rounded-xl px-3 py-3 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-[#f3f7ef] hover:text-[#4dbb08]"
                  >
                    Log in
                  </Link>

                  <Link
                    href="/signup"
                    className="whitespace-nowrap rounded-xl bg-[#4dbb08] px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#3c9705] xl:px-5"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* ================================================== */}
      {/* MOBILE NAVBAR */}
      {/* ================================================== */}

      <header className="fixed inset-x-0 top-0 z-[100] border-b border-gray-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] lg:hidden">
        <nav
          aria-label="Main"
          className="flex h-[64px] items-center justify-between px-4"
        >
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4dbb08]">
              <span className="text-lg font-black text-white">
                C
              </span>
            </div>

            <div>
              <span className="block text-[19px] font-extrabold leading-none text-gray-900">
                Calo
                <span className="text-[#4dbb08]">
                  Vision
                </span>
              </span>

              <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                Nutrition & Wellness
              </span>
            </div>
          </Link>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f7ef] text-gray-900 transition-colors hover:bg-[#4dbb08] hover:text-white"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>
        </nav>

        {/* Mobile menu: a full-width panel attached under the bar */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="max-h-[calc(100vh-64px)] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-4 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
            >
              <div className="flex flex-col pt-2">
                {navLinks.map((link, index) => {
                  // Pages has its own calculator links.
                  if (
                    link.label === "Pages" &&
                    link.items
                  ) {
                    return (
                      <div
                        key={link.label}
                        className="border-b border-gray-100 pb-2"
                      >
                        <div className="flex items-center justify-between px-3 py-4 text-sm font-medium text-gray-700">
                          <span>
                            {link.label}
                          </span>

                          <ChevronDown
                            size={15}
                          />
                        </div>

                        <div className="ml-3 border-l-2 border-[#e7f2df] pl-3">
                          {link.items.map(
                            (item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                onClick={() =>
                                  setMobileOpen(
                                    false
                                  )
                                }
                                className="block rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-[#f3f7ef] hover:text-[#4dbb08]"
                              >
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.04,
                      }}
                      className="flex items-center justify-between border-b border-gray-100 px-3 py-4 text-sm font-medium text-gray-700 last:border-none hover:text-[#4dbb08]"
                    >
                      <span>
                        {link.label}
                      </span>

                      {link.dropdown && (
                        <ChevronDown
                          size={15}
                        />
                      )}
                    </motion.a>
                  );
                })}

                {/* Mobile account links */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {loggedIn ? (
                    <Link
                      href="/app/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="col-span-2 flex items-center justify-center rounded-xl bg-[#4dbb08] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700"
                      >
                        Log in
                      </Link>

                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center rounded-xl bg-[#4dbb08] px-5 py-3 text-sm font-semibold text-white"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

// ============================================================
// DESKTOP NAV ITEM
// ============================================================

function NavItem({ link }) {
  return (
    <motion.div
      whileHover={{
        y: -1,
      }}
      className="group relative"
    >
      <Link
        href={link.href || "#"}
        className="flex items-center gap-1 whitespace-nowrap rounded-xl px-2 py-3 text-[13px] font-medium text-gray-700 transition-colors duration-300 hover:bg-[#f3f7ef] hover:text-[#4dbb08] xl:px-3"
      >
        <span>{link.label}</span>

        {link.dropdown && (
          <ChevronDown
            size={13}
            className="transition-transform duration-300 group-hover:rotate-180"
          />
        )}
      </Link>

      {/* Dropdown */}
      {link.items && (
        <div className="invisible absolute left-0 top-full w-[290px] translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
            {link.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-[#f3f7ef] hover:text-[#4dbb08]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
