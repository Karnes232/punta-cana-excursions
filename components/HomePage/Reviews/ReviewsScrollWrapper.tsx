"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface ReviewsScrollWrapperProps {
  children: ReactNode;
}

export function ReviewsScrollWrapper({ children }: ReviewsScrollWrapperProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Fade edges — indicate scrollability */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none transition-opacity duration-300 lg:hidden"
        style={{
          background:
            "linear-gradient(to right, var(--color-sand) 0%, transparent 100%)",
          opacity: canScrollLeft ? 1 : 0,
        }}
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 z-10 pointer-events-none transition-opacity duration-300 lg:hidden"
        style={{
          background:
            "linear-gradient(to left, var(--color-sand) 0%, transparent 100%)",
          opacity: canScrollRight ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Scroll buttons — tablet+ */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="
            hidden sm:flex lg:hidden
            absolute left-3 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 items-center justify-center
            bg-white rounded-full shadow-md
            text-ocean hover:text-teal
            transition-all duration-200 hover:shadow-lg
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean
          "
          aria-label="Scroll reviews left"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="
            hidden sm:flex lg:hidden
            absolute right-3 top-1/2 -translate-y-1/2 z-20
            w-10 h-10 items-center justify-center
            bg-white rounded-full shadow-md
            text-ocean hover:text-teal
            transition-all duration-200 hover:shadow-lg
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean
          "
          aria-label="Scroll reviews right"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      )}

      {/* Scrollable track on mobile/tablet — grid on lg+ */}
      <div
        ref={scrollRef}
        className="
          flex lg:grid lg:grid-cols-3
          gap-5 lg:gap-6
          overflow-x-auto lg:overflow-visible
          snap-x snap-mandatory lg:snap-none
          scroll-smooth
          px-5 sm:px-8 lg:px-12
          max-w-7xl lg:mx-auto
          pb-2 lg:pb-0
          scrollbar-hide
        "
        style={{
          /* Hide scrollbar across browsers */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}
