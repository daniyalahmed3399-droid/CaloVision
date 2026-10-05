"use client";

import { motion } from "motion/react";

import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";


/*
  ==================================================
  BLOG DATA
  ==================================================
*/

const blogPosts = [
  {
    image: "/images/blog-1.webp",

    title: "Healthy Eating Habits for a Better Life",

    description:
      "Discover simple and practical nutrition habits that can help you build a healthier and more balanced lifestyle.",

    date: "17 May 2026",

    author: "Nashid Martines",
  },

  {
    image: "/images/blog-2.webp",

    title: "Discover the Power of Balanced Daily Nutrition",

    description:
      "Learn how balanced daily nutrition can support your energy, wellness, and long-term health goals.",

    date: "17 May 2026",

    author: "Nashid Martines",
  },

  {
    image: "/images/blog-3.webp",

    title: "Eat Well, Live Strong, Stay Energized Always",

    description:
      "Explore healthy food choices and simple strategies for maintaining energy throughout your day.",

    date: "17 May 2026",

    author: "Nashid Martines",
  },
];


export default function Blog() {

  return (
    <section
      id="blog"
      className="overflow-hidden bg-white px-6 py-24 lg:px-8 lg:py-32"
    >

      <div className="mx-auto max-w-[1320px]">


        {/* ==================================================
            SECTION HEADER
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
            amount: 0.3,
          }}

          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}

          className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >

          {/* LEFT SIDE */}

          <div>

            <div className="mb-5 flex items-center gap-3">

              <span className="h-[2px] w-10 bg-green-600" />

              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-green-600">
                Our Services
              </span>

            </div>


            <h2 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

              News And

              <span className="block text-green-600">
                Update
              </span>

            </h2>

          </div>


          {/* VIEW ALL POSTS */}

          <motion.a
            href="#"
            whileHover={{
              y: -4,
              x: 4,
            }}

            whileTap={{
              scale: 0.97,
            }}

            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
            }}

            className="group inline-flex items-center gap-3 self-start rounded-full border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors duration-300 hover:border-green-600 hover:bg-green-600 hover:text-white md:self-auto"
          >

            View All Post

            <motion.span
              className="text-lg"
              whileHover={{
                x: 5,
              }}
            >
              →
            </motion.span>

          </motion.a>

        </motion.div>



        {/* ==================================================
            BLOG CARDS
        ================================================== */}

        <motion.div
          variants={staggerContainer}

          initial="hidden"

          whileInView="visible"

          viewport={{
            once: true,
            amount: 0.15,
          }}

          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >

          {blogPosts.map((post, index) => (

            <BlogCard
              key={post.title}
              post={post}
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
  BLOG CARD
  ==================================================
*/

function BlogCard({
  post,
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

      className="group overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
    >


      {/* ==================================================
          IMAGE
      ================================================== */}

      <div className="relative h-[280px] overflow-hidden">

        <motion.img
          src={post.image}

          alt={post.title}

          whileHover={{
            scale: 1.08,
          }}

          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}

          className="h-full w-full object-cover"
        />


        {/* Image overlay */}

        <motion.div
          className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10"
        />


        {/* Date badge */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          viewport={{
            once: true,
          }}

          transition={{
            duration: 0.5,
            delay: index * 0.1 + 0.2,
          }}

          className="absolute bottom-5 left-5 rounded-xl bg-white px-4 py-2 shadow-lg"
        >

          <span className="text-xs font-semibold text-gray-700">
            {post.date}
          </span>

        </motion.div>

      </div>



      {/* ==================================================
          CONTENT
      ================================================== */}

      <div className="p-7">


        {/* Title */}

        <motion.a
          href="#"

          className="block"

          whileHover={{
            x: 4,
          }}

          transition={{
            duration: 0.25,
          }}
        >

          <h3 className="text-xl font-bold leading-snug text-gray-900 transition-colors duration-300 group-hover:text-green-600">
            {post.title}
          </h3>

        </motion.a>


        {/* Description */}

        <p className="mt-4 text-sm leading-7 text-gray-600">
          {post.description}
        </p>


        {/* ==================================================
            AUTHOR
        ================================================== */}

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

          <div className="flex items-center gap-2">

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
              N
            </span>

            <span className="text-xs font-medium text-gray-500">
              By {post.author}
            </span>

          </div>


          {/* Arrow */}

          <motion.a
            href="#"

            whileHover={{
              x: 5,
            }}

            whileTap={{
              scale: 0.9,
            }}

            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 transition-colors duration-300 hover:bg-green-600 hover:text-white"
          >
            →
          </motion.a>

        </div>

      </div>

    </motion.article>

  );
}