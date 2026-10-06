"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { billingYearlySet } from "../lib/store/slices/uiSlice";
import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";


/*
  ==================================================
  PRICING DATA
  ==================================================
*/

const pricingPlans = [
  {
    title: "Post Pregnancy",

    monthly: "$20",
    yearly: "$999",

    badge: "Popular",

    description:
      "For most businesses that want to optimize web queries",

    features: [
      "With 7 day free trial",
      "Nutrition Strategies",
      "Health diet plan",
      "Motivation program",
      "24/7 Support",
    ],
  },

  {
    title: "Weight Loss",

    monthly: "$100",
    yearly: "$1599",

    badge: "Most Popular",

    description:
      "For most businesses that want to optimize web queries",

    features: [
      "With 7 day free trial",
      "Nutrition Strategies",
      "Health diet plan",
      "Motivation program",
      "24/7 Support",
    ],
  },

  {
    title: "Body Sculpting",

    monthly: "$50",
    yearly: "$1049",

    badge: "Professional",

    description:
      "For most businesses that want to optimize web queries",

    features: [
      "With 7 day free trial",
      "Nutrition Strategies",
      "Health diet plan",
      "Motivation program",
      "24/7 Support",
    ],
  },
];


export default function Pricing() {

  /*
    ==================================================
    MONTHLY / YEARLY STATE
    ==================================================

    false = Monthly
    true  = Yearly
  */

  const dispatch = useAppDispatch();
  const isYearly = useAppSelector((state) => state.ui.billingYearly);
  const setIsYearly = (yearly) => dispatch(billingYearlySet(yearly));


  return (
    <section
      id="pricing"
      className="overflow-hidden bg-white px-6 py-24 lg:px-8 lg:py-32"
    >

      <div className="mx-auto max-w-[1320px]">


        {/* ==================================================
            SECTION HEADING
        ================================================== */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mx-auto max-w-3xl text-center"
        >

          {/* Small heading */}

          <div className="mb-5 flex items-center justify-center gap-3">

            <span className="h-[2px] w-10 bg-[#4dbb08]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4dbb08]">
              Pricing
            </span>

            <span className="h-[2px] w-10 bg-[#4dbb08]" />

          </div>


          {/* Main heading */}

          <h2 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

            Choose Your

            <span className="block text-[#4dbb08]">
              Perfect Plan
            </span>

          </h2>


          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Choose a nutrition plan that fits your goals and lifestyle.
            Start building healthier habits with the right support.
          </p>

        </motion.div>



        {/* ==================================================
            MONTHLY / YEARLY SWITCH
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-10 flex justify-center"
        >

          <div className="relative flex rounded-full border border-gray-200 bg-gray-100 p-1">

            {/* Moving green background */}

            <motion.div
              layout
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className={`absolute top-1 bottom-1 w-[105px] rounded-full bg-[#4dbb08] ${
                isYearly
                  ? "left-[106px]"
                  : "left-1"
              }`}
            />


            {/* Monthly button */}

            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`relative z-10 w-[105px] rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300 ${
                !isYearly
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>


            {/* Yearly button */}

            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`relative z-10 w-[105px] rounded-full px-5 py-3 text-sm font-semibold transition-colors duration-300 ${
                isYearly
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
            </button>

          </div>

        </motion.div>



        {/* ==================================================
            PRICING CARDS
        ================================================== */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="mt-16 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
        >

          {pricingPlans.map((plan, index) => (

            <PricingCard
              key={plan.title}
              plan={plan}
              isYearly={isYearly}
              index={index}
            />

          ))}

        </motion.div>

      </div>

    </section>
  );
}



/*
  ==================================================
  PRICING CARD
  ==================================================
*/

function PricingCard({
  plan,
  isYearly,
  index,
}) {

  const [isHovered, setIsHovered] = useState(false);


  return (

    <motion.article
      variants={fadeUp}

      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}

      whileHover={{
        y: -12,
        scale: 1.025,
      }}

      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}

      className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.05)] sm:p-10"
    >


      {/* ==================================================
          TOP GREEN DECORATION
      ================================================== */}

      <motion.div
        initial={{
          width: "0%",
        }}

        whileHover={{
          width: "100%",
        }}

        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}

        className="absolute left-0 top-0 h-1 bg-[#4dbb08]"
      />



      {/* ==================================================
          HOVER BADGE
      ================================================== */}

      <AnimatePresence>

        {isHovered && (

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              scale: 0.8,
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}

            exit={{
              opacity: 0,
              y: -15,
              scale: 0.8,
            }}

            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}

            className="absolute right-6 top-6 rounded-full bg-[#4dbb08] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg"
          >
            {plan.badge}
          </motion.div>

        )}

      </AnimatePresence>



      {/* ==================================================
          PLAN TITLE
      ================================================== */}

      <motion.h3
        animate={{
          x: isHovered ? 4 : 0,
        }}

        transition={{
          duration: 0.3,
        }}

        className="text-2xl font-bold text-gray-900"
      >
        {plan.title}
      </motion.h3>



      {/* ==================================================
          DESCRIPTION
      ================================================== */}

      <p className="mt-4 min-h-[56px] text-sm leading-7 text-gray-600">
        {plan.description}
      </p>



      {/* ==================================================
          PRICE
      ================================================== */}

      <div className="relative mt-8 min-h-[85px]">

        <AnimatePresence mode="wait">

          <motion.div
            key={isYearly ? "yearly" : "monthly"}

            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              y: -20,
            }}

            transition={{
              duration: 0.3,
            }}
          >

            <div className="flex items-end gap-2">

              <span className="text-5xl font-bold tracking-tight text-gray-900">
                {isYearly
                  ? plan.yearly
                  : plan.monthly}
              </span>

              <span className="mb-2 text-sm font-medium text-gray-500">
                / {isYearly ? "Yearly" : "Monthly"}
              </span>

            </div>

          </motion.div>

        </AnimatePresence>

      </div>



      {/* ==================================================
          DIVIDER
      ================================================== */}

      <div className="my-7 h-px bg-gray-200" />



      {/* ==================================================
          FEATURES
      ================================================== */}

      <ul className="space-y-4">

        {plan.features.map((feature, featureIndex) => (

          <motion.li
            key={feature}

            initial={{
              opacity: 0,
              x: -10,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.4,
              delay:
                index * 0.1 +
                featureIndex * 0.06,
            }}

            className="flex items-center gap-3 text-sm text-gray-600"
          >

            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e7f2df] text-xs font-bold text-[#4dbb08]">
              ✓
            </span>

            {feature}

          </motion.li>

        ))}

      </ul>



      {/* ==================================================
          CHOOSE PLAN BUTTON
      ================================================== */}

      <motion.a
        href="/signup"

        whileHover={{
          scale: 1.03,
          y: -2,
        }}

        whileTap={{
          scale: 0.97,
        }}

        transition={{
          type: "spring",
          stiffness: 300,
          damping: 18,
        }}

        className="mt-9 flex w-full items-center justify-center gap-2 rounded-full border border-gray-900 px-6 py-4 text-sm font-semibold text-gray-900 transition-colors duration-300 hover:border-[#4dbb08] hover:bg-[#4dbb08] hover:text-white"
      >

        Choose Plan

        <motion.span
          whileHover={{
            x: 5,
          }}
        >
          →
        </motion.span>

      </motion.a>


    </motion.article>

  );
}