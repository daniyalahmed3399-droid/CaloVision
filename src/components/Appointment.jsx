"use client";

import { motion } from "motion/react";

import { fadeUp } from "./animations/motionVariants";

export default function Appointment() {
  return (
    <section
      id="appointment"
      className="relative overflow-hidden bg-[#eaf3e2] px-6 py-20 lg:px-8 lg:py-24"
    >
      {/* =========================================
          DECORATIVE BACKGROUND CIRCLES
      ========================================= */}

      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full border-[40px] border-white/40"
      />

      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="pointer-events-none absolute -bottom-32 -left-20 h-[280px] w-[280px] rounded-full border-[35px] border-green-600/10"
      />

      {/* =========================================
          CONTENT
      ========================================= */}

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.3,
        }}
        className="relative z-10 mx-auto max-w-[1000px] text-center"
      >
        {/* Small heading */}

        <div className="mb-5 flex items-center justify-center gap-3">
          <span className="h-[2px] w-10 bg-green-600" />

          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
            Appointment
          </span>

          <span className="h-[2px] w-10 bg-green-600" />
        </div>

        {/* Main heading */}

        <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Want To Schedule
          <span className="block text-green-600">
            An Appointment?
          </span>
        </h2>

        {/* Description */}

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
          Take the first step toward a healthier lifestyle with
          personalized nutrition guidance and professional support.
        </p>

        {/* Button */}

        <motion.a
          href="#"
          whileHover={{
            y: -5,
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.97,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 18,
          }}
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-green-600 px-8 py-4 text-sm font-semibold text-white shadow-lg"
        >
          Read More

          <motion.span
            whileHover={{
              x: 5,
            }}
            className="text-lg"
          >
            →
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}