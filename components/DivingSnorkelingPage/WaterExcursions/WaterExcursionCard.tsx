"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { WaterExcursion } from "./WaterExcursionsSection";

/* ---------------------------------------------------------------------------
   WaterExcursionCard — Excursion card for diving/snorkeling sections
   
   Same visual structure as FeaturedExcursionCard:
   - Image area with hover zoom, badge (top-left), duration pill (bottom)
   - Content area with title, summary, price + CTA row
   
   Uses the card-excursion utility class from globals.css for consistent
   rounded corners, shadow, and hover lift.
   
   Scroll-triggered with staggered entrance per card (120ms apart).
   --------------------------------------------------------------------------- */

interface WaterExcursionCardProps {
  excursion: WaterExcursion;
  index: number;
  labels: {
    from: string;
    perPerson: string;
    viewDetails: string;
    featured: string;
  };
  currencySymbol: string;
}

export function WaterExcursionCard({
  excursion,
  index,
  labels,
  currencySymbol,
}: WaterExcursionCardProps) {
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
        className="group card-excursion flex flex-col h-full"
      >
        {/* ── Image area ──────────────────────────────────────────── */}
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={excursion.image.url}
            alt={excursion.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={excursion.image.lqip ? "blur" : "empty"}
            blurDataURL={excursion.image.lqip}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Dark gradient for readability of bottom pills */}
          <div
            className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
            }}
          />

          {/* Badge — top left */}
          {excursion.badge && (
            <span className="absolute top-3 left-3 z-[2] inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold uppercase tracking-wide bg-sunset/90 text-white backdrop-blur-sm">
              {excursion.badge}
            </span>
          )}

          {/* Featured indicator — small star if featured but no badge */}
          {excursion.isFeatured && !excursion.badge && (
            <span className="absolute top-3 left-3 z-[2] inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold uppercase tracking-wide bg-ocean/90 text-white backdrop-blur-sm">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {labels.featured}
            </span>
          )}

          {/* Duration pill — bottom of image */}
          <div className="absolute bottom-3 left-3 z-[2] flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate text-xs font-medium rounded-full">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              {excursion.duration}
            </span>
          </div>
        </div>

        {/* ── Content area ────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          {/* Title */}
          <h3 className="font-heading font-bold text-slate text-lg md:text-xl leading-snug mb-2 group-hover:text-ocean transition-colors duration-200">
            {excursion.title}
          </h3>

          {/* Summary — 2 line clamp */}
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
                <span className="text-xs font-normal text-gray-dark ml-1">
                  {labels.perPerson}
                </span>
              </p>
            </div>

            {/* View details arrow link */}
            <span className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-teal group-hover:text-ocean transition-colors duration-200">
              {labels.viewDetails}
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
