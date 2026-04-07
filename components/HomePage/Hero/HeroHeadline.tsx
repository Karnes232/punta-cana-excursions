"use client";

import { useEffect, useRef, useState } from "react";

interface HeroHeadlineProps {
  text: string;
}

export function HeroHeadline({ text }: HeroHeadlineProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Small delay so the animation feels intentional, not instant
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Split text into words for staggered animation
  const words = text.split(" ");

  return (
    <h1
      ref={ref}
      className="font-heading text-white leading-[1.08] tracking-tight mb-5 md:mb-6"
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden mr-[0.28em] last:mr-0"
        >
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${200 + i * 80}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}

      {/* Sizing — responsive type scale */}
      <style jsx>{`
        h1 {
          font-size: clamp(2.25rem, 5vw + 0.5rem, 4rem);
        }
      `}</style>
    </h1>
  );
}
