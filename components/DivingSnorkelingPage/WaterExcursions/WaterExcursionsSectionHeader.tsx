"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   WaterExcursionsSectionHeader — Section heading with contextual icon
   
   Shows a diving mask or snorkeling mask icon based on the iconType prop,
   followed by the heading, accent divider, and optional subheading.
   Scroll-triggered reveal with stagger.
   --------------------------------------------------------------------------- */

interface WaterExcursionsSectionHeaderProps {
  heading: string;
  subheading?: string;
  iconType: "diving" | "snorkeling";
}

export function WaterExcursionsSectionHeader({
  heading,
  subheading,
  iconType,
}: WaterExcursionsSectionHeaderProps) {
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
    <div ref={ref} className="text-center max-w-2xl mx-auto">
      {/* Icon pill */}
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 transition-all duration-600 ease-out"
        style={{
          background:
            iconType === "diving"
              ? "rgba(0, 95, 134, 0.08)"
              : "rgba(14, 165, 183, 0.08)",
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {iconType === "diving" ? <DivingIcon /> : <SnorkelingIcon />}
      </div>

      {/* Heading */}
      <h2
        className="font-heading font-bold text-slate leading-tight transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(1.5rem, 3vw + 0.25rem, 2.25rem)",
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "100ms",
        }}
      >
        {heading}
      </h2>

      {/* Accent divider — ocean/teal depending on type */}
      <div
        className="flex items-center justify-center gap-2 mt-4 mb-5 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "200ms",
        }}
        aria-hidden="true"
      >
        <span
          className="block w-6 h-[3px] rounded-full"
          style={{
            background:
              iconType === "diving"
                ? "rgba(0, 95, 134, 0.25)"
                : "rgba(14, 165, 183, 0.25)",
          }}
        />
        <span
          className="block w-10 h-[3px] rounded-full"
          style={{
            background: iconType === "diving" ? "#005F86" : "#0EA5B7",
          }}
        />
        <span
          className="block w-6 h-[3px] rounded-full"
          style={{
            background:
              iconType === "diving"
                ? "rgba(0, 95, 134, 0.25)"
                : "rgba(14, 165, 183, 0.25)",
          }}
        />
      </div>

      {/* Subheading */}
      {subheading && (
        <p
          className="font-body text-gray-dark text-base md:text-[1.0625rem] max-w-xl mx-auto leading-relaxed transition-all duration-600 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "300ms",
          }}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Inline SVG icons — contextual to water activities
   --------------------------------------------------------------------------- */

function DivingIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#005F86"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Diving mask shape */}
      <path d="M3 10a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1z" />
      <path d="M8 10h8" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="8" r="1.5" />
      {/* Snorkel tube */}
      <path d="M21 3v5a2 2 0 0 1-2 2" />
    </svg>
  );
}

function SnorkelingIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0EA5B7"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Snorkeling waves */}
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      {/* Fish silhouette */}
      <path d="M10 18c1.5-1 3-1 4.5 0" />
      <circle cx="12" cy="18" r="3" />
      <path d="M18 18l2-1.5L18 15" />
    </svg>
  );
}
