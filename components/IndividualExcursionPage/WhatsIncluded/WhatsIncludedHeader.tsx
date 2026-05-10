"use client";

import { useEffect, useRef, useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface WhatsIncludedHeaderProps {
  heading: string;
  subheading: string;
}

export function WhatsIncludedHeader({
  heading,
  subheading,
}: WhatsIncludedHeaderProps) {
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
    <div ref={ref}>
      <WordRevealHeading
        as="h2"
        text={heading}
        className="font-heading font-bold text-slate leading-tight"
        style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)" }}
      />

      <div
        className="flex items-center gap-1.5 mt-3 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "120ms",
        }}
      >
        <span className="block w-10 h-[3px] rounded-full bg-sunset" />
        <span className="block w-2 h-[3px] rounded-full bg-sunset/40" />
      </div>

      <p
        className="mt-3 font-body text-gray-400 max-w-lg transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(8px)",
          transitionDelay: "180ms",
        }}
      >
        {subheading}
      </p>
    </div>
  );
}
