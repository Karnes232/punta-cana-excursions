"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

interface HeroCTA {
  text: string;
  href: string;
}

interface HeroCTAGroupProps {
  primaryCTA: HeroCTA;
  secondaryCTA: HeroCTA;
}

export function HeroCTAGroup({ primaryCTA, secondaryCTA }: HeroCTAGroupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enters after subheadline has settled
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Primary CTA — solid ocean blue, high contrast */}
      <Link
        href={primaryCTA.href}
        className="
          inline-flex items-center justify-center
          px-7 py-3.5
          bg-sunset hover:bg-sunset-dark
          text-white font-heading font-semibold
          text-[0.9375rem] sm:text-base
          rounded-full
          shadow-md hover:shadow-lg
          transform hover:-translate-y-0.5
          transition-all duration-200 ease-out
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          min-h-[48px]
        "
      >
        {primaryCTA.text}
        {/* Arrow icon */}
        <svg
          className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>

      {/* Secondary CTA — ghost style for contrast against dark overlay */}
      <Link
        href={secondaryCTA.href}
        className="
          inline-flex items-center justify-center
          px-7 py-3.5
          bg-white/10 hover:bg-white/20
          text-white font-heading font-semibold
          text-[0.9375rem] sm:text-base
          rounded-full
          border border-white/30 hover:border-white/50
          backdrop-blur-sm
          transform hover:-translate-y-0.5
          transition-all duration-200 ease-out
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
          min-h-[48px]
        "
      >
        {secondaryCTA.text}
      </Link>
    </div>
  );
}
