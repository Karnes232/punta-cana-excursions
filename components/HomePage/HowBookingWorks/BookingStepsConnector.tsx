"use client";

import { useEffect, useRef, useState } from "react";

interface BookingStepsConnectorProps {
  stepCount: number;
}

export function BookingStepsConnector({
  stepCount,
}: BookingStepsConnectorProps) {
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

  if (stepCount < 2) return null;

  return (
    <div
      ref={ref}
      className="hidden md:block absolute top-12 left-0 right-0 pointer-events-none"
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* The line sits at the vertical center of the icon circles */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div
          className="relative mx-auto transition-all duration-1000 ease-out"
          style={{
            /* Inset the line to start/end at the center of the first/last icon */
            marginLeft: `${100 / (stepCount * 2)}%`,
            marginRight: `${100 / (stepCount * 2)}%`,
          }}
        >
          {/* Animated dashed line */}
          <svg
            className="w-full h-1"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
          >
            <line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeDasharray="3 2.5"
              className="text-teal/25"
              style={{
                strokeDashoffset: isVisible ? 0 : 100,
                transition: "stroke-dashoffset 1.2s ease-out 0.4s",
              }}
            />
          </svg>

          {/* Small arrow heads between steps */}
          {Array.from({ length: stepCount - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 transition-opacity duration-500"
              style={{
                left: `${((i + 1) / (stepCount - 1)) * 100}%`,
                transform: "translate(-50%, -50%)",
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${800 + i * 200}ms`,
              }}
            >
              <svg
                className="w-3 h-3 text-teal/30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 17l5-5-5-5v10z" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
