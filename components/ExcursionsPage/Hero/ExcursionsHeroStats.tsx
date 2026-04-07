"use client";

import { useEffect, useState } from "react";

interface ExcursionsHeroStatsProps {
  totalExcursions: number;
}

export function ExcursionsHeroStats({
  totalExcursions,
}: ExcursionsHeroStatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex items-center gap-4 transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Excursion count pill */}
      <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
        {/* Compass icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sunset"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
        <span className="font-heading text-white text-sm font-semibold tracking-wide">
          {totalExcursions}+ Excursions
        </span>
      </div>

      {/* Decorative divider */}
      <div className="hidden sm:block h-px flex-1 max-w-[120px] bg-gradient-to-r from-white/25 to-transparent" />

      {/* Scroll indicator */}
      <div className="hidden sm:flex items-center gap-2 text-white/50">
        <span className="font-body text-xs tracking-wide uppercase">
          Browse below
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
