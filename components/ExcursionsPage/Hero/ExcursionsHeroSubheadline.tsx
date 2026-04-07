"use client";

import { useEffect, useState } from "react";

interface ExcursionsHeroSubheadlineProps {
  text: string;
}

export function ExcursionsHeroSubheadline({
  text,
}: ExcursionsHeroSubheadlineProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      className="font-body text-white/75 leading-relaxed max-w-xl mb-6 md:mb-8 transition-all duration-700 ease-out"
      style={{
        fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
        transform: isVisible ? "translateY(0)" : "translateY(16px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {text}
    </p>
  );
}
