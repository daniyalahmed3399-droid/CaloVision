"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function MainHero() {
  return (
    <section
      id="home"
      className="relative min-h-[720px] overflow-hidden bg-[#4dbb08]"
    >

      {/* =========================================
          BACKGROUND
      ========================================= */}

      <div className="pointer-events-none absolute inset-0">

        {/* Soft lighting effects */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_85%_50%,rgba(255,255,255,0.08),transparent_35%)]" />

        {/* Darker left side */}

        <div className="absolute left-0 top-0 h-full w-[16%] bg-[#43ad08]/60" />

        {/* Lighter right side */}

        <div className="absolute right-0 top-0 h-full w-[16%] bg-[#55c308]/60" />

      </div>


      {/* =========================================
          LEFT SOCIAL LINKS
      ========================================= */}

      <div className="absolute left-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-7 lg:flex">

        <SocialLink
          icon="X"
          text="TWITTER"
        />

        <SocialLink
          icon="f"
          text="FACEBOOK"
        />

        <SocialLink
          icon="◎"
          text="INSTAGRAM"
        />

      </div>


      {/* =========================================
          LET'S TALK BUTTON
      ========================================= */}

      <motion.a
        href="#ai-coaching"
        whileHover={{
          x: 4,
        }}
        transition={{
          duration: 0.2,
        }}
        className="absolute bottom-24 left-3 z-30 hidden rounded-full bg-white px-3 py-5 text-[10px] font-semibold uppercase tracking-wider text-gray-800 [writing-mode:vertical-rl] lg:block"
      >
        Let&apos;s Talk
      </motion.a>


      {/* =========================================
          HERO CONTENT
      ========================================= */}

      <div className="relative z-10 mx-auto grid min-h-[720px] max-w-[1320px] grid-cols-1 items-center px-6 pt-[130px] lg:grid-cols-2 lg:px-8">


        {/* =========================================
            IMAGE (left on desktop, under the text on mobile)
        ========================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: -70,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="relative order-2 flex h-[420px] items-end justify-center lg:order-1 lg:h-[650px]"
        >

          {/* Decorative circle */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          />


          {/* Main hero woman */}

          <motion.img
            src="/images/main-hero.webp"
            alt="Nutrition and healthy lifestyle"
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: "easeOut",
            }}
            className="relative z-10 h-[390px] w-auto object-contain sm:h-[470px] lg:h-[590px]"
          />

        </motion.div>


        {/* =========================================
            RIGHT CONTENT
        ========================================= */}

        <motion.div
          initial={{
            opacity: 0,
            x: 60,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="relative z-20 order-1 pb-10 text-center lg:order-2 lg:pb-0 lg:pl-4 lg:text-left"
        >

          {/* =====================================
              SCRIPT TITLE
          ===================================== */}

        <motion.p
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: 0.5,
                duration: 0.7,
            }}
            className="font-[Arizona] text-4xl text-yellow-300 sm:text-5xl"
            >
            Best Nutrition
        </motion.p>


          {/* Decorative line */}

          <div className="mx-auto mt-1 h-[2px] w-[180px] bg-yellow-400 lg:mx-0" />


          {/* =====================================
              MAIN HEADING
          ===================================== */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.65,
              duration: 0.8,
            }}
            className="mt-5 max-w-[600px] text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl lg:text-[58px]"
          >
            Fuel Your Body,

            <span className="block">
              Nourish Your Life
            </span>
          </motion.h1>


          {/* =====================================
              DESCRIPTION
          ===================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.85,
              duration: 0.7,
            }}
            className="mx-auto mt-5 max-w-[500px] text-sm leading-6 text-white/90 lg:mx-0"
          >
            Get calorie and macro targets built around your goals, log
            meals, exercise, steps and weight in one place, and plan
            your week with free calculators and an AI coach.
          </motion.p>


          {/* =====================================
              BMI BUTTON (scrolls to the calculator below)
          ===================================== */}

          <motion.a
            href="#bmi"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 1,
              duration: 0.7,
            }}
            whileHover={{
              y: -3,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-2 py-2 pr-5 text-sm font-semibold text-gray-800 shadow-lg"
          >

            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17251a] text-white">
              <ArrowRight size={17} />
            </span>

            Calculate Your BMI

          </motion.a>

        </motion.div>

      </div>


      {/* =========================================
          DECORATIVE LEMON
      ========================================= */}

      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 4, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[7%] top-[40%] hidden lg:block"
      >
        <span className="text-5xl">
          🍋
        </span>
      </motion.div>


      {/* =========================================
          DECORATIVE LEAF
      ========================================= */}

      <motion.div
        animate={{
          y: [0, 8, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-[30%] hidden lg:block"
      >
        <span className="text-5xl">
          🌿
        </span>
      </motion.div>

    </section>
  );
}


/* ==================================================
   SOCIAL LINK COMPONENT
================================================== */

function SocialLink({
  icon,
  text,
}) {
  return (
    <motion.a
      href="#"
      whileHover={{
        scale: 1.05,
      }}
      transition={{
        duration: 0.2,
      }}
      className="flex flex-col items-center gap-2 text-[9px] font-medium tracking-wider text-white/90"
    >

      {/* Social icon */}

      <span className="flex h-5 w-5 items-center justify-center text-xs font-bold">
        {icon}
      </span>


      {/* Vertical label */}

      <span
        style={{
          writingMode: "vertical-rl",
        }}
      >
        {text}
      </span>

    </motion.a>
  );
}