"use client";

import { useEffect, useRef, useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface FullDescriptionHeaderProps {
  heading: string;
}

export function FullDescriptionHeader({ heading }: FullDescriptionHeaderProps) {
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

      {/* Accent divider */}
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
    </div>
  );
}
