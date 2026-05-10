"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface CtaBannerContentProps {
  headline: string;
  subheadline?: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  whatsappUrl: string;
  whatsappLabel?: string;
}

export function CtaBannerContent({
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaHref,
  whatsappUrl,
  whatsappLabel = "Chat on WhatsApp",
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

        {/* WhatsApp CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center justify-center gap-2.5
            px-7 py-4
            bg-whatsapp hover:bg-whatsapp-dark
            text-white font-heading font-semibold
            text-[0.9375rem]
            rounded-full
            shadow-md hover:shadow-lg
            transform hover:-translate-y-0.5
            transition-all duration-200 ease-out
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
            min-h-[52px]
          "
        >
          {/* WhatsApp icon */}
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          {whatsappLabel}
        </a>
      </div>
    </div>
  );
}
