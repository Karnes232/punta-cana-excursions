"use client";

import { useEffect, useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface TitleHeadingProps {
  title: string;
  badge?: string | null;
}

export function TitleHeading({ title, badge }: TitleHeadingProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-start gap-3 md:gap-4">
      {/* H1 — the most important heading on the page */}
      <WordRevealHeading
        as="h1"
        text={title}
        triggerOnMount
        className="font-heading font-bold text-slate leading-[1.12] tracking-tight"
        style={{ fontSize: "clamp(1.625rem, 4vw, 2.75rem)" }}
      />

      {/* Badge pill — "Most Popular", "Best Seller", etc. */}
      {badge && (
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 mt-1.5 bg-sunset/10 text-sunset text-xs font-heading font-semibold tracking-wide uppercase rounded-full border border-sunset/20 whitespace-nowrap transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible
              ? "translateY(0) scale(1)"
              : "translateY(8px) scale(0.95)",
            transitionDelay: "200ms",
          }}
        >
          {/* Star icon */}
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {badge}
        </span>
      )}
    </div>
  );
}
