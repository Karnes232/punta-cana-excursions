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

export interface ReviewCardLabels {
  readMore: string;
  readLess: string;
}

interface ReviewCardProps {
  review: ReviewData;
  index: number;
  labels: ReviewCardLabels;
}

export function ReviewCard({ review, labels }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Detect if the review text actually overflows the 4-line clamp; only then
  // do we render the Read more / Read less button.
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => {
      const wasExpanded = expanded;
      // Temporarily strip the clamp so we can measure full content height.
      if (wasExpanded) return; // when expanded we can't tell — leave button on
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [review.text, expanded]);

  // Generate initials for avatar
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex-shrink-0 w-[85vw] sm:w-[380px] lg:w-auto">
      <div className="bg-white rounded-xl p-6 md:p-7 shadow-sm flex flex-col">
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

        {/* Review text — clamped to 4 lines unless expanded */}
        <p
          ref={textRef}
          className={`font-body text-slate text-[0.9375rem] leading-relaxed ${
            expanded ? "" : "line-clamp-6"
          } ${isClamped ? "mb-2" : "mb-6"}`}
        >
          {review.text}
        </p>

        {isClamped && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="self-start mb-6 inline-flex items-center gap-1 text-sm font-heading font-semibold text-ocean hover:text-teal transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
          >
            {expanded ? labels.readLess : labels.readMore}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        )}

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
