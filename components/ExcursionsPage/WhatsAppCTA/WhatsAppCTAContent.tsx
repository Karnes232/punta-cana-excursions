"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface WhatsAppCTAContentProps {
  headline: string;
  description: string;
  whatsappUrl: string;
  whatsappButtonText: string;
  contactHref: string;
  contactButtonText: string;
}

export function WhatsAppCTAContent({
  headline,
  description,
  whatsappUrl,
  whatsappButtonText,
  contactHref,
  contactButtonText,
}: WhatsAppCTAContentProps) {
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
        {/* WhatsApp button — accent green */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group
            inline-flex items-center justify-center gap-2.5
            px-6 py-3
            bg-whatsapp text-white
            font-heading font-semibold text-sm
            rounded-full
            shadow-sm
            transition-all duration-200 ease-out
            hover:bg-whatsapp-dark hover:shadow-md hover:-translate-y-0.5
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp/40 focus-visible:ring-offset-2
          "
        >
          <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />
          {whatsappButtonText}
        </a>

        {/* Contact / Email button — secondary style */}
        <Link
          href={contactHref}
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
          {/* Email icon */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {contactButtonText}
        </Link>
      </div>
    </div>
  );
}
