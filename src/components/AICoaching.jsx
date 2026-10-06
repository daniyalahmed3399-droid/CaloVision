"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  HeartPulse,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { fadeUp, staggerContainer } from "./animations/motionVariants";
import { useAuth } from "../lib/store/useAuth";

// One section for everything about the AI coaching service: what it does
// (replaces the old expertise cards), an example conversation and sample
// questions (replaces the blog), and the sign-up call to action (replaces
// the appointment banner).

const benefits = [
  {
    icon: MessageCircle,
    title: "Ask Anything About Food",
    description:
      "Get clear, simple answers about meals, ingredients and healthy swaps whenever a question comes up.",
  },
  {
    icon: Target,
    title: "Built Around Your Goals",
    description:
      "Guidance follows your calorie target, activity level and whether you want to lose, maintain or gain weight.",
  },
  {
    icon: Sparkles,
    title: "Practical Daily Ideas",
    description:
      "Turn what you've eaten so far into easy suggestions for your next meal or snack.",
  },
  {
    icon: HeartPulse,
    title: "Steady Motivation",
    description:
      "Encouragement and simple habit tips to help you stay consistent, one day at a time.",
  },
];

const sampleQuestions = [
  "What's a high-protein breakfast I can make in 10 minutes?",
  "I'm over my calories today. What should dinner look like?",
  "Can you suggest a lighter swap for white rice?",
];

export default function AICoaching() {
  const { status } = useAuth();
  const loggedIn = status === "authenticated";

  return (
    <section
      id="ai-coaching"
      className="relative overflow-hidden bg-white px-6 py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px]">
        {/* ==================== HEADING ==================== */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-[2px] w-10 bg-[#4dbb08]" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4dbb08]">
              AI Coaching
            </span>

            <span className="h-[2px] w-10 bg-[#4dbb08]" />
          </div>

          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Your Personal Nutrition
            <span className="block text-[#4dbb08]">Coach, Anytime</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600">
            Chat with an AI coach that understands your goals and helps you
            make better food choices every day, without waiting for an
            appointment.
          </p>
        </motion.div>

        {/* ============ BENEFITS + EXAMPLE CHAT ============ */}

        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {benefits.map(({ icon: Icon, title, description }) => (
              <motion.li
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="rounded-[24px] bg-[#f7f9f3] p-7 transition-colors hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4dbb08] text-white">
                  <Icon size={22} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {description}
                </p>
              </motion.li>
            ))}
          </motion.ul>

          {/* Example conversation */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative overflow-hidden rounded-[28px] bg-[#17251a] p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-[30px] border-white/5" />

            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#4dbb08]">
                <Bot size={22} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
                  Example conversation
                </p>
                <p className="text-sm font-bold">CaloVision AI Coach</p>
              </div>
            </div>

            <div className="relative mt-6 space-y-3">
              <p className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#4dbb08] px-4 py-3 text-sm leading-6">
                {sampleQuestions[0]}
              </p>

              <p className="max-w-[90%] rounded-2xl rounded-bl-md bg-white/10 px-4 py-3 text-sm leading-6 text-white/90">
                Try Greek yogurt with oats and berries: it&apos;s quick, high
                in protein and fits most calorie targets. Want a version
                without dairy?
              </p>
            </div>

            <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
              Things you could ask
            </p>

            <ul className="relative mt-3 space-y-2">
              {sampleQuestions.slice(1).map((question) => (
                <li
                  key={question}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
                >
                  {question}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* ===================== CTA ===================== */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mt-16 overflow-hidden rounded-[32px] bg-[#eaf3e2] px-6 py-12 text-center sm:px-12 lg:py-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -right-24 -top-24 h-[280px] w-[280px] rounded-full border-[40px] border-white/50"
          />

          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute -bottom-32 -left-20 h-[260px] w-[260px] rounded-full border-[35px] border-[#4dbb08]/10"
          />

          <div className="relative z-10">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to meet your
              <span className="text-[#4dbb08]"> AI coach?</span>
            </h3>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-gray-600">
              Create your free account, set your goals, and start chatting.
            </p>

            <Link
              href={loggedIn ? "/app/dashboard" : "/signup"}
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#4dbb08] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#3c9705]"
            >
              {loggedIn ? "Open My Dashboard" : "Get Started Free"}
              <ArrowRight size={18} />
            </Link>

            <p className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-2 text-xs leading-5 text-gray-500">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              AI coaching offers general wellness information and is not a
              substitute for medical advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
