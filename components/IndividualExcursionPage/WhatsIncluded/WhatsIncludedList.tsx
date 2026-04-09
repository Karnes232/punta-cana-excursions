"use client";

import { useEffect, useRef, useState } from "react";

interface WhatsIncludedListProps {
  items: string[];
}

export function WhatsIncludedList({ items }: WhatsIncludedListProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

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

  return (
    <ul ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-3 transition-all duration-500 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-10px)",
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {/* Green circle-check — "included" feel */}
          <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-teal/12 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-teal"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <span className="font-body text-sm md:text-[15px] text-slate/85 leading-relaxed">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
