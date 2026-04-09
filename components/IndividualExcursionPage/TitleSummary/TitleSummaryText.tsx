"use client";

import { useEffect, useState } from "react";

interface TitleSummaryTextProps {
  text: string;
}

export function TitleSummaryText({ text }: TitleSummaryTextProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <p
      className="font-body text-gray-500 leading-relaxed max-w-3xl transition-all duration-700 ease-out"
      style={{
        fontSize: "clamp(0.9375rem, 1.8vw, 1.125rem)",
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      {text}
    </p>
  );
}
