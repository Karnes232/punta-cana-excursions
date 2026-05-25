"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface ContactCTAContentProps {
  eyebrow?: string;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function ContactCTAContent({
  eyebrow,
  headline,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: ContactCTAContentProps) {
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
      className={`
        flex flex-col lg:flex-row items-center gap-8 lg:gap-12
        transition-all duration-700 ease-out
      `}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Left: Copy */}
      <div className="flex-1 text-center lg:text-left">
        {eyebrow && (
          <p
            className="font-heading font-semibold text-sunset text-sm tracking-widest uppercase mb-3 transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              opacity: isVisible ? 1 : 0,
            }}
          >
            {eyebrow}
          </p>
        )}

        {/* Decorative accent bar */}
        <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
          <span className="block w-8 h-[3px] rounded-full bg-sunset" />
          <span className="block w-2 h-2 rounded-full bg-sunset/50" />
        </div>

        <WordRevealHeading
          as="h2"
          text={headline}
          className="font-heading font-bold text-white text-xl md:text-2xl leading-snug mb-3"
        />
        <p className="font-body text-white/80 text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
          {description}
        </p>
      </div>

      {/* Right: CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        {/* Primary contact button — solid sunset */}
        {primaryButtonText && (
          <Link
            href={primaryButtonHref}
            className="
              group
              inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-sunset text-white
              font-heading font-semibold text-sm
              rounded-full
              shadow-sm
              transition-all duration-200 ease-out
              hover:bg-sunset-dark hover:shadow-md hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean
            "
          >
            {primaryButtonText}
            {/* Arrow icon */}
            <svg
              className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        )}

        {/* Secondary contact button — ghost white */}
        {secondaryButtonText && (
          <Link
            href={secondaryButtonHref}
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-transparent text-white
              border-2 border-white/30
              font-heading font-semibold text-sm
              rounded-full
              transition-all duration-200 ease-out
              hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ocean
            "
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );
}
