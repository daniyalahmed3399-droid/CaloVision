"use client";

import { motion } from "motion/react";

import ServiceCard from "./ServiceCard";

import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";


const services = [
  {
    image: "/images/service-1.webp",
    title: "Nutritional Counseling",
    description:
      "It is a long established fact that a reader will be distracted.",
  },

  {
    image: "/images/service-2.webp",
    title: "Weight Management",
    description:
      "It is a long established fact that a reader will be distracted.",
  },

  {
    image: "/images/service-3.webp",
    title: "Meal Planning Services",
    description:
      "It is a long established fact that a reader will be distracted.",
  },

  {
    image: "/images/service-4.webp",
    title: "Nutrition Education",
    description:
      "It is a long established fact that a reader will be distracted.",
  },
];


export default function Services() {
  return (
    <section
      id="services"
      className="bg-white px-6 py-24 lg:px-8 lg:py-32"
    >

      <div className="mx-auto max-w-[1320px]">

        {/* =========================
            SECTION HEADING
        ========================= */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >

          <div className="mb-4 flex items-center justify-center gap-3">

            <span className="h-[2px] w-10 bg-green-600" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
              Our Services
            </span>

            <span className="h-[2px] w-10 bg-green-600" />

          </div>


          <h2 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
            The Best Quality Service

            <span className="block text-green-600">
              You Can Get
            </span>
          </h2>

        </motion.div>


        {/* =========================
            SERVICE CARDS
        ========================= */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4"
        >

          {services.map((service) => (
            <ServiceCard
              key={service.title}
              image={service.image}
              title={service.title}
              description={service.description}
            />
          ))}

        </motion.div>

      </div>

    </section>
  );
}
