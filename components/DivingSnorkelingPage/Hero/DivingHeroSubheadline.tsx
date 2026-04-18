"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
   DivingHeroSubheadline — Subheadline text with inline CTAs
   
   Unlike the Browse hero (which uses a stats pill since the filter bar 
   below is the real CTA), the Diving page needs explicit CTAs because 
   users may want to jump directly to diving or snorkeling sections.
   
   Animation: Fade-in + translate-up at 700ms (after headline completes)
   --------------------------------------------------------------------------- */

interface DivingHeroSubheadlineProps {
  text: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
}

export function DivingHeroSubheadline({
  text,
  primaryCTA,
  secondaryCTA,
}: DivingHeroSubheadlineProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {/* Subheadline text */}
      <p
        className="font-body text-white/85 leading-relaxed mb-7 md:mb-8 max-w-xl"
        style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
      >
        {text}
      </p>

      {/* CTA group */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Primary CTA — ocean blue filled */}
        <Link
          href={primaryCTA.href}
          className="btn-primary inline-flex items-center gap-2"
        >
          {/* Waves icon — contextual to water activities */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
            <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
          </svg>
          {primaryCTA.text}
        </Link>

        {/* Secondary CTA — ghost/outline style */}
        <Link
          href={secondaryCTA.href}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-heading font-semibold text-[0.9375rem] text-white border border-white/30 transition-all duration-200 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5"
        >
          {secondaryCTA.text}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
