"use client";

import { useEffect, useRef, useState } from "react";
import { TrustPillarIcon } from "@/components/HomePage/WhyChooseUs/TrustPillarIcon";

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

interface OurValuesProps {
  headline: string;
  subheading: string;
  values: ValueItem[];
}

export function OurValues({ headline, subheading, values }: OurValuesProps) {
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
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          className="text-center mb-14 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <h2 className="font-heading font-bold text-navy text-3xl sm:text-4xl mb-4">
            {headline}
          </h2>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-16 bg-teal" />
            <div className="w-1.5 h-1.5 rounded-full bg-sunset" />
            <div className="h-px w-16 bg-teal" />
          </div>
          {subheading && (
            <p className="font-body text-gray-500 text-lg max-w-xl mx-auto">{subheading}</p>
          )}
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="group flex flex-col gap-4 p-7 rounded-2xl border border-sand-dark/25 bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${100 + i * 70}ms`,
              }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-ocean/8 flex items-center justify-center text-ocean group-hover:bg-ocean group-hover:text-white transition-colors duration-300">
                <TrustPillarIcon icon={value.icon} className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="font-heading font-bold text-navy text-lg leading-snug">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-body text-gray-500 text-sm leading-relaxed flex-1">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
