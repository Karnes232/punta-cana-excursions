import { DivingHeroBackground } from "./DivingHeroBackground";
import { DivingHeroHeadline } from "./DivingHeroHeadline";
import { DivingHeroSubheadline } from "./DivingHeroSubheadline";
import { DivingHeroBadge } from "./DivingHeroBadge";

/* ---------------------------------------------------------------------------
   DivingHero — Hero section for the Diving & Snorkeling page
   
   Mid-height immersive hero (~60vh) with underwater imagery and deep-ocean
   gradient treatment. Visually distinct from the Home and Browse heroes while
   sharing the same component architecture.
   
   Animation cascade:
     Badge (150ms) → Headline words (300ms + stagger) → Subheadline (700ms)
   --------------------------------------------------------------------------- */

interface DivingHeroCTA {
  text: string;
  href: string;
}

interface DivingHeroProps {
  backgroundImage: {
    url: string;
    lqip?: string;
  };
  /** Localized badge text, e.g. "Grand Bay Diving Expertise" */
  badge: string;
  headline: string;
  subheadline: string;
  primaryCTA: DivingHeroCTA;
  secondaryCTA: DivingHeroCTA;
}

export function DivingHero({
  backgroundImage,
  badge,
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
}: DivingHeroProps) {
  return (
    <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center overflow-hidden">
      {/* Full-bleed underwater background with deep-ocean overlays */}
      {backgroundImage && (
        <DivingHeroBackground
          src={backgroundImage?.url ?? ""}
          alt={badge ?? ""}
          lqip={backgroundImage?.lqip ?? ""}
        />
      )}

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="max-w-2xl lg:max-w-3xl">
          {/* Credibility badge — enters first */}
          {badge && <DivingHeroBadge text={badge} />}

          {/* Headline — staggered word reveal */}
          {headline && <DivingHeroHeadline text={headline} />}

          {/* Subheadline + inline CTAs */}
          {subheadline && primaryCTA && secondaryCTA && (
            <DivingHeroSubheadline
              text={subheadline}
              primaryCTA={primaryCTA}
              secondaryCTA={secondaryCTA}
            />
          )}
        </div>
      </div>

      {/* Bottom wave transition — organic underwater-to-white flow */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C180 30 360 10 540 25C720 40 900 80 1080 65C1200 55 1320 35 1440 45V100H0V60Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
