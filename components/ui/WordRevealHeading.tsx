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
  const [isRunning, setIsRunning] = useState(triggerOnMount);

  useEffect(() => {
    if (triggerOnMount) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRunning(true);
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
          data-animate="word-reveal"
          style={{
            animation: `word-reveal ${durationMs}ms ease-out ${initialDelayMs + i * staggerMs}ms both`,
            animationPlayState: isRunning ? "running" : "paused",
            willChange: "transform, opacity",
          }}
        >
          {word}
        </span>
      </span>
    )),
  );
}
