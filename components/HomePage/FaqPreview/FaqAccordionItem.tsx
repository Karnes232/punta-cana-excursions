"use client";

import { useRef, useId } from "react";

interface FaqAccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: FaqAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const headingId = `faq-heading-${id}`;
  const panelId = `faq-panel-${id}`;

  return (
    <div
      className={`
        rounded-xl border transition-colors duration-200
        ${isOpen ? "border-ocean/15 bg-ocean/[0.02]" : "border-sand-dark bg-white"}
      `}
    >
      {/* Question button */}
      <h3>
        <button
          id={headingId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="
            w-full flex items-center justify-between
            px-5 md:px-6 py-4 md:py-5
            text-left
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean
            rounded-xl
            group
            min-h-[48px]
          "
        >
          <span className="font-heading font-semibold text-slate text-[0.9375rem] md:text-base leading-snug pr-4 group-hover:text-ocean transition-colors duration-200">
            {question}
          </span>

          {/* Chevron — rotates on open */}
          <span
            className={`
              flex-shrink-0 w-8 h-8 rounded-full
              flex items-center justify-center
              transition-all duration-300 ease-out
              ${isOpen ? "bg-ocean/10 rotate-180" : "bg-sand group-hover:bg-ocean/8"}
            `}
            aria-hidden="true"
          >
            <svg
              className={`w-4 h-4 transition-colors duration-200 ${
                isOpen ? "text-ocean" : "text-gray-dark group-hover:text-ocean"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </button>
      </h3>

      {/* Answer panel — animated with grid-rows for smooth height */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
        }}
      >
        <div className="overflow-hidden">
          <div ref={contentRef} className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
            {/* Small accent line above answer */}
            <div
              className="w-8 h-[2px] rounded-full bg-sunset/40 mb-3"
              aria-hidden="true"
            />
            <p className="font-body text-gray-dark text-sm md:text-[0.9375rem] leading-relaxed">
              {answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
