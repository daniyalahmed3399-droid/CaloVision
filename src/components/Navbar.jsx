"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      label: "Services",
      href: "#services",
      dropdown: true,
    },
    {
      label: "Blogs",
      href: "#blog",
      dropdown: true,
    },
    {
      label: "Elements",
      href: "#elements",
      dropdown: true,
    },
    {
      label: "Contact Us",
      href: "#appointment",
    },
  ];

  return (
    <>
      {/* ================================================== */}
      {/* DESKTOP NAVBAR */}
      {/* ================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="fixed left-1/2 top-5 z-[100] hidden w-[calc(100%-40px)] max-w-[1240px] -translate-x-1/2 lg:block"
      >
        <nav className="flex h-[78px] items-center rounded-[22px] bg-white px-5 shadow-[0_10px_40px_rgba(0,0,0,0.10)]">
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

            {/* Appointment */}
            <motion.a
              href="#appointment"
              whileHover={{
                y: -2,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="ml-5 flex items-center gap-2 rounded-xl bg-[#17251a] px-5 py-3 text-[13px] font-semibold text-white transition-colors duration-300 hover:bg-[#4dbb08]"
            >
              Appointment
              <ArrowRight size={15} />
            </motion.a>
          </div>
        </nav>
      </motion.header>

      {/* ================================================== */}
      {/* MOBILE NAVBAR */}
      {/* ================================================== */}

      <motion.header
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="fixed left-1/2 top-4 z-[100] w-[calc(100%-24px)] -translate-x-1/2 lg:hidden"
      >
        <nav className="flex h-[68px] items-center justify-between rounded-[20px] bg-white px-4 shadow-[0_10px_35px_rgba(0,0,0,0.12)]">
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

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                y: -10,
                height: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              className="mt-2 overflow-hidden rounded-[20px] bg-white p-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)]"
            >
              <div className="flex flex-col">
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

                {/* Mobile appointment */}
                <a
                  href="#appointment"
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#17251a] px-5 py-3 text-sm font-semibold text-white"
                >
                  Appointment
                  <ArrowRight size={15} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
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
        className="flex items-center gap-1 rounded-xl px-3 py-3 text-[13px] font-medium text-gray-700 transition-colors duration-300 hover:bg-[#f3f7ef] hover:text-[#4dbb08]"
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
        <div className="invisible absolute left-0 top-full w-[240px] translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
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