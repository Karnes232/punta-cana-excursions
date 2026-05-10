"use client";

import { useEffect, useRef, useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface StatItem {
  value: string;
  label: string;
}

interface ByTheNumbersProps {
  headline: string;
  stats: StatItem[];
}

export function ByTheNumbers({ headline, stats }: ByTheNumbersProps) {
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
    <section className="relative py-20 md:py-24 section-sand overflow-hidden">
      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0V20C240 40 480 0 720 20C960 40 1200 0 1440 20V0H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Headline */}
        {headline && (
          <div className="text-center mb-14">
            <WordRevealHeading
              as="h2"
              text={headline}
              className="font-heading font-bold text-navy text-3xl sm:text-4xl"
            />
            <div
              className="flex items-center justify-center gap-3 mt-4 transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transitionDelay: "100ms",
              }}
            >
              <div className="h-px w-16 bg-teal" />
              <div className="w-1.5 h-1.5 rounded-full bg-sunset" />
              <div className="h-px w-16 bg-teal" />
            </div>
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-6 py-8 text-center border border-sand-dark/20 shadow-sm transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${150 + i * 80}ms`,
              }}
            >
              <p className="font-heading font-bold text-ocean text-4xl md:text-5xl leading-none mb-3">
                {stat.value}
              </p>
              <p className="font-body text-gray-500 text-sm md:text-base leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40V20C240 0 480 40 720 20C960 0 1200 40 1440 20V40H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
