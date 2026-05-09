"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ---------------------------------------------------------------------------
   DivingCTAContent — Headline + CTAs with scroll-triggered reveal
   
   Animation cascade:
     Headline (0ms) → Subtext (150ms) → Buttons (300ms)
   
   Two CTAs:
     1. WhatsApp (green, primary — drives the most conversions)
     2. Contact page (ghost outline — secondary fallback)
   --------------------------------------------------------------------------- */

interface DivingCTAContentProps {
  headline: string;
  subtext?: string;
  whatsappButtonText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  contactButtonText: string;
  contactHref: string;
}

export function DivingCTAContent({
  headline,
  subtext,
  whatsappButtonText,
  whatsappNumber,
  whatsappMessage,
  contactButtonText,
  contactHref,
}: DivingCTAContentProps) {
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

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div
      ref={ref}
      className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 text-center"
    >
      {/* Headline */}
      <h2
        className="font-heading font-bold text-white leading-tight mb-4 transition-all duration-700 ease-out"
        style={{
          fontSize: "clamp(1.625rem, 3.5vw + 0.25rem, 2.5rem)",
          transform: isVisible ? "translateY(0)" : "translateY(20px)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        {headline}
      </h2>

      {/* Subtext */}
      {subtext && (
        <p
          className="font-body text-white/75 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8 transition-all duration-700 ease-out"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
            opacity: isVisible ? 1 : 0,
            transitionDelay: "150ms",
          }}
        >
          {subtext}
        </p>
      )}

      {/* CTA buttons */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(16px)",
          opacity: isVisible ? 1 : 0,
          transitionDelay: subtext ? "300ms" : "200ms",
        }}
      >
        {/* WhatsApp — primary action */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-whatsapp text-white font-heading font-semibold text-[0.9375rem] rounded-full shadow-lg transition-all duration-200 hover:bg-whatsapp-dark hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] min-w-[200px] justify-center"
        >
          {/* WhatsApp icon */}
          <svg
            className="w-[18px] h-[18px] flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.463 3.49 11.815 11.815 0 0012.05 0zm0 21.75c-1.774 0-3.513-.477-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374A9.86 9.86 0 012.17 11.892C2.17 6.507 6.545 2.133 11.95 2.133c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884l.104-.159z" />
          </svg>
          {whatsappButtonText}
        </a>

        {/* Contact — secondary action */}
        <Link
          href={contactHref}
          className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-heading font-semibold text-[0.9375rem] rounded-full border border-white/30 transition-all duration-200 hover:bg-white/10 hover:border-white/50 hover:-translate-y-0.5 min-w-[200px] justify-center"
        >
          {contactButtonText}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}