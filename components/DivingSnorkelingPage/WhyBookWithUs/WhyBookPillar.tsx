"use client";

import { useEffect, useRef, useState } from "react";
import { WhyBookPillarIcon } from "./WhyBookPillarIcon";

/* ---------------------------------------------------------------------------
   WhyBookPillar — Trust pillar card for the diving page
   
   Same layout as Home TrustPillar:
   - Icon circle (centered)
   - Title (heading font)
   - Description (body font)
   
   Visual differences:
   - Left border accent in teal → ocean on hover
   - Icon circle: soft teal background → shifts on hover
   - Text-left alignment (more editorial/serious vs centered in Home)
   --------------------------------------------------------------------------- */

interface WhyBookPillarData {
  icon: string;
  title: string;
  description: string;
}

interface WhyBookPillarProps {
  pillar: WhyBookPillarData;
  index: number;
}

export function WhyBookPillar({ pillar, index }: WhyBookPillarProps) {
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
        group relative
        bg-sand rounded-xl
        p-6 md:p-7
        border-l-[3px] border-teal/30
        hover:border-ocean
        shadow-sm hover:shadow-md
        transform hover:-translate-y-1
        transition-all duration-300 ease-out
      "
      style={{
        transform: isVisible
          ? "translateY(0)"
          : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Icon circle */}
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal/10 text-teal group-hover:bg-ocean/10 group-hover:text-ocean transition-colors duration-300 mb-4">
        <WhyBookPillarIcon icon={pillar.icon} className="w-6 h-6" />
      </div>

      {/* Title */}
      <h3 className="font-heading font-bold text-slate text-[15px] md:text-base leading-snug mb-2">
        {pillar.title}
      </h3>

      {/* Description */}
      <p className="font-body text-gray-dark text-sm leading-relaxed">
        {pillar.description}
      </p>
    </div>
  );
}