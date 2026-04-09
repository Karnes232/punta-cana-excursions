"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { FaqItem } from "./ExcursionFaq";

interface ExcursionFaqAccordionProps {
  items: FaqItem[];
}

export function ExcursionFaqAccordion({ items }: ExcursionFaqAccordionProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
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

  const toggle = useCallback((key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  }, []);

  return (
    <div ref={ref} className="flex flex-col" role="list">
      {items.map((item, i) => {
        const isOpen = openKey === item._key;

        return (
          <div
            key={item._key}
            className="border-b border-sand-dark/30 last:border-b-0 transition-all duration-500 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              transitionDelay: `${i * 70}ms`,
            }}
            role="listitem"
          >
            {/* Question button */}
            <button
              type="button"
              onClick={() => toggle(item._key)}
              className="group flex items-center justify-between gap-4 w-full py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item._key}`}
              id={`faq-question-${item._key}`}
            >
              <span className="font-heading font-semibold text-sm md:text-[15px] text-slate leading-snug group-hover:text-ocean transition-colors duration-200">
                {item.question}
              </span>

              {/* Rotating chevron */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full bg-sand flex items-center justify-center transition-all duration-300"
                style={{
                  background: isOpen ? "rgba(0, 95, 134, 0.08)" : undefined,
                }}
              >
                <svg
                  className="w-4 h-4 text-ocean/60 transition-transform duration-300"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
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
              </div>
            </button>

            {/* Answer panel — CSS grid trick for smooth height animation */}
            <div
              id={`faq-answer-${item._key}`}
              role="region"
              aria-labelledby={`faq-question-${item._key}`}
              className="grid transition-all duration-300 ease-out"
              style={{
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                opacity: isOpen ? 1 : 0,
              }}
            >
              <div className="overflow-hidden">
                <p className="font-body text-sm md:text-[15px] text-slate/70 leading-[1.7] pb-5 pr-10">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
