"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { ExcursionCardBadge } from "./ExcursionCardBadge";
import type { BrowseExcursion } from "./ExcursionGrid";

interface ExcursionBrowseCardProps {
  excursion: BrowseExcursion;
  index: number;
  currencySymbol: string;
  labels: {
    from: string;
    perPerson: string;
    viewAndBook: string;
  };
}

export function ExcursionBrowseCard({
  excursion,
  index,
  currencySymbol,
  labels,
}: ExcursionBrowseCardProps) {
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
      { threshold: 0.1 },
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
        transitionDelay: `${Math.min(index * 100, 400)}ms`,
      }}
    >
      <Link
        href={`/excursions/${excursion.slug}`}
        className="group block card-excursion h-full flex flex-col"
      >
        {/* Image area */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={excursion.image.url}
            alt={excursion.image.alt}
            fill
            sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) min(50vw, 30rem), min(24rem, 100vw)"
            placeholder={excursion.image.lqip ? "blur" : "empty"}
            blurDataURL={excursion.image.lqip}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />

          {/* Subtle bottom gradient for metadata readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
            }}
          />

          {/* Badge */}
          {excursion.badge && <ExcursionCardBadge text={excursion.badge} />}

          {/* Metadata pills — bottom-left of image */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-[1]">
            {/* Duration pill */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-ocean"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {excursion.duration}
            </span>

            {/* Category pill */}
            <span className="inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate">
              {excursion.category}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          {/* Title */}
          <h3 className="font-heading font-bold text-slate text-lg leading-snug mb-2 group-hover:text-ocean transition-colors duration-200">
            {excursion.title}
          </h3>

          {/* Summary */}
          <p className="font-body text-gray-dark text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
            {excursion.summary}
          </p>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-4 border-t border-sand-dark">
            <div>
              <span className="text-xs text-gray font-body">{labels.from}</span>
              <p className="font-heading font-bold text-ocean text-xl leading-none">
                {currencySymbol}
                {excursion.price}
                <span className="text-xs font-medium text-gray ml-0.5">
                  {labels.perPerson}
                </span>
              </p>
            </div>

            {/* CTA button */}
            <span className="btn-primary text-sm !py-2 !px-5">
              {labels.viewAndBook}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
