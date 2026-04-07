"use client";

import { useEffect, useRef, useState } from "react";
import { StarRating } from "./StarRating";

interface ReviewData {
  name: string;
  country?: string;
  text: string;
  rating: number;
  excursionTitle?: string;
}

interface ReviewCardProps {
  review: ReviewData;
  index: number;
}

export function ReviewCard({ review, index }: ReviewCardProps) {
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

  // Generate initials for avatar
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={ref}
      className="
        flex-shrink-0 snap-start
        w-[85vw] sm:w-[380px] lg:w-auto
        transition-all duration-700 ease-out
      "
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="bg-white rounded-xl p-6 md:p-7 shadow-sm h-full flex flex-col">
        {/* Star rating */}
        <div className="mb-4">
          <StarRating rating={review.rating} />
        </div>

        {/* Quote icon */}
        <div className="mb-3" aria-hidden="true">
          <svg
            className="w-7 h-7 text-teal/20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5 3.871 3.871 0 0 1-2.748-1.179Z" />
          </svg>
        </div>

        {/* Review text */}
        <p className="font-body text-slate text-[0.9375rem] leading-relaxed mb-6 flex-1">
          {review.text}
        </p>

        {/* Reviewer info */}
        <div className="flex items-center gap-3 pt-4 border-t border-sand-dark">
          {/* Avatar circle with initials */}
          <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-semibold text-ocean text-sm">
              {initials}
            </span>
          </div>

          <div className="min-w-0">
            <p className="font-heading font-semibold text-slate text-sm leading-tight truncate">
              {review.name}
            </p>
            {review.country && (
              <p className="font-body text-gray text-xs leading-tight mt-0.5">
                {review.country}
              </p>
            )}
          </div>

          {/* Excursion tag — if present */}
          {review.excursionTitle && (
            <span className="ml-auto flex-shrink-0 inline-flex items-center px-2.5 py-1 bg-teal/8 text-teal text-xs font-medium rounded-full max-w-[140px] truncate">
              {review.excursionTitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
