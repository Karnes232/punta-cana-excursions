"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface ContactCTAContentProps {
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function ContactCTAContent({
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
        {/* Decorative accent bar */}
        <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
          <span className="block w-8 h-[3px] rounded-full bg-sunset" />
          <span className="block w-2 h-2 rounded-full bg-sunset/50" />
        </div>

        <WordRevealHeading
          as="h2"
          text={headline}
          className="font-heading font-bold text-slate text-xl md:text-2xl leading-snug mb-3"
        />
        <p className="font-body text-gray-dark text-sm md:text-base leading-relaxed max-w-lg mx-auto lg:mx-0">
          {description}
        </p>
      </div>

      {/* Right: CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
        {/* Primary contact button — solid ocean */}
        {primaryButtonText && (
          <Link
            href={primaryButtonHref}
            className="
              group
              inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-ocean text-white
              font-heading font-semibold text-sm
              rounded-full
              shadow-sm
              transition-all duration-200 ease-out
              hover:bg-ocean/90 hover:shadow-md hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40 focus-visible:ring-offset-2
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

        {/* Secondary contact button — ghost style */}
        {secondaryButtonText && (
          <Link
            href={secondaryButtonHref}
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-transparent text-ocean
              border-2 border-ocean/20
              font-heading font-semibold text-sm
              rounded-full
              transition-all duration-200 ease-out
              hover:bg-ocean hover:text-white hover:border-ocean hover:-translate-y-0.5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40 focus-visible:ring-offset-2
            "
          >
            {secondaryButtonText}
          </Link>
        )}
      </div>
    </div>
  );
}
