"use client";

import { useEffect, useState } from "react";

/* ---------------------------------------------------------------------------
   DivingHeroBadge — Credibility badge unique to the Diving page
   
   Appears above the headline to immediately establish Grand Bay's diving
   expertise — this is a key trust differentiator per the brand guidelines.
   
   Animation: Fade-in + translate-up at 150ms (enters first in cascade)
   --------------------------------------------------------------------------- */

interface DivingHeroBadgeProps {
  text: string;
}

export function DivingHeroBadge({ text }: DivingHeroBadgeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="mb-5 md:mb-6 transition-all duration-600 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <span
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white/95"
        style={{
          background: "rgba(14, 165, 183, 0.20)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Diving mask / snorkel icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-80"
        >
          <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 10 10" />
          <path d="M12 2a10 10 0 0 0-10 10" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 15v7" />
          <path d="M9 22h6" />
        </svg>
        {text}
      </span>
    </div>
  );
}
