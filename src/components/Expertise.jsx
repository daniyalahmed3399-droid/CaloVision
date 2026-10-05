"use client";

import { motion } from "motion/react";

import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";


const expertise = [
  {
    number: "01",
    title: "Child Nutrition",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
    count: "25+",
  },

  {
    number: "02",
    title: "Personal Coaching",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
    count: "25+",
  },

  {
    number: "03",
    title: "Sports Nutritionist",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
    count: "25+",
  },

  {
    number: "04",
    title: "Fitness Performance",
    description:
      "It is a long established fact that a reader will be distracted by the readable content.",
    count: "25+",
  },
];


export default function Expertise() {
  return (
    <section
      id="expertise"
      className="bg-white px-6 py-24 lg:px-8 lg:py-32"
    >

      <div className="mx-auto max-w-[1320px]">

        {/* =========================
            HEADING
        ========================= */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >

          <div className="mb-4 flex items-center justify-center gap-3">

            <span className="h-[2px] w-10 bg-green-600" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
              Our Services
            </span>

            <span className="h-[2px] w-10 bg-green-600" />

          </div>


          <h2 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">

            Our Main Areas of

            <span className="block text-green-600">
              Expertise
            </span>

          </h2>

        </motion.div>


        {/* =========================
            EXPERTISE CARDS
        ========================= */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
        >

          {expertise.map((item) => (

            <motion.article
              key={item.number}
              variants={fadeUp}

              whileHover={{
                y: -10,
              }}

              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
              }}

              className="group relative overflow-hidden rounded-[24px] bg-[#f7f9f3] p-7 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >

              {/* Large background number */}

              <motion.span
                initial={{
                  opacity: 0.2,
                }}

                whileHover={{
                  opacity: 0.45,
                  scale: 1.05,
                }}

                className="absolute -right-2 -top-5 text-[100px] font-bold leading-none text-green-600/5"
              >
                {item.number}
              </motion.span>


              {/* Number badge */}

              <motion.div
                whileHover={{
                  scale: 1.12,
                  rotate: 5,
                }}

                transition={{
                  type: "spring",
                  stiffness: 300,
                }}

                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white"
              >
                {item.number}
              </motion.div>


              {/* Title */}

              <h3 className="relative mt-7 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600">
                {item.title}
              </h3>


              {/* Description */}

              <p className="relative mt-4 text-sm leading-7 text-gray-600">
                {item.description}
              </p>


              {/* Bottom information */}

              <div className="relative mt-7 border-t border-gray-200 pt-5">

                <motion.p
                  whileHover={{
                    x: 4,
                  }}
                  className="text-2xl font-bold text-gray-900"
                >
                  {item.count}
                </motion.p>

                <p className="mt-1 text-xs font-medium text-gray-500">
                  Doctor
                </p>

              </div>

            </motion.article>

          ))}

        </motion.div>

      </div>

    </section>
  );
}

