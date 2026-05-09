"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
   DivingHeroHeadline — Staggered word reveal
   
   Same animation pattern as Home + Browse heroes:
   Each word slides up from below with increasing delay.
   
   Size: clamp(2rem, 5vw, 3.5rem) — between Home (largest) and Browse (smallest)
   Timing: starts at 300ms (after badge at 150ms)
   --------------------------------------------------------------------------- */

interface DivingHeroHeadlineProps {
  text: string;
}

export function DivingHeroHeadline({ text }: DivingHeroHeadlineProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const words = text.split(" ");

  return (
    <h1
      className="font-heading text-white leading-[1.08] tracking-tight mb-5 md:mb-6"
      style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.28em] last:mr-0"
        >
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(105%)",
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${i * 80}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}
