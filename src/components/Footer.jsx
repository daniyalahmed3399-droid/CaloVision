"use client";

import { motion } from "motion/react";

import {
  fadeUp,
  staggerContainer,
} from "./animations/motionVariants";

export default function Footer() {
  const supportLinks = [
    "Help Center",
    "Privacy Policy",
    "Terms & Conditions",
    "Contact Us",
  ];

  const usefulLinks = [
    "About Us",
    "Our Services",
    "Pricing",
    "Blog",
  ];

  return (
    <footer className="overflow-hidden bg-[#151b16] text-white">

      {/* =========================================
          MAIN FOOTER
      ========================================= */}

      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8 lg:py-24">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
        >

          {/* =========================================
              COLUMN 1 - LOGO / DESCRIPTION
          ========================================= */}

          <motion.div variants={fadeUp}>

            <a
              href="#"
              className="text-3xl font-bold tracking-tight"
            >
              Calo
              <span className="text-green-500">
                Vision
              </span>
            </a>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Transforming lives through better nutrition,
              healthier habits, and personalized guidance
              designed around your goals.
            </p>

            {/* Social buttons */}

            <div className="mt-7 flex gap-3">

              <SocialButton>
                f
              </SocialButton>

              <SocialButton>
                in
              </SocialButton>

              <SocialButton>
                X
              </SocialButton>

              <SocialButton>
                ◎
              </SocialButton>

            </div>

          </motion.div>


          {/* =========================================
              COLUMN 2 - SUPPORT
          ========================================= */}

          <motion.div variants={fadeUp}>

            <h3 className="text-lg font-bold">
              Support
            </h3>

            <ul className="mt-6 space-y-4">

              {supportLinks.map((link) => (
                <FooterLink
                  key={link}
                  text={link}
                />
              ))}

            </ul>

          </motion.div>


          {/* =========================================
              COLUMN 3 - USEFUL LINKS
          ========================================= */}

          <motion.div variants={fadeUp}>

            <h3 className="text-lg font-bold">
              Useful Links
            </h3>

            <ul className="mt-6 space-y-4">

              {usefulLinks.map((link) => (
                <FooterLink
                  key={link}
                  text={link}
                />
              ))}

            </ul>

          </motion.div>


          {/* =========================================
              COLUMN 4 - CONTACT
          ========================================= */}

          <motion.div variants={fadeUp}>

            <h3 className="text-lg font-bold">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5">

              {/* Phone */}

              <ContactItem
                icon="☎"
                title="Phone"
                text="+1 123 456 7890"
              />

              {/* Email */}

              <ContactItem
                icon="✉"
                title="Email"
                text="info@calovision.com"
              />

              {/* Address */}

              <ContactItem
                icon="⌖"
                title="Address"
                text="123 Nutrition Street, New York"
              />

            </div>

          </motion.div>

        </motion.div>

      </div>


      {/* =========================================
          BOTTOM BAR
      ========================================= */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-6 text-center sm:flex-row sm:text-left lg:px-8">

          <p className="text-sm text-gray-500">
            © 2026 CaloVision. All Rights Reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">

            <a
              href="#"
              className="transition-colors duration-300 hover:text-green-500"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition-colors duration-300 hover:text-green-500"
            >
              Terms & Conditions
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}


/* ==================================================
   FOOTER LINK
================================================== */

function FooterLink({ text }) {
  return (
    <motion.li
      whileHover={{
        x: 5,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <a
        href="#"
        className="text-sm text-gray-400 transition-colors duration-300 hover:text-green-500"
      >
        {text}
      </a>
    </motion.li>
  );
}


/* ==================================================
   SOCIAL BUTTON
================================================== */

function SocialButton({ children }) {
  return (
    <motion.a
      href="#"
      whileHover={{
        y: -4,
        scale: 1.08,
      }}
      whileTap={{
        scale: 0.9,
      }}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 transition-colors duration-300 hover:border-green-500 hover:bg-green-600 hover:text-white"
    >
      {children}
    </motion.a>
  );
}


/* ==================================================
   CONTACT ITEM
================================================== */

function ContactItem({
  icon,
  title,
  text,
}) {
  return (
    <motion.div
      whileHover={{
        x: 4,
      }}
      className="flex items-start gap-4"
    >

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-500">
        {icon}
      </div>

      <div>

        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-400">
          {text}
        </p>

      </div>

    </motion.div>
  );
}