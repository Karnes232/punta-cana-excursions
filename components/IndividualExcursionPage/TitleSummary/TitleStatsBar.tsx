"use client";

import { useEffect, useRef, useState } from "react";

interface TitleStatsBarProps {
  stats: {
    duration: string;
    pickupTime?: string;
    groupSize?: string;
    pickupZones?: string[];
  };
  labels: {
    duration: string;
    pickup: string;
    groupSize: string;
    pickupZones: string;
  };
}

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function TitleStatsBar({ stats, labels }: TitleStatsBarProps) {
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
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Build stat items dynamically — only render those with data
  const items: StatItem[] = [];

  items.push({
    icon: <ClockIcon />,
    label: labels.duration,
    value: stats.duration,
  });

  if (stats.pickupTime) {
    items.push({
      icon: <MapPinIcon />,
      label: labels.pickup,
      value: stats.pickupTime,
    });
  }

  if (stats.groupSize) {
    items.push({
      icon: <UsersIcon />,
      label: labels.groupSize,
      value: stats.groupSize,
    });
  }

  if (stats.pickupZones && stats.pickupZones.length > 0) {
    items.push({
      icon: <GlobeIcon />,
      label: labels.pickupZones,
      value: stats.pickupZones.join(", "),
    });
  }

  return (
    <div ref={ref} className="flex flex-wrap gap-3 md:gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 bg-sand rounded-xl border border-sand-dark/30 transition-all duration-600 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(12px)",
            transitionDelay: `${i * 80}ms`,
          }}
        >
          {/* Icon */}
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-ocean/8 flex items-center justify-center text-ocean">
            {item.icon}
          </div>

          {/* Label + Value */}
          <div className="min-w-0">
            <p className="text-[11px] font-heading font-semibold text-gray-400 uppercase tracking-wider leading-none mb-1">
              {item.label}
            </p>
            <p className="text-sm font-body font-medium text-slate leading-snug">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Inline SVG Icons — consistent 18×18, strokeWidth 1.8
// =============================================================================

function ClockIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
      />
    </svg>
  );
}
