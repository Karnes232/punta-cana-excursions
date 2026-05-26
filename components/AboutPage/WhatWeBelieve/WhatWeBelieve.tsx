"use client";

import { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";
import {
  portableTextComponents,
  richTextBodyClass,
} from "@/components/IndividualExcursionPage/FullDescription/FullDescriptionBody";

/* ---------------------------------------------------------------------------
   WhatWeBelieve — "What We Believe" principles section

   Sits between Our Story and By the Numbers. Centered header (eyebrow + h2 +
   divider + rich-text body) followed by a grid of principle cards, each with
   an h3 and a rich-text body. Background: section-sand.
   --------------------------------------------------------------------------- */

interface BeliefPrinciple {
  headline: string;
  body: PortableTextBlock[];
}

interface WhatWeBelieveProps {
  eyebrow?: string;
  headline: string;
  body?: PortableTextBlock[];
  beliefs: BeliefPrinciple[];
}

export function WhatWeBelieve({
  eyebrow,
  headline,
  body,
  beliefs,
}: WhatWeBelieveProps) {
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

  const hasBody = !!body && body.length > 0;
  const hasBeliefs = beliefs.length > 0;

  // Nothing to render if the section is empty
  if (!headline && !hasBody && !hasBeliefs) return null;

  return (
    <section className="relative py-20 md:py-28 section-sand overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header */}
        <div
          className="text-center mb-14 transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(16px)",
          }}
        >
          {eyebrow && (
            <p className="font-heading font-semibold text-teal text-sm uppercase tracking-widest mb-4">
              {eyebrow}
            </p>
          )}

          <WordRevealHeading
            as="h2"
            text={headline}
            className="font-heading font-bold text-navy text-3xl sm:text-4xl mb-4"
          />

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-16 bg-teal" />
            <div className="w-1.5 h-1.5 rounded-full bg-sunset" />
            <div className="h-px w-16 bg-teal" />
          </div>

          {hasBody && (
            <div className={`${richTextBodyClass} text-gray-600 max-w-2xl mx-auto`}>
              <PortableText value={body} components={portableTextComponents} />
            </div>
          )}
        </div>

        {/* Principles grid */}
        {hasBeliefs && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {beliefs.map((principle, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-7 rounded-2xl border border-sand-dark/25 bg-white transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${100 + i * 70}ms`,
                }}
              >
                <span
                  className="block w-8 h-[3px] rounded-full bg-sunset"
                  aria-hidden="true"
                />
                <h3 className="font-heading h-12 line-clamp-2 font-bold text-navy text-lg leading-snug">
                  {principle.headline}
                </h3>
                <div className="font-body text-gray-500 text-sm leading-relaxed">
                  <PortableText
                    value={principle.body}
                    components={portableTextComponents}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
