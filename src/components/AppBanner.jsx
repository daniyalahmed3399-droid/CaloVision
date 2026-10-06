"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { fadeUp } from "./animations/motionVariants";

// The banner image already contains its own headline, so on tablets and
// desktops it is shown whole. On phones that baked-in text would shrink to
// about 5px, so there the image is cropped to just the app screens and the
// same message is shown as real text in the site's fonts.
//
// (The image file is named .webp but is really a PNG; browsers and the Next
// image optimizer both handle that, and the optimizer serves a smaller
// converted copy to visitors.)

const BANNER = "/images/CaloVisionCSBanner.webp";
const IMAGE_WIDTH = 1874;
const IMAGE_HEIGHT = 839;

// The area of the image shown on phones, in image pixels: just the two phones
// and the circle behind them.
const CROP = { x: 60, y: 30, width: 860, height: 760 };

export default function AppBanner() {
  return (
    <section
      id="get-the-app"
      className="bg-[#f7f9f3] px-6 py-16 lg:px-8 lg:py-24"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-[1320px]"
      >
        {/* ===== Tablet / desktop: the whole banner ===== */}

        <div className="hidden rounded-[28px] bg-[#4dbb08] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:block lg:p-4">
          <div className="overflow-hidden rounded-[20px] lg:rounded-[24px]">
            <Image
              src={BANNER}
              alt="CaloVision app screens showing a progress report and a calorie and macro summary"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              sizes="(min-width: 1320px) 1320px, 100vw"
              quality={90}
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* ===== Phone: cropped screens + real text ===== */}

        <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f3f7ef] to-[#e7f2df] shadow-[0_20px_60px_rgba(0,0,0,0.1)] md:hidden">
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `${CROP.width} / ${CROP.height}` }}
          >
            <Image
              src={BANNER}
              alt="CaloVision app screens showing a progress report and a calorie and macro summary"
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
              sizes="760px"
              quality={90}
              className="absolute"
              style={{
                // Inline because globals.css has an unlayered
                // `img { max-width: 100% }` that beats Tailwind's max-w-none.
                maxWidth: "none",
                width: `${(IMAGE_WIDTH / CROP.width) * 100}%`,
                height: "auto",
                left: `${-(CROP.x / CROP.width) * 100}%`,
                top: `${-(CROP.y / CROP.height) * 100}%`,
              }}
            />
          </div>

          <div className="px-6 pb-8 pt-5 text-center">
            <p className="text-sm font-semibold text-[#4dbb08]">
              Let’s Download CaloVision
            </p>

            <h2 className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-tight text-[#17251a]">
              Start Your
              <span className="block">Transformation Today!</span>
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-600">
              Download Calo AI on your preferred platform and take control of your
              health powered by intelligent AI.
            </p>

            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#4dbb08] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#3c9705]"
            >
              Get Started Free
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        {/* Tablet/desktop: the banner image carries the headline visually, so
            this is the section's heading for screen readers only. */}
        <h2 className="sr-only hidden md:block">
          Start your transformation today.
        </h2>
      </motion.div>
    </section>
  );
}
