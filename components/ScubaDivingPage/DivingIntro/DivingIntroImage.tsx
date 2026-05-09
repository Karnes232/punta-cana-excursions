"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------------------------
   DivingIntroImage — Image with decorative offset border
   
   Same pattern as BrandIntroImage but:
   - Ocean blue offset border (instead of teal)
   - Offset positioned top-left (instead of bottom-right) since the image
     sits in the right column — balances the visual weight
   - Subtle blue-teal overlay instead of warm overlay
   --------------------------------------------------------------------------- */

interface DivingIntroImageProps {
  src: string;
  alt: string;
  lqip?: string;
}

export function DivingIntroImage({ src, alt, lqip }: DivingIntroImageProps) {
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
      className="relative transition-all duration-700 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Decorative offset border — ocean blue accent behind image */}
      <div
        className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-full h-full rounded-2xl border-2 border-ocean/25"
        aria-hidden="true"
      />

      {/* Main image container */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          placeholder={lqip ? "blur" : "empty"}
          blurDataURL={lqip}
          className="object-cover"
        />

        {/* Subtle cool overlay — underwater feel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,95,134,0.06) 0%, rgba(14,165,183,0.08) 100%)",
          }}
        />
      </div>
    </div>
  );
}
