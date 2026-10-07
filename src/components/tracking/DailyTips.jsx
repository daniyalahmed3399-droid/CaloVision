"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Apple, ChevronLeft, ChevronRight, Dumbbell, Pause, Play } from "lucide-react";

import { todayString } from "../../lib/dates";
import { TIPS, TIP_CATEGORIES, startingTipIndex } from "../../lib/tips";

const ROTATE_MS = 15000;

const CATEGORY_STYLE = {
  fitness: { icon: Dumbbell, badge: "bg-orange-50 text-orange-600" },
  nutrition: { icon: Apple, badge: "bg-[#eaf5df] text-[#3c9705]" },
};

// A card of hard-coded fitness and nutrition tips. It starts on a different
// tip each day and moves to the next every 15 seconds. The rotation pauses
// while the card is hovered or focused, can be paused with the button, and
// stays off for people who ask their device to reduce motion.
export default function DailyTips() {
  const [index, setIndex] = useState(() => startingTipIndex(todayString()));
  const [playing, setPlaying] = useState(
    () =>
      !(
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      )
  );
  const [held, setHeld] = useState(false);

  const go = (step) =>
    setIndex((current) => (current + step + TIPS.length) % TIPS.length);

  // `index` is a dependency so a manual change restarts the 15 seconds.
  useEffect(() => {
    if (!playing || held) return undefined;

    const timer = setTimeout(() => go(1), ROTATE_MS);

    return () => clearTimeout(timer);
  }, [index, playing, held]);

  const tip = TIPS[index];
  const { icon: Icon, badge } = CATEGORY_STYLE[tip.category];

  return (
    <section
      aria-labelledby="daily-tips-title"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-7 xl:p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
        Tip of the moment
      </p>

      <h2
        id="daily-tips-title"
        className="mt-1 text-[clamp(1.25rem,5.5vw,1.5rem)] font-bold leading-snug text-gray-900 xl:text-xl"
      >
        Daily tips
      </h2>

      <motion.div
        // A new key fades the next tip in.
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        // Announce changes only when the user moved them or paused; the
        // automatic rotation would otherwise interrupt a screen reader.
        aria-live={playing && !held ? "off" : "polite"}
        className="mt-4 min-h-[9.5rem] rounded-2xl bg-[#f6f9f1] p-4"
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge}`}
        >
          <Icon size={14} />
          {TIP_CATEGORIES[tip.category]}
        </span>

        <p className="mt-3 text-sm leading-6 text-gray-700">{tip.text}</p>
      </motion.div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-gray-400">
          {index + 1} of {TIPS.length}
        </p>

        <div className="flex gap-2">
          <IconButton label="Previous tip" onClick={() => go(-1)}>
            <ChevronLeft size={20} />
          </IconButton>

          <IconButton
            label={playing ? "Pause automatic tips" : "Resume automatic tips"}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </IconButton>

          <IconButton label="Next tip" onClick={() => go(1)}>
            <ChevronRight size={20} />
          </IconButton>
        </div>
      </div>
    </section>
  );
}

function IconButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
    >
      {children}
    </button>
  );
}
