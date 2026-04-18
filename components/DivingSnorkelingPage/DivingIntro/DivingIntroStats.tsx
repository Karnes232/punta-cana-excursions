"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   DivingIntroStats — Credential stat row
   
   Unique to the Diving & Snorkeling page. Shows 3-4 key numbers
   that reinforce Grand Bay's diving authority (years, dives, certs, etc.)
   
   Each stat reveals individually with a stagger when scrolled into view.
   Uses a frosted glass container on the sand background.
   --------------------------------------------------------------------------- */

interface DivingIntroStatsProps {
  stats: Array<{
    value: string;
    label: string;
  }>;
}

export function DivingIntroStats({ stats }: DivingIntroStatsProps) {
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
      className="mt-8 md:mt-10 grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative rounded-xl px-4 py-5 text-center transition-all duration-600 ease-out"
          style={{
            background: "rgba(255, 255, 255, 0.70)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 95, 134, 0.08)",
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: `${600 + i * 120}ms`,
          }}
        >
          {/* Stat value */}
          <p
            className="font-heading font-bold text-ocean leading-none mb-1"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            {stat.value}
          </p>

          {/* Stat label */}
          <p className="font-body text-gray-dark text-xs sm:text-sm leading-snug">
            {stat.label}
          </p>

          {/* Subtle top accent line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-teal/40"
            style={{ width: "40%" }}
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  );
}
