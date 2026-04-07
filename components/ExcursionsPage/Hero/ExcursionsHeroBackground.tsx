import Image from "next/image";

interface ExcursionsHeroBackgroundProps {
  src: string;
  alt: string;
  lqip?: string;
}

export function ExcursionsHeroBackground({
  src,
  alt,
  lqip,
}: ExcursionsHeroBackgroundProps) {
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
        Primary gradient overlay — 
        Directional: stronger on the left (where text sits), 
        lighter on the right so the photo breathes.
        Slightly lighter than Home hero since this is a shorter section.
      */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 40, 60, 0.75) 0%,
              rgba(0, 40, 60, 0.58) 40%,
              rgba(0, 40, 60, 0.35) 70%,
              rgba(0, 40, 60, 0.20) 100%
            )
          `,
        }}
      />

      {/* 
        Subtle teal accent — adds a cool tropical glow 
        in the upper-right corner. Keeps the browse hero 
        feeling distinct from the sunset-warm Home hero.
      */}
      <div
        className="absolute inset-0 z-[2] mix-blend-soft-light opacity-30"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 50% at 80% 25%,
              rgba(14, 165, 183, 0.40) 0%,
              transparent 65%
            )
          `,
        }}
      />
    </>
  );
}
