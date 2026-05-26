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
   WhereWeOperate — service-area section

   Centered header (eyebrow + h2 + tri-part divider) followed by a rich-text
   body describing the regions served. Background: section-white.
   --------------------------------------------------------------------------- */

interface WhereWeOperateProps {
  eyebrow?: string;
  headline: string;
  body?: PortableTextBlock[];
}

export function WhereWeOperate({ eyebrow, headline, body }: WhereWeOperateProps) {
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
    </section>
  );
}
