"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

interface FeaturedViewAllProps {
  text: string;
  href: string;
}

export function FeaturedViewAll({ text, href }: FeaturedViewAllProps) {
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
      className="text-center transition-all duration-600 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Link
        href={href}
        className="
          inline-flex items-center gap-2
          px-8 py-3.5
          bg-ocean hover:bg-ocean-dark
          text-white font-heading font-semibold
          text-[0.9375rem]
          rounded-full
          shadow-sm hover:shadow-md
          transform hover:-translate-y-0.5
          transition-all duration-200 ease-out
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean
          min-h-[48px]
        "
      >
        {text}
        <svg
          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
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
