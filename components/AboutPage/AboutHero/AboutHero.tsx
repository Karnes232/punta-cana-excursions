import Image from "next/image";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface AboutHeroProps {
  backgroundImage: { url: string; lqip?: string } | null;
  badge: string;
  headline: string;
  subheadline: string;
}

export function AboutHero({ backgroundImage, badge, headline, subheadline }: AboutHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundImage?.url ? (
        <>
          <Image
            src={backgroundImage.url}
            alt={headline}
            fill
            priority
            quality={85}
            sizes="100vw"
            placeholder={backgroundImage.lqip ? "blur" : "empty"}
            blurDataURL={backgroundImage.lqip}
            className="object-cover object-center"
          />
          {/* Gradient overlay — dark enough for white text */}
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background: `linear-gradient(
                to bottom,
                rgba(0, 40, 60, 0.65) 0%,
                rgba(0, 40, 60, 0.55) 50%,
                rgba(0, 40, 60, 0.65) 100%
              )`,
            }}
          />
          {/* Subtle warm gradient accent — adds depth and tropical warmth */}
          <div
            className="absolute inset-0 z-[2] mix-blend-soft-light opacity-40"
            style={{
              background: `radial-gradient(
                ellipse 80% 60% at 50% 30%,
                rgba(244, 161, 26, 0.35) 0%,
                transparent 70%
              )`,
            }}
          />
        </>
      ) : (
        /* Gradient fallback when no image uploaded */
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #005F86 0%, #0EA5B7 60%, #005F86 100%)" }}
        />
      )}

      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center py-24">
        {/* Badge */}
        {badge && (
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-sm font-heading font-semibold tracking-wide uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sunset inline-block" />
            {badge}
          </span>
        )}

        {/* Headline */}
        <WordRevealHeading
          as="h1"
          text={headline}
          triggerOnMount
          className="font-heading font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6"
        />

        {/* Subheadline */}
        {subheadline && (
          <p className="font-body text-white/85 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
      </div>

      {/* Wave-shaped bottom edge */}
      <div className="absolute -bottom-px left-0 right-0 z-20 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
