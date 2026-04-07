"use client";

import { useEffect, useState } from "react";

interface ExcursionsHeroHeadlineProps {
  text: string;
}

export function ExcursionsHeroHeadline({ text }: ExcursionsHeroHeadlineProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const words = text.split(" ");

  return (
    <h1
      className="font-heading text-white leading-[1.1] tracking-tight mb-4 md:mb-5"
      style={{
        fontSize: "clamp(1.75rem, 4.5vw, 3.25rem)",
      }}
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
    </h1>
  );
}
