"use client";

import { useEffect, useRef, useState } from "react";

interface PriceTrustSignalsProps {
  signals: string[];
}

export function PriceTrustSignals({ signals }: PriceTrustSignalsProps) {
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
    <div ref={ref} className="flex flex-wrap gap-x-5 gap-y-2">
      {signals.map((signal, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(6px)",
            transitionDelay: `${300 + i * 70}ms`,
          }}
        >
          <svg
            className="w-3.5 h-3.5 text-teal flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span className="text-xs font-body text-gray-400">{signal}</span>
        </div>
      ))}
    </div>
  );
}
