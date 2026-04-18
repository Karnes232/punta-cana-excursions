"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { RelatedExcursionData } from "./RelatedExcursions";

interface RelatedExcursionCardProps {
  excursion: RelatedExcursionData;
  index: number;
  labels: {
    viewDetails: string;
    from: string;
  };
}

export function RelatedExcursionCard({
  excursion,
  index,
  labels,
}: RelatedExcursionCardProps) {
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
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <Link
        href={excursion.href ?? `/excursions/${excursion.slug}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-sand-dark/25 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={excursion.image.asset.url}
            alt={excursion.title}
            fill
            quality={75}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            placeholder={excursion.image.lqip ? "blur" : "empty"}
            blurDataURL={excursion.image.lqip}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Badge — top left */}
          {excursion.badge && (
            <span className="absolute top-3 left-3 z-[2] inline-flex items-center px-2.5 py-1 bg-sunset/90 backdrop-blur-sm text-white text-[10px] font-heading font-semibold tracking-wider uppercase rounded-full">
              {excursion.badge}
            </span>
          )}

          {/* Category pill — bottom left */}
          <span className="absolute bottom-3 left-3 z-[2] inline-flex items-center px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate text-xs font-body font-medium rounded-full">
            {excursion.category}
          </span>

          {/* Duration pill — bottom right */}
          <span className="absolute bottom-3 right-3 z-[2] inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-slate text-xs font-body font-medium rounded-full">
            <svg
              className="w-3 h-3 text-ocean"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {excursion.duration}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          {/* Title */}
          <h3 className="font-heading font-bold text-slate text-lg md:text-xl leading-snug mb-2 group-hover:text-ocean transition-colors duration-200">
            {excursion.title}
          </h3>

          {/* Summary */}
          <p className="font-body text-gray-400 text-sm leading-relaxed mb-5 flex-1 line-clamp-2">
            {excursion.summary}
          </p>

          {/* Price + CTA row */}
          <div className="flex items-center justify-between pt-4 border-t border-sand-dark/25">
            <div>
              <span className="text-xs font-body text-gray-400">
                {labels.from}
              </span>
              <p className="font-heading font-bold text-ocean text-xl leading-none">
                ${excursion.price}
              </p>
            </div>

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
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
