"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

interface FeaturedExcursion {
  slug: string;
  title: string;
  summary: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  price: number;
  duration: string;
  category: string;
  badge?: string;
}

interface FeaturedExcursionCardProps {
  excursion: FeaturedExcursion;
  index: number;
  currencySymbol: string;
}

export function FeaturedExcursionCard({
  excursion,
  index,
  currencySymbol,
}: FeaturedExcursionCardProps) {
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
      { threshold: 0.15 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(28px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <Link
        href={`/excursions/${excursion.slug}`}
        className="group block card-excursion h-full flex flex-col"
      >
        {/* Image container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={excursion.image.url}
            alt={excursion.image.alt}
            fill
            sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) min(50vw, 30rem), min(24rem, 100vw)"
            placeholder={excursion.image.lqip ? "blur" : "empty"}
            blurDataURL={excursion.image.lqip}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/10 transition-colors duration-300" />

          {/* Badge */}
          {excursion.badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1 bg-sunset text-white text-xs font-heading font-semibold rounded-full shadow-sm">
                {excursion.badge}
              </span>
            </div>
          )}

          {/* Category + Duration pills — bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate text-xs font-medium rounded-full">
              {/* Clock icon */}
              <svg
                className="w-3.5 h-3.5 text-teal"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {excursion.duration}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate text-xs font-medium rounded-full">
              {excursion.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          {/* Title */}
          <h3 className="font-heading font-bold text-slate text-lg md:text-xl leading-snug mb-2 group-hover:text-ocean transition-colors duration-200">
            {excursion.title}
          </h3>

          {/* Summary */}
          <p className="font-body text-gray-dark text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
            {excursion.summary}
          </p>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
            <div>
              <span className="text-xs text-gray font-body">From</span>
              <p className="font-heading font-bold text-ocean text-xl leading-none">
                {currencySymbol}
                {excursion.price}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-teal group-hover:text-ocean transition-colors duration-200">
              View details
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
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
