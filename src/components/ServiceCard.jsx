"use client";

import { motion } from "motion/react";

import {
  fadeUp,
} from "./animations/motionVariants";

export default function ServiceCard({
  image,
  title,
  description,
}) {
  return (
    <motion.article
      variants={fadeUp}

      /*
        Card moves upward slightly
        when hovered.
      */
      whileHover={{
        y: -10,
      }}

      transition={{
        type: "spring",
        stiffness: 250,
        damping: 20,
      }}

      className="group overflow-hidden rounded-[20px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
    >

      {/* =========================
          IMAGE
      ========================= */}

      <div className="relative h-[250px] overflow-hidden">

        <motion.img
          src={image}
          alt={title}

          /*
            Image zooms slightly
            when the card is hovered.
          */
          whileHover={{
            scale: 1.1,
          }}

          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}

          className="h-full w-full object-cover"
        />

        {/* Image overlay */}

        <motion.div
          initial={{
            opacity: 0,
          }}

          whileHover={{
            opacity: 1,
          }}

          transition={{
            duration: 0.3,
          }}

          className="absolute inset-0 bg-black/10"
        />

      </div>


      {/* =========================
          CONTENT
      ========================= */}

      <div className="p-7">

        <motion.h3
          whileHover={{
            x: 3,
          }}

          className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-green-600"
        >
          {title}
        </motion.h3>


        <p className="mt-4 text-sm leading-7 text-gray-600">
          {description}
        </p>


        {/* Details link */}

        <motion.a
          href="#"
          whileHover={{
            x: 4,
          }}

          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-900 transition-colors duration-300 hover:text-green-600"
        >
          View All Details

          <motion.span
            whileHover={{
              x: 5,
            }}

            className="text-lg"
          >
            →
          </motion.span>

        </motion.a>

      </div>

    </motion.article>
  );
}
