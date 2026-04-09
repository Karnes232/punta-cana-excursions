"use client";

import { useEffect, useRef, useState } from "react";

interface RestrictionsHeaderProps {
  heading: string;
  subheading: string;
}

export function RestrictionsHeader({
  heading,
  subheading,
}: RestrictionsHeaderProps) {
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
      {/* Heading with info icon */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-ocean/8 flex items-center justify-center text-ocean transition-all duration-600 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.8)",
          }}
        >
          <svg
            className="w-[18px] h-[18px]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </div>

        <h2
          className="font-heading font-bold text-slate leading-tight transition-all duration-600 ease-out"
          style={{
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(10px)",
          }}
        >
          {heading}
        </h2>
      </div>

      {/* Accent divider */}
      <div
        className="flex items-center gap-1.5 mt-3 ml-[42px] transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          transitionDelay: "120ms",
        }}
      >
        <span className="block w-10 h-[3px] rounded-full bg-sunset" />
        <span className="block w-2 h-[3px] rounded-full bg-sunset/40" />
      </div>

      <p
        className="mt-3 ml-[42px] font-body text-gray-400 max-w-lg transition-all duration-600 ease-out"
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
