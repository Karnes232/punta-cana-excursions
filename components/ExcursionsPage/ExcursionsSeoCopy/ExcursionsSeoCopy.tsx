"use client";

import { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";
import { portableTextComponents } from "@/components/IndividualExcursionPage/FullDescription/FullDescriptionBody";

interface ExcursionsSeoCopyProps {
  eyebrow?: string;
  heading: string;
  body: PortableTextBlock[];
}

/**
 * Bottom-of-page SEO copy block — sits after the Contact CTA.
 * Eyebrow + H2 + long-form rich text for targeting longer-tail keywords
 * without cluttering the top of the page.
 */
export function ExcursionsSeoCopy({
  eyebrow,
  heading,
  body,
}: ExcursionsSeoCopyProps) {
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
      { threshold: 0.2 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Nothing to render if both heading and body are empty
  if (!heading && (!body || body.length === 0)) return null;

  return (
    <section className="section-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <div ref={ref} className="text-center">
          {eyebrow && (
            <p
              className="font-heading font-semibold text-teal text-sm tracking-widest uppercase mb-3 transition-all duration-600 ease-out"
              style={{
                transform: isVisible ? "translateY(0)" : "translateY(12px)",
                opacity: isVisible ? 1 : 0,
              }}
            >
              {eyebrow}
            </p>
          )}

          {heading && (
            <div className="max-w-3xl mx-auto">
              <WordRevealHeading
                as="h2"
                text={heading}
                className="font-heading font-bold text-slate leading-tight mb-4"
                style={{ fontSize: "clamp(1.5rem, 2.5vw + 0.25rem, 2rem)" }}
              />
            </div>
          )}

          {/* Tri-part accent divider */}
          <div
            className="flex items-center justify-center gap-2 mb-6 transition-all duration-600 ease-out"
            style={{
              transform: isVisible ? "translateY(0)" : "translateY(12px)",
              opacity: isVisible ? 1 : 0,
              transitionDelay: "100ms",
            }}
            aria-hidden="true"
          >
            <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
            <span className="block w-10 h-[3px] rounded-full bg-sunset" />
            <span className="block w-6 h-[3px] rounded-full bg-teal/40" />
          </div>
        </div>

        {body?.length > 0 && (
          <div className="text-left">
            <PortableText value={body} components={portableTextComponents} />
          </div>
        )}
      </div>
    </section>
  );
}
