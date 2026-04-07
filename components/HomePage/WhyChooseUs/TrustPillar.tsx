"use client";

import { useEffect, useRef, useState } from "react";
import { TrustPillarIcon } from "./TrustPillarIcon";

interface TrustPillarData {
  icon: string;
  title: string;
  description: string;
}

interface TrustPillarProps {
  pillar: TrustPillarData;
  index: number;
}

export function TrustPillar({ pillar, index }: TrustPillarProps) {
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

  return (
    <div
      ref={ref}
      className="
        group
        bg-white rounded-xl
        p-6 md:p-7
        text-center
        shadow-sm hover:shadow-md
        transform hover:-translate-y-1
        transition-all duration-300 ease-out
      "
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Icon circle */}
      <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-ocean/8 mb-5 transition-colors duration-300 group-hover:bg-ocean/12">
        <TrustPillarIcon
          icon={pillar.icon}
          className="w-7 h-7 md:w-8 md:h-8 text-ocean transition-colors duration-300 group-hover:text-teal"
        />
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-slate text-base md:text-lg leading-snug mb-2.5">
        {pillar.title}
      </h3>

      {/* Description */}
      <p className="font-body text-gray-dark text-sm leading-relaxed">
        {pillar.description}
      </p>
    </div>
  );
}
