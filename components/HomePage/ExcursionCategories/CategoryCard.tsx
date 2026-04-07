"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

interface ExcursionCategory {
  slug: string;
  title: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  excursionCount?: number;
}

interface CategoryCardProps {
  category: ExcursionCategory;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
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
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <Link
        href={`/excursions?category=${category.slug}`}
        className="group relative block aspect-[4/3] md:aspect-[3/2] rounded-xl overflow-hidden"
      >
        {/* Background image */}
        <Image
          src={category.image.url}
          alt={category.image.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
          placeholder={category.image.lqip ? "blur" : "empty"}
          blurDataURL={category.image.lqip}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />

        {/* Gradient overlay — darker at bottom for text readability */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: `
              linear-gradient(
                to top,
                rgba(0, 30, 50, 0.78) 0%,
                rgba(0, 30, 50, 0.35) 45%,
                rgba(0, 30, 50, 0.12) 100%
              )
            `,
          }}
        />

        {/* Hover brightening overlay */}
        <div className="absolute inset-0 bg-teal/0 group-hover:bg-teal/15 transition-colors duration-300" />

        {/* Content — anchored to bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 z-10">
          {/* Category title */}
          <h3 className="font-heading font-bold text-white text-base md:text-lg leading-tight mb-1">
            {category.title}
          </h3>

          {/* Excursion count */}
          {category.excursionCount != null && category.excursionCount > 0 && (
            <p className="font-body text-white/70 text-xs md:text-sm">
              {category.excursionCount}{" "}
              {category.excursionCount === 1 ? "excursion" : "excursions"}
            </p>
          )}

          {/* Hover arrow indicator */}
          <div className="mt-2 flex items-center gap-1.5 text-white/0 group-hover:text-white/90 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="text-xs font-heading font-semibold">Explore</span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
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
          </div>
        </div>

        {/* Top-right decorative corner accent — subtle brand touch */}
        <div
          className="absolute top-3 right-3 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M32 0 L32 12 L28 12 L28 4 L20 4 L20 0 Z"
              fill="white"
              fillOpacity="0.4"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
}
