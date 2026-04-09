"use client";

import { useEffect, useRef, useState } from "react";

interface PriceDisplayProps {
  price: number;
  priceNote: string;
  fromLabel: string;
}

export function PriceDisplay({
  price,
  priceNote,
  fromLabel,
}: PriceDisplayProps) {
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
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-baseline gap-2 flex-wrap">
      {/* "From" kicker */}
      <span
        className="text-sm font-body font-medium text-gray-400 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(8px)",
        }}
      >
        {fromLabel}
      </span>

      {/* Price */}
      <div className="flex items-baseline gap-1">
        <span
          className="font-heading font-bold text-ocean leading-none transition-all duration-600 ease-out"
          style={{
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(10px) scale(0.95)",
            transitionDelay: "80ms",
          }}
        >
          ${price}
        </span>

        <span
          className="text-sm font-body text-gray-400 self-end pb-0.5 transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transitionDelay: "160ms",
          }}
        >
          USD
        </span>
      </div>

      {/* Price note */}
      <span
        className="text-sm font-body text-gray-400 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "200ms",
        }}
      >
        / {priceNote}
      </span>
    </div>
  );
}
