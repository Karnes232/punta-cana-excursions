"use client";

import { useEffect, useRef, useState } from "react";

interface WhatToBringListProps {
  items: string[];
}

export function WhatToBringList({ items }: WhatToBringListProps) {
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
          {/* Sunset-tinted bag icon — "pack this" feel */}
          <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-sunset/10 flex items-center justify-center">
            <svg
              className="w-3.5 h-3.5 text-sunset"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
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
