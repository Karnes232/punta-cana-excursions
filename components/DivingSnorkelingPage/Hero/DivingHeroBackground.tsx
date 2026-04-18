import Image from "next/image";

/* ---------------------------------------------------------------------------
   DivingHeroBackground — Underwater-themed background treatment
   
   Key differences from other heroes:
   - Home Hero: warm sunset-orange radial accent
   - Browse Hero: neutral teal radial accent  
   - Diving Hero: deep blue-teal gradient evoking underwater light
   
   The gradient is slightly more dramatic (deeper darks) because underwater
   photography often has strong blue/teal cast that benefits from a richer
   overlay to maintain headline readability.
   --------------------------------------------------------------------------- */

interface DivingHeroBackgroundProps {
  src: string;
  alt: string;
  lqip?: string;
}

export function DivingHeroBackground({
  src,
  alt,
  lqip,
}: DivingHeroBackgroundProps) {
  return (
    <>
      {/* Main background image — priority load for LCP */}
      <Image
        src={src}
        alt={alt}
        fill
        priority
        quality={85}
        sizes="100vw"
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip}
        className="object-cover object-center"
      />

      {/* 
        Primary gradient overlay — Deep ocean tones.
        Stronger left-to-right directional gradient for text readability.
        Uses cooler, deeper blues than the Home hero's warm browns.
      */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              140deg,
              rgba(0, 30, 50, 0.78) 0%,
              rgba(0, 50, 70, 0.60) 35%,
              rgba(0, 60, 80, 0.35) 65%,
              rgba(0, 50, 70, 0.22) 100%
            )
          `,
        }}
      />

      {/* 
        Underwater light refraction accent — 
        A teal-cyan radial that simulates light filtering through water.
        Positioned upper-right to create a "sunlight from the surface" effect.
      */}
      <div
        className="absolute inset-0 z-[2] mix-blend-soft-light opacity-50"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 50% at 70% 20%,
              rgba(14, 165, 183, 0.40) 0%,
              transparent 65%
            )
          `,
        }}
      />

      {/* 
        Subtle light rays — CSS-only decorative element that adds
        depth and atmosphere. Uses a conic gradient to simulate 
        underwater light beams filtering down from the surface.
      */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          background: `
            conic-gradient(
              from 200deg at 65% -10%,
              transparent 0deg,
              rgba(255, 255, 255, 0.8) 15deg,
              transparent 30deg,
              transparent 50deg,
              rgba(255, 255, 255, 0.5) 65deg,
              transparent 80deg,
              transparent 120deg,
              rgba(255, 255, 255, 0.6) 135deg,
              transparent 150deg,
              transparent 360deg
            )
          `,
        }}
      />
    </>
  );
}
