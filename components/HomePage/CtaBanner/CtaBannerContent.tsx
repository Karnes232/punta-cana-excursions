"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface CtaBannerContentProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref: string;
}

export function CtaBannerContent({
  eyebrow,
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: CtaBannerContentProps) {
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
    <div ref={ref} className="text-center">
      {eyebrow && (
        <p
          className="font-heading font-semibold text-sunset text-sm tracking-widest uppercase mb-4 transition-all duration-700 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "0ms",
          }}
        >
          {eyebrow}
        </p>
      )}

      {/* Headline */}
      <WordRevealHeading
        as="h2"
        text={headline}
        className="font-heading font-bold text-white leading-tight mb-4"
        style={{ fontSize: "clamp(1.5rem, 3.5vw + 0.25rem, 2.5rem)" }}
      />

      {/* Subheadline */}
      {subheadline && (
        <p
          className="font-body text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8 transition-all duration-700 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "100ms",
          }}
        >
          {subheadline}
        </p>
      )}

      {/* Accent divider */}
      <div
        className="flex items-center justify-center gap-2 mb-8 transition-all duration-600 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(12px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: subheadline ? "150ms" : "100ms",
        }}
        aria-hidden="true"
      >
        <span className="block w-6 h-[2px] rounded-full bg-white/25" />
        <span className="block w-10 h-[2px] rounded-full bg-sunset" />
        <span className="block w-6 h-[2px] rounded-full bg-white/25" />
      </div>

      {/* CTA buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: subheadline ? "250ms" : "200ms",
        }}
      >
        {/* Primary CTA — sunset orange */}
        <Link
          href={primaryCtaHref}
          className="
            inline-flex items-center justify-center gap-2
            px-8 py-4
            bg-sunset hover:bg-sunset-dark
            text-white font-heading font-bold
            text-base
            rounded-full
            shadow-lg hover:shadow-xl
            transform hover:-translate-y-0.5
            transition-all duration-200 ease-out
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
            min-h-[52px] min-w-[200px]
          "
        >
          {primaryCtaText}
          <svg
            className="w-4.5 h-4.5"
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

        {/* Secondary CTA — ghost style, links to contact */}
        {secondaryCtaText && (
          <Link
            href={secondaryCtaHref}
            className="
              inline-flex items-center justify-center
              px-7 py-4
              bg-white/10 hover:bg-white/20
              text-white font-heading font-semibold
              text-base
              rounded-full
              border border-white/30 hover:border-white/50
              backdrop-blur-sm
              transform hover:-translate-y-0.5
              transition-all duration-200 ease-out
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              min-h-[52px] min-w-[200px]
            "
          >
            {secondaryCtaText}
          </Link>
        )}
      </div>
    </div>
  );
}
