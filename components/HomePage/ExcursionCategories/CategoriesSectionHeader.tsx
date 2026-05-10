"use client";

import { useEffect, useRef, useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface CategoriesSectionHeaderProps {
  heading: string;
  subheading?: string;
}

export function CategoriesSectionHeader({
  heading,
  subheading,
}: CategoriesSectionHeaderProps) {
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
    <div ref={ref} className="text-center mb-12 md:mb-16">
      <WordRevealHeading
        as="h2"
        text={heading}
        className="font-heading font-bold text-slate leading-tight mb-4"
        style={{ fontSize: "clamp(1.625rem, 3vw + 0.25rem, 2.25rem)" }}
      />

      {/* Centered accent divider */}
      <div
        className="flex items-center justify-center gap-2 mb-5 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "100ms",
        }}
        aria-hidden="true"
      >
        <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
        <span className="block w-10 h-[3px] rounded-full bg-sunset" />
        <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
      </div>

      {subheading && (
        <p
          className="font-body text-gray-dark text-base md:text-[1.0625rem] max-w-2xl mx-auto leading-relaxed transition-all duration-600 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "200ms",
          }}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}
