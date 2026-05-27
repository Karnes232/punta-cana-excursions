"use client";

import { useEffect, useRef, useState } from "react";
import { AppLink } from "@/components/ui/AppLink";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

/* ---------------------------------------------------------------------------
   DivingCTAContent — Headline + CTAs with scroll-triggered reveal

   Animation cascade:
     Headline (0ms) → Subtext (150ms) → Buttons (300ms)

   Two CTAs:
     1. Primary contact link (solid sunset)
     2. Secondary link (ghost outline)
   --------------------------------------------------------------------------- */

interface DivingCTAContentProps {
  headline: string;
  subtext?: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function DivingCTAContent({
  headline,
  subtext,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: DivingCTAContentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 text-center"
    >
      {/* Headline */}
      <WordRevealHeading
        as="h2"
        text={headline}
        className="font-heading font-bold text-white leading-tight mb-4"
        style={{ fontSize: "clamp(1.625rem, 3.5vw + 0.25rem, 2.5rem)" }}
      />

      {/* Subtext */}
      {subtext && (
        <p
          className="font-body text-white/75 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8 transition-all duration-700 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "150ms",
          }}
        >
          {subtext}
        </p>
      )}

      {/* CTA buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: subtext ? "300ms" : "200ms",
        }}
      >
        {/* Primary contact link — solid sunset */}
        {primaryButtonText && (
          <AppLink
            href={primaryButtonHref}
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-sunset text-white font-heading font-semibold text-[0.9375rem] rounded-full shadow-lg transition-all duration-200 hover:bg-sunset-dark hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] min-w-[200px] justify-center"
          >
            {primaryButtonText}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </AppLink>
        )}

        {/* Secondary link — ghost outline */}
        {secondaryButtonText && (
          <AppLink
            href={secondaryButtonHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-heading font-semibold text-[0.9375rem] rounded-full border border-white/30 transition-all duration-200 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 min-w-[200px] justify-center"
          >
            {secondaryButtonText}
          </AppLink>
        )}
      </div>
    </div>
  );
}