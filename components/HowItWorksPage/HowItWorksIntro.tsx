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
   HowItWorksIntro — intro section shown directly after the hero.

   Centered eyebrow + h2 + tri-part divider + rich-text body. Background:
   section-white (blends with the hero's white wave bottom edge).
   --------------------------------------------------------------------------- */

interface HowItWorksIntroProps {
  eyebrow?: string;
  headline: string;
  body?: PortableTextBlock[];
}

export function HowItWorksIntro({
  eyebrow,
  headline,
  body,
}: HowItWorksIntroProps) {
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

  const hasBody = !!body && body.length > 0;

  // Nothing to render if the section is empty
  if (!headline && !hasBody) return null;

  return (
    <section className="relative py-20 md:py-28 section-white overflow-hidden">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center transition-all duration-700 ease-out"
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
          className="font-heading font-bold text-slate leading-tight mb-4"
          style={{ fontSize: "clamp(1.625rem, 3vw + 0.25rem, 2.25rem)" }}
        />

        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
          <span className="block w-10 h-[3px] rounded-full bg-sunset" />
          <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
        </div>

        {hasBody && (
          <div className={`${richTextBodyClass} text-gray-dark max-w-2xl mx-auto`}>
            <PortableText value={body} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  );
}
