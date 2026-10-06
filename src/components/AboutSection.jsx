"use client";

import { motion } from "motion/react";

import {
  fadeLeft,
  fadeRight,
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";

export default function Hero() {
  const features = [
    "Nutrition program",
    "Daily recipes",
    "Consultation",
    "Support 24/7",
  ];

  return (
    <section className="relative overflow-hidden bg-[#f7f9f3]">

      {/* =========================================
          BACKGROUND DECORATION
      ========================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-[180px] top-[40px] h-[560px] w-[560px] rounded-full bg-[#e9f1e2]" />

        <div className="absolute -left-[160px] bottom-[-220px] h-[420px] w-[420px] rounded-full bg-[#edf4e8]" />
      </div>


      {/* =========================================
          HERO CONTAINER
      ========================================= */}

      <div className="relative mx-auto grid min-h-[650px] max-w-[1320px] grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-12">

        {/* =========================================
            LEFT CONTENT
        ========================================= */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          className="relative z-20 max-w-[610px]"
        >

          <motion.div
            variants={fadeLeft}
            className="mb-5 flex items-center gap-3"
          >
            <span className="h-[2px] w-10 bg-[#4dbb08]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4dbb08]">
              About Us
            </span>
          </motion.div>


          <motion.h1
            variants={fadeUp}
            className="max-w-[600px] text-[44px] font-bold leading-[1.08] tracking-[-0.035em] text-gray-900 sm:text-[52px] lg:text-[62px]"
          >
            Transforming Lives

            <span className="block text-[#4dbb08]">
              Through Nutrition
            </span>
          </motion.h1>


          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-[520px] text-[15px] leading-7 text-gray-600"
          >
            CaloVision turns your goals into a simple daily plan. Tell us
            about yourself and we set your calorie and macro targets, then
            help you track meals, activity and progress and stay on course
            with guidance from our AI coach.
          </motion.p>


          <motion.div
            variants={fadeUp}
            className="mt-7 grid max-w-[520px] grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2"
          >
            {features.map((feature) => (
              <motion.div
                key={feature}
                whileHover={{
                  x: 5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="flex items-center gap-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e7f2df] text-xs font-bold text-[#4dbb08]">
                  ✓
                </span>

                <span className="text-sm font-medium text-gray-700">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>


          <motion.div
            variants={fadeUp}
            className="mt-8"
          >
            <motion.a
              href="#ai-coaching"
              whileHover={{
                y: -4,
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="inline-flex items-center gap-3 rounded-full bg-[#4dbb08] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(34,197,94,0.15)]"
            >
              Read More

              <span className="text-lg">
                →
              </span>
            </motion.a>
          </motion.div>

        </motion.div>


        {/* =========================================
            RIGHT HERO VISUAL
        ========================================= */}

        <motion.div
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          className="relative flex min-h-[500px] items-center justify-center lg:min-h-[580px]"
        >

          {/* =====================================
              ROTATING BACKGROUND
          ===================================== */}

          <motion.img
            src="/images/hero-bg.png"
            alt=""
            initial={{
              opacity: 0,
              scale: 0.75,
              rotate: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 360,
            }}
            transition={{
              opacity: {
                duration: 0.8,
              },

              scale: {
                duration: 0.9,
                ease: "easeOut",
              },

              rotate: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
              },
            }}
            className="pointer-events-none absolute h-[390px] w-[390px] object-contain sm:h-[430px] sm:w-[430px] lg:h-[470px] lg:w-[470px]"
          />


          {/* =====================================
              SMALL CIRCULAR HERO IMAGE
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="relative z-10 h-[270px] w-[270px] overflow-hidden rounded-full border-[10px] border-white bg-white shadow-[0_20px_50px_rgba(0,0,0,0.14)] sm:h-[310px] sm:w-[310px] lg:h-[350px] lg:w-[350px]"
          >

            <motion.img
              src="/images/hero.webp"
              alt="Healthy nutrition"
              animate={{
                scale: [1, 1.025, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-full w-full object-cover"
            />

          </motion.div>


          {/* =====================================
              FLOATING INFO CARD
          ===================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -25,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.6,
              duration: 0.6,
            }}
            className="absolute bottom-6 left-0 z-20 rounded-2xl bg-white p-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:left-4"
          >

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e7f2df] text-lg font-bold text-[#4dbb08]">
                ✓
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Healthy Lifestyle
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  One step at a time
                </p>
              </div>
            </motion.div>

          </motion.div>

        </motion.div>

      </div>

    </section>
  );
}