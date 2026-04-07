"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface BrandIntroImageProps {
  src: string;
  alt: string;
  lqip?: string;
}

export function BrandIntroImage({ src, alt, lqip }: BrandIntroImageProps) {
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
      {/* Decorative offset border — teal accent behind image */}
      <div
        className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-full h-full rounded-2xl border-2 border-teal/30"
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

        {/* Subtle warm overlay to tie into brand palette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(14,165,183,0.08) 0%, rgba(244,161,26,0.06) 100%)",
          }}
        />
      </div>
    </div>
  );
}
