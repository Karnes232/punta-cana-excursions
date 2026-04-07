import { HeroBackground } from "./HeroBackground";
import { HeroHeadline } from "./HeroHeadline";
import { HeroSubheadline } from "./HeroSubheadline";
import { HeroCTAGroup } from "./HeroCTAGroup";

// Types matching your Sanity HomePage schema hero fields
interface HeroCTA {
  text: string;
  href: string;
}

interface HeroProps {
  backgroundImage: {
    url: string;
    alt: string;
    lqip?: string; // Low-quality image placeholder from Sanity
  };
  headline: string;
  subheadline: string;
  primaryCTA: HeroCTA;
  secondaryCTA: HeroCTA;
}

export function Hero({
  backgroundImage,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
}: HeroProps) {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Full-bleed background image with overlay */}
      {backgroundImage.url && (
        <HeroBackground
          src={backgroundImage.url}
          alt={backgroundImage.alt}
          lqip={backgroundImage.lqip}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-24 md:py-32">
        <div className="max-w-2xl lg:max-w-3xl">
          {headline && <HeroHeadline text={headline} />}
          {subheadline && <HeroSubheadline text={subheadline} />}
          {primaryCTA && secondaryCTA && (
            <HeroCTAGroup primaryCTA={primaryCTA} secondaryCTA={secondaryCTA} />
          )}
        </div>
      </div>

      {/* Bottom gradient fade — smooth transition into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 md:h-32 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, var(--color-white) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
