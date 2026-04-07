"use client";

import { useEffect, useRef, useState } from "react";

interface BrandIntroContentProps {
  heading: string;
  body: string;
  tagline?: string;
}

export function BrandIntroContent({
  heading,
  body,
  tagline,
}: BrandIntroContentProps) {
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
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col justify-center">
      {/* Optional tagline / kicker */}
      {tagline && (
        <p
          className="font-heading font-semibold text-teal text-sm tracking-widest uppercase mb-4 transition-all duration-600 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          {tagline}
        </p>
      )}

      {/* Heading */}
      <h2
        className="font-heading font-bold text-slate leading-tight mb-5 transition-all duration-600 ease-out"
        style={{
          fontSize: "clamp(1.625rem, 3vw + 0.25rem, 2.25rem)",
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "200ms",
        }}
      >
        {heading}
      </h2>

      {/* Accent divider */}
      <div
        className="flex items-center gap-2 mb-6 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "300ms",
        }}
        aria-hidden="true"
      >
        <span className="block w-10 h-[3px] rounded-full bg-sunset" />
        <span className="block w-2 h-[3px] rounded-full bg-sunset/50" />
      </div>

      {/* Body text */}
      <p
        className="font-body text-gray-dark leading-relaxed text-base md:text-[1.0625rem] max-w-lg transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: "400ms",
        }}
      >
        {body}
      </p>
    </div>
  );
}
