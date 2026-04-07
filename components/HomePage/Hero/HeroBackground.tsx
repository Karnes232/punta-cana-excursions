import Image from "next/image";

interface HeroBackgroundProps {
  src: string;
  alt: string;
  lqip?: string;
}

export function HeroBackground({ src, alt, lqip }: HeroBackgroundProps) {
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

      {/* Gradient overlay — dark enough for white text, 
          stronger on the left where content sits */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 40, 60, 0.72) 0%,
              rgba(0, 40, 60, 0.55) 40%,
              rgba(0, 40, 60, 0.30) 70%,
              rgba(0, 40, 60, 0.18) 100%
            )
          `,
        }}
      />

      {/* Subtle warm gradient accent — adds depth and tropical warmth */}
      <div
        className="absolute inset-0 z-[2] mix-blend-soft-light opacity-40"
        style={{
          background: `
            radial-gradient(
              ellipse 80% 60% at 75% 30%,
              rgba(244, 161, 26, 0.35) 0%,
              transparent 70%
            )
          `,
        }}
      />
    </>
  );
}
