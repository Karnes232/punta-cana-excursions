"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

interface FaqPreviewCtaProps {
  text: string;
  href: string;
}

export function FaqPreviewCta({ text, href }: FaqPreviewCtaProps) {
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
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="text-center mt-8 transition-all duration-600 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Link
        href={href}
        className="
          inline-flex items-center gap-1.5
          font-heading font-semibold text-ocean text-sm
          hover:text-teal
          transition-colors duration-200
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean
          group
        "
      >
        {text}
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
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
    </div>
  );
}
