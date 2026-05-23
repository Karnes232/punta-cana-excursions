"use client";

import { useEffect, useState } from "react";

interface HeroSubheadlineProps {
  text: string;
}

export function HeroSubheadline({ text }: HeroSubheadlineProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enters after the headline words have finished revealing
    const timer = setTimeout(() => setIsVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      className="text-white/90 font-body leading-relaxed max-w-xl mb-8 md:mb-10 transition-all duration-700 ease-out"
      style={{
        fontSize: "clamp(1.0625rem, 1.5vw + 0.25rem, 1.25rem)",
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {text}
    </p>
  );
}
