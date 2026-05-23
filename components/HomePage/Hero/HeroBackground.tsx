interface HeroBackgroundProps {
  src: string;
  alt: string;
}

const MOBILE_WIDTH = 750;
const MOBILE_HEIGHT = 560;
const DESKTOP_WIDTH = 1600;
const DESKTOP_HEIGHT = 900;

function sanityUrl(base: string, w: number, h: number) {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}w=${w}&h=${h}&fit=crop&q=80&auto=format`;
}

export function HeroBackground({ src, alt }: HeroBackgroundProps) {
  const mobileSrc = sanityUrl(src, MOBILE_WIDTH, MOBILE_HEIGHT);
  const desktopSrc = sanityUrl(src, DESKTOP_WIDTH, DESKTOP_HEIGHT);

  return (
    <>
      {/* Main background image — direct Sanity CDN, high priority for LCP */}
      <img
        src={desktopSrc}
        srcSet={`${mobileSrc} ${MOBILE_WIDTH}w, ${desktopSrc} ${DESKTOP_WIDTH}w`}
        sizes="100vw"
        alt={alt}
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        fetchPriority="high"
        decoding="sync"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient overlay — dark enough for white text,
          stronger on the left where content sits */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(
              135deg,
              rgba(0, 40, 60, 0.55) 0%,
              rgba(0, 40, 60, 0.42) 40%,
              rgba(0, 40, 60, 0.22) 70%,
              rgba(0, 40, 60, 0.12) 100%
            )
          `,
        }}
      />

      {/* Subtle warm gradient accent — adds depth and tropical warmth */}
      <div
        className="absolute inset-0 z-[2] mix-blend-soft-light opacity-25"
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
