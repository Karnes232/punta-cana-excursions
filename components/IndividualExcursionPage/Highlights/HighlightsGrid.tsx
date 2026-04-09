"use client";

import { useEffect, useRef, useState } from "react";

interface HighlightsGridProps {
  highlights: string[];
  locale: string;
}

// Rotating accent colors — keeps the grid visually interesting
// while staying within the brand palette
const ACCENT_COLORS = [
  {
    bg: "rgba(0, 95, 134, 0.08)",
    text: "#005F86",
    border: "rgba(0, 95, 134, 0.15)",
  }, // ocean
  {
    bg: "rgba(14, 165, 183, 0.08)",
    text: "#0EA5B7",
    border: "rgba(14, 165, 183, 0.15)",
  }, // teal
  {
    bg: "rgba(244, 161, 26, 0.08)",
    text: "#D4940F",
    border: "rgba(244, 161, 26, 0.15)",
  }, // sunset
  {
    bg: "rgba(0, 95, 134, 0.06)",
    text: "#005F86",
    border: "rgba(0, 95, 134, 0.12)",
  }, // ocean light
  {
    bg: "rgba(14, 165, 183, 0.06)",
    text: "#0EA5B7",
    border: "rgba(14, 165, 183, 0.12)",
  }, // teal light
  {
    bg: "rgba(244, 161, 26, 0.06)",
    text: "#D4940F",
    border: "rgba(244, 161, 26, 0.12)",
  }, // sunset light
];

export function HighlightsGrid({ highlights, locale }: HighlightsGridProps) {
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
      { threshold: 0.15 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4"
    >
      {highlights.map((highlight, i) => {
        const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];

        return (
          <div
            key={i}
            className="group flex items-start gap-3.5 p-4 md:p-5 bg-white rounded-xl border transition-all duration-500 ease-out hover:shadow-sm"
            style={{
              borderColor: accent.border,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(14px)",
              transitionDelay: `${i * 70}ms`,
            }}
          >
            {/* Numbered accent circle */}
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ background: accent.bg }}
            >
              <svg
                className="w-4 h-4"
                style={{ color: accent.text }}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75"
                />
              </svg>
            </div>

            {/* Text */}
            <p className="font-body text-sm md:text-[15px] text-slate leading-relaxed pt-1">
              {highlight}
            </p>
          </div>
        );
      })}
    </div>
  );
}
