"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

import {
  fadeUp,
  scaleIn,
} from "./animations/motionVariants";


const slides = [
  {
    image: "/images/weight-loss-1.webp",
  },

  {
    image: "/images/weight-loss-2.webp",
  },

  {
    image: "/images/weight-loss-3.webp",
  },
];


export default function WeightLoss() {

  const sliderRef = useRef(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const [startX, setStartX] =
    useState(0);

  const [scrollLeft, setScrollLeft] =
    useState(0);


  /*
    =========================
    MOUSE DOWN
    =========================
  */

  const handleMouseDown = (e) => {

    if (!sliderRef.current) return;

    setIsDragging(true);

    setStartX(
      e.pageX -
        sliderRef.current.offsetLeft
    );

    setScrollLeft(
      sliderRef.current.scrollLeft
    );
  };


  /*
    =========================
    MOUSE MOVE
    =========================
  */

  const handleMouseMove = (e) => {

    if (
      !isDragging ||
      !sliderRef.current
    ) {
      return;
    }

    e.preventDefault();

    const x =
      e.pageX -
      sliderRef.current.offsetLeft;

    const walk =
      (x - startX) * 1.5;

    sliderRef.current.scrollLeft =
      scrollLeft - walk;
  };


  /*
    =========================
    STOP DRAGGING
    =========================
  */

  const stopDragging = () => {
    setIsDragging(false);
  };


  /*
    Touch devices use the browser's native horizontal swipe
    (with scroll snapping on small screens), so only mouse
    dragging is handled in JavaScript.
  */

  return (
    <section
      className="
        overflow-hidden
        bg-[#f7f9f3]
        py-24
        lg:py-32
      "
    >

      {/* =========================
          TEXT CONTENT
      ========================= */}

      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">

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

          {/* Label */}

          <div className="mb-5 flex items-center justify-center gap-3">

            <span className="h-[2px] w-10 bg-green-600" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
              Our Services
            </span>

            <span className="h-[2px] w-10 bg-green-600" />

          </div>


          {/* Heading */}

          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

            Your Body Changing With

            <span className="block text-green-600">
              Weight Loss Program
            </span>

          </h2>


          {/* Description */}

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Build healthier habits with practical nutrition guidance,
            sustainable strategies, and a personalized approach designed
            around your goals.
          </p>

        </motion.div>

      </div>


      {/* =========================
          FULL-WIDTH DRAG GALLERY
      ========================= */}

      <motion.div
        ref={sliderRef}

        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}

        initial={{
          opacity: 0,
          y: 50,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        viewport={{
          once: true,
          amount: 0.15,
        }}

        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}

        className={`
          hide-scrollbar
          mt-16
          flex
          gap-6
          snap-x
          snap-mandatory
          scroll-px-6
          overflow-x-auto
          select-none
          px-6
          lg:snap-none
          lg:px-8

          ${
            isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
          }
        `}
      >

        {slides.map((slide, index) => (

          <motion.div
            key={index}

            initial={{
              opacity: 0,
              scale: 0.95,
            }}

            whileInView={{
              opacity: 1,
              scale: 1,
            }}

            viewport={{
              once: true,
            }}

            transition={{
              duration: 0.7,
              delay: index * 0.12,
            }}

            whileHover={{
              scale: 1.01,
            }}

            className="
              w-[85vw]
              shrink-0
              snap-start
              overflow-hidden

              sm:w-[65vw]

              lg:w-[48vw]
            "
          >

            <img
              src={slide.image}
              alt={`Weight loss transformation ${index + 1}`}
              draggable="false"

              className="
                pointer-events-none
                aspect-[1125/825]
                w-full
                object-cover

                sm:aspect-auto
                sm:h-[560px]

                lg:h-[650px]
              "
            />

          </motion.div>

        ))}

      </motion.div>

    </section>
  );
}
