"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface OurStoryProps {
  tagline: string;
  headline: string;
  body: string;
  image: { url: string; lqip?: string } | null;
  foundedYear: number;
}

export function OurStory({ tagline, headline, body, image, foundedYear }: OurStoryProps) {
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

  const paragraphs = body?.split("\n\n").filter(Boolean) ?? [];

  return (
    <section className="relative py-20 md:py-28 bg-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 100%, rgba(14,165,183,0.08) 0%, transparent 60%), radial-gradient(circle at 100% 0%, rgba(0,95,134,0.06) 0%, transparent 60%)",
        }}
      />

      <div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* ── Text column ─────────────────────────────────────────────── */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(-24px)",
            }}
          >
            {/* Tagline */}
            {tagline && (
              <p className="font-heading font-semibold text-teal text-sm uppercase tracking-widest mb-4">
                {tagline}
              </p>
            )}

            {/* Section divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[80px] bg-teal" />
              <div className="w-1.5 h-1.5 rounded-full bg-sunset" />
              <div className="h-px w-6 bg-teal" />
            </div>

            {/* Headline */}
            <h2 className="font-heading font-bold text-navy text-3xl sm:text-4xl leading-tight mb-8">
              {headline}
            </h2>

            {/* Body paragraphs */}
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-gray-600 text-base md:text-lg leading-relaxed transition-all duration-600 ease-out"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(12px)",
                    transitionDelay: `${100 + i * 80}ms`,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Founded badge */}
            {foundedYear && (
              <div
                className="inline-flex items-center gap-3 mt-8 px-5 py-3 rounded-full border border-ocean/20 bg-ocean/5 transition-all duration-600 ease-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: "400ms",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-ocean" />
                <span className="font-heading font-semibold text-ocean text-sm">
                  Proudly serving guests since {foundedYear}
                </span>
              </div>
            )}
          </div>

          {/* ── Image column ─────────────────────────────────────────────── */}
          <div
            className="relative transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateX(0)" : "translateX(24px)",
              transitionDelay: "150ms",
            }}
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-xl">
              {image?.url ? (
                <Image
                  src={image.url}
                  alt="Grand Bay team on the water"
                  fill
                  quality={80}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder={image.lqip ? "blur" : "empty"}
                  blurDataURL={image.lqip}
                  className="object-cover object-center"
                />
              ) : (
                /* Placeholder when no image uploaded */
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "linear-gradient(160deg, #005F86 0%, #0EA5B7 100%)",
                  }}
                >
                  <svg
                    className="w-24 h-24 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}

              {/* Teal border accent */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>

            {/* Floating "Est." badge */}
            {foundedYear && (
              <div className="absolute -bottom-4 -left-4 z-10 bg-white rounded-2xl shadow-lg px-5 py-4 border border-sand-dark/20">
                <p className="font-heading font-bold text-ocean text-2xl leading-none">
                  Est. {foundedYear}
                </p>
                <p className="font-body text-gray-500 text-xs mt-1">Grand Bay</p>
              </div>
            )}

            {/* Decorative teal box offset behind image */}
            <div className="absolute -z-10 -bottom-3 -right-3 w-full h-full rounded-2xl bg-teal/10 border border-teal/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
