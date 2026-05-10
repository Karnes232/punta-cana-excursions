"use client";

import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

interface WordRevealHeadingProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  triggerOnMount?: boolean;
  staggerMs?: number;
  initialDelayMs?: number;
  durationMs?: number;
  style?: CSSProperties;
}

export function WordRevealHeading({
  text,
  as = "h2",
  className,
  triggerOnMount = false,
  staggerMs = 80,
  initialDelayMs = 200,
  durationMs = 700,
  style,
}: WordRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) {
      setReducedMotion(true);
      setIsVisible(true);
      return;
    }

    if (triggerOnMount) {
      const t = setTimeout(() => setIsVisible(true), 150);
      return () => clearTimeout(t);
    }

    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnMount]);

  const words = text.split(" ");

  return createElement(
    as,
    { ref, className, style },
    words.map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden mr-[0.28em] last:mr-0 align-bottom"
      >
        <span
          className="inline-block ease-out"
          style={
            reducedMotion
              ? undefined
              : {
                  transform: isVisible ? "translateY(0)" : "translateY(100%)",
                  opacity: isVisible ? 1 : 0,
                  transition: `transform ${durationMs}ms ease-out, opacity ${durationMs}ms ease-out`,
                  transitionDelay: `${initialDelayMs + i * staggerMs}ms`,
                  willChange: "transform, opacity",
                }
          }
        >
          {word}
        </span>
      </span>
    )),
  );
}
