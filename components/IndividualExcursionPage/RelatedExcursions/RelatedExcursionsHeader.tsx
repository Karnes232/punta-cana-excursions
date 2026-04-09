"use client";

import { useEffect, useRef, useState } from "react";

interface RelatedExcursionsHeaderProps {
  heading: string;
  subheading: string;
}

export function RelatedExcursionsHeader({
  heading,
  subheading,
}: RelatedExcursionsHeaderProps) {
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
    <div ref={ref} className="text-center max-w-2xl mx-auto">
      <h2
        className="font-heading font-bold text-slate leading-tight transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(1.375rem, 3.5vw, 2rem)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(14px)",
        }}
      >
        {heading}
      </h2>

      {/* Centered symmetrical accent divider */}
      <div
        className="flex items-center justify-center gap-2 mt-4 mb-4 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "100ms",
        }}
        aria-hidden="true"
      >
        <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
        <span className="block w-10 h-[3px] rounded-full bg-sunset" />
        <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
      </div>

      <p
        className="font-body text-gray-400 transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(0.875rem, 1.5vw, 1.0625rem)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(10px)",
          transitionDelay: "180ms",
        }}
      >
        {subheading}
      </p>
    </div>
  );
}
