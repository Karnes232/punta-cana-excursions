"use client";

import { useEffect, useRef, useState } from "react";
import { BookingStepIcon } from "./BookingStepIcon";

interface BookingStepData {
  stepNumber: number;
  icon: string;
  title: string;
  description: string;
}

interface BookingStepProps {
  step: BookingStepData;
  index: number;
  isLast: boolean;
}

export function BookingStep({ step, index, isLast }: BookingStepProps) {
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
    <div
      ref={ref}
      className="relative flex flex-col items-center text-center transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 150}ms`,
      }}
    >
      {/* Icon container with step number badge */}
      <div className="relative mb-6">
        {/* Main icon circle */}
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-ocean/8 flex items-center justify-center">
          {/* Decorative ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-teal/20"
            style={{ transform: "rotate(-30deg)" }}
            aria-hidden="true"
          />
          <BookingStepIcon
            icon={step.icon}
            className="w-9 h-9 md:w-10 md:h-10 text-ocean"
          />
        </div>

        {/* Step number badge — positioned top-right */}
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-sunset text-white flex items-center justify-center shadow-sm">
          <span className="font-heading font-bold text-sm">
            {step.stepNumber}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-slate text-lg md:text-xl leading-snug mb-2.5">
        {step.title}
      </h3>

      {/* Description */}
      <p className="font-body text-gray-dark text-sm md:text-[0.9375rem] leading-relaxed max-w-xs mx-auto">
        {step.description}
      </p>

      {/* Mobile connecting arrow — between steps */}
      {!isLast && (
        <div className="md:hidden flex justify-center mt-6" aria-hidden="true">
          <svg
            className="w-5 h-5 text-teal/40"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
