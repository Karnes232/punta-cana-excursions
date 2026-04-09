"use client";

import { useEffect, useRef, useState } from "react";

interface RestrictionsListProps {
  items: string[];
}

export function RestrictionsList({ items }: RestrictionsListProps) {
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

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl border border-ocean/10 p-5 md:p-6 max-w-2xl"
    >
      <ul className="flex flex-col gap-4">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 transition-all duration-500 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transitionDelay: `${i * 70}ms`,
            }}
          >
            {/* Alert icon */}
            <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-ocean/8 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-ocean"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <span className="font-body text-sm md:text-[15px] text-slate/80 leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
