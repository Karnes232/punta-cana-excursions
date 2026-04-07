"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

interface FilterScrollFadeProps {
  children: ReactNode;
}

export function FilterScrollFade({ children }: FilterScrollFadeProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeft(scrollLeft > 4);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return (
    <div className="relative">
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(to right, var(--color-white) 0%, transparent 100%)",
          opacity: showLeft ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Scrollable content */}
      <div ref={scrollRef}>{children}</div>

      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-200"
        style={{
          background:
            "linear-gradient(to left, var(--color-white) 0%, transparent 100%)",
          opacity: showRight ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </div>
  );
}
