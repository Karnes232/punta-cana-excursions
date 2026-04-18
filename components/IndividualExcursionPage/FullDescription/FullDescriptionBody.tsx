"use client";

import { useEffect, useRef, useState } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { PortableTextReactComponents } from "@portabletext/react";

interface FullDescriptionBodyProps {
  body: PortableTextBlock[];
}

/**
 * Custom Portable Text component map — applies the site's brand typography
 * and spacing to all block-level and inline elements from Sanity.
 *
 * This keeps Portable Text rendering consistent site-wide.
 * If you already have a shared BlockContent renderer at src/components/BlockContent,
 * you can import that instead and delete these custom components.
 */
export const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    // Standard paragraph
    normal: ({ children }) => (
      <p className="font-body text-slate/85 leading-[1.75] mb-5 last:mb-0">
        {children}
      </p>
    ),
    // Headings within the rich text body
    h2: ({ children }) => (
      <h3 className="font-heading font-bold text-slate text-xl md:text-2xl leading-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="font-heading font-semibold text-slate text-lg md:text-xl leading-tight mt-6 mb-3">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="font-heading font-semibold text-slate text-base md:text-lg leading-snug mt-5 mb-2.5">
        {children}
      </h5>
    ),
    // Block quote — children are inline nodes from PT; avoid an inner <p> (can duplicate or nest badly vs browser parsing)
    blockquote: ({ children }) => (
      <blockquote className="relative pl-5 border-l-[3px] border-teal/40 my-6 py-1 font-body text-slate/75 italic leading-[1.7]">
        {children}
      </blockquote>
    ),
  },

  list: {
    // Unordered list
    bullet: ({ children }) => (
      <ul className="space-y-2 mb-5 pl-1">{children}</ul>
    ),
    // Ordered list
    number: ({ children }) => (
      <ol className="space-y-2 mb-5 pl-1 list-decimal list-inside">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-2.5 font-body text-slate/85 leading-[1.7]">
        {/* Custom bullet — teal checkmark instead of generic disc */}
        <svg
          className="w-4 h-4 text-teal flex-shrink-0 mt-1.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        {/* Use a div: PT can render block-level nodes here when list item style ≠ normal; <span> + <p> breaks hydration */}
        <div className="min-w-0 flex-1">{children}</div>
      </li>
    ),
    number: ({ children }) => (
      <li className="font-body text-slate/85 leading-[1.7]">{children}</li>
    ),
  },

  marks: {
    // Bold
    strong: ({ children }) => (
      <strong className="font-semibold text-slate">{children}</strong>
    ),
    // Italic
    em: ({ children }) => <em className="italic">{children}</em>,
    // Inline link
    link: ({ children, value }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http") || href.startsWith("mailto:");
      return (
        <a
          href={href}
          className="text-ocean underline decoration-ocean/30 underline-offset-2 hover:decoration-ocean/70 transition-colors duration-200"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function FullDescriptionBody({ body }: FullDescriptionBodyProps) {
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

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(14px)",
        transitionDelay: "100ms",
      }}
    >
      <PortableText value={body} components={portableTextComponents} />
    </div>
  );
}
