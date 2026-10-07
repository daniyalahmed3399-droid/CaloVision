"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Moved here from the landing page ("Your Body Changing With Weight Loss
// Program") and restyled as a dashboard card. The dashboard puts it in a
// vertical column on the right at xl and up, where the three photos stack;
// at lg it is a full-width card with the photos side by side; below that it
// is a swipeable row with Previous / Next buttons (keyboard users can also
// focus the row and use the arrow keys).

const SLIDES = [
  { src: "/images/weight-loss-1.webp", alt: "Weight loss transformation 1 of 3" },
  { src: "/images/weight-loss-2.webp", alt: "Weight loss transformation 2 of 3" },
  { src: "/images/weight-loss-3.webp", alt: "Weight loss transformation 3 of 3" },
];

export default function TransformationGallery() {
  const rowRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const row = rowRef.current;

    if (!row) return;

    setAtStart(row.scrollLeft <= 4);
    setAtEnd(row.scrollLeft + row.clientWidth >= row.scrollWidth - 4);
  };

  const scrollByPage = (direction) => {
    const row = rowRef.current;

    if (!row) return;

    // Respect the "reduce motion" setting.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    row.scrollBy({
      left: direction * row.clientWidth * 0.8,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <section
      aria-labelledby="transformations-title"
      className="rounded-[24px] border border-gray-100 bg-white p-4 shadow-sm sm:p-7 xl:p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4dbb08]">
            Inspiration
          </p>

          <h2
            id="transformations-title"
            className="mt-1 text-[clamp(1.25rem,5.5vw,1.5rem)] font-bold leading-snug text-gray-900 xl:text-xl"
          >
            Your Body Changing With Weight Loss Program
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Build healthier habits with practical nutrition guidance,
            sustainable strategies, and a personalized approach designed
            around your goals.
          </p>
        </div>

        <div className="flex shrink-0 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="Previous photos"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="Next photos"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        onScroll={updateEdges}
        role="region"
        aria-label="Weight loss transformation photos"
        tabIndex={0}
        className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-[#4dbb08]/30 lg:grid lg:grid-cols-3 lg:overflow-visible xl:grid-cols-1"
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.src}
            className="w-[78%] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#f6f9f1] sm:w-[46%] lg:w-auto"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              width={1125}
              height={825}
              sizes="(min-width: 1280px) 24rem, (min-width: 1024px) 28vw, (min-width: 640px) 46vw, 78vw"
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
