"use client";

import { motion } from "motion/react";

import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";


/*
  ==================================================
  VIDEO TESTIMONIAL DATA
  ==================================================
*/

const testimonials = [
  {
    image: "/images/testimonial-1.webp",
    name: "Kenneth Fong",
    role: "Postgraduate Student",
  },

  {
    image: "/images/testimonial-2.webp",
    name: "Kenneth Fong",
    role: "Postgraduate Student",
  },

  {
    image: "/images/testimonial-3.webp",
    name: "Kenneth Fong",
    role: "Postgraduate Student",
  },
];


export default function VideoTestimonials() {
  return (
    <section className="overflow-hidden bg-[#f7f9f3] px-6 py-24 lg:px-8 lg:py-32">

      <div className="mx-auto max-w-[1320px]">


        {/* =========================================
            SECTION HEADER
        ========================================= */}

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

          <div className="mb-5 flex items-center justify-center gap-3">

            <span className="h-[2px] w-10 bg-green-600" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
              Testimonials
            </span>

            <span className="h-[2px] w-10 bg-green-600" />

          </div>


          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

            Video

            <span className="block text-green-600">
              Testimonials
            </span>

          </h2>


          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Hear directly from people who have made positive changes
            to their health and lifestyle.
          </p>

        </motion.div>



        {/* =========================================
            TESTIMONIAL CARDS
        ========================================= */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
        >

          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
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
  TESTIMONIAL CARD
  ==================================================
*/

function TestimonialCard({
  testimonial,
  index,
}) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{
        y: -10,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="group relative overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
    >

      {/* =========================================
          IMAGE
      ========================================= */}

      <div className="relative h-[420px] overflow-hidden">

        <motion.img
          src={testimonial.image}
          alt={`${testimonial.name} testimonial`}
          whileHover={{
            scale: 1.06,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          className="h-full w-full object-cover"
        />


        {/* Dark overlay */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />


        {/* =========================================
            PLAY BUTTON
        ========================================= */}

        <motion.button
          type="button"
          whileHover={{
            scale: 1.12,
          }}
          whileTap={{
            scale: 0.92,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 15,
          }}
          className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-600 shadow-xl"
          aria-label={`Play ${testimonial.name}'s testimonial`}
        >

          <span className="ml-1 text-xl">
            ▶
          </span>

        </motion.button>


        {/* =========================================
            TESTIMONIAL INFORMATION
        ========================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: index * 0.12 + 0.2,
            duration: 0.5,
          }}
          className="absolute bottom-0 left-0 right-0 p-7"
        >

          <h3 className="text-xl font-bold text-white">
            {testimonial.name}
          </h3>

          <p className="mt-1 text-sm text-white/80">
            {testimonial.role}
          </p>

        </motion.div>

      </div>

    </motion.article>
  );
}