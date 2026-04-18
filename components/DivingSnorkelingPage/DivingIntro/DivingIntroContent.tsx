"use client";

import { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { portableTextComponents } from "@/components/IndividualExcursionPage/FullDescription/FullDescriptionBody";

/* ---------------------------------------------------------------------------
   DivingIntroContent — Copy column with staggered scroll reveal
   
   Animation cascade (all triggered on scroll at threshold 0.2):
     Tagline (100ms) → Heading (200ms) → Divider (300ms) → Body (400ms)
   
   Same pattern as HomePage BrandIntroContent.
   --------------------------------------------------------------------------- */

interface DivingIntroContentProps {
  tagline: string;
  headline: string;
  body: PortableTextBlock[];
}

export function DivingIntroContent({
  tagline,
  headline,
  body,
}: DivingIntroContentProps) {
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
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col justify-center">
      {/* Tagline / kicker */}
      <p
        className="font-heading font-semibold text-teal text-sm tracking-widest uppercase mb-4 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "100ms",
        }}
      >
        {tagline}
      </p>

      {/* Heading */}
      <h2
        className="font-heading font-bold text-slate leading-tight mb-5 transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(1.625rem, 3vw + 0.25rem, 2.25rem)",
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "200ms",
        }}
      >
        {headline}
      </h2>

      {/* Accent divider — ocean blue bar (differs from Home's sunset orange) */}
      <div
        className="flex items-center gap-2 mb-6 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "300ms",
        }}
        aria-hidden="true"
      >
        <span className="block w-10 h-[3px] rounded-full bg-ocean" />
        <span className="block w-2 h-[3px] rounded-full bg-teal/50" />
      </div>

      {/* Body — Sanity Portable Text */}
      <div
        className="font-body text-gray-dark leading-relaxed text-base md:text-[1.0625rem] max-w-lg transition-all duration-600 ease-out [&>p]:mb-4 [&>p:last-child]:mb-0"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "400ms",
        }}
      >
        <PortableText value={body} components={portableTextComponents} />
      </div>
    </div>
  );
}
