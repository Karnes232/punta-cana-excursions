import { ExcursionsHeroBackground } from "./ExcursionsHeroBackground";
import { ExcursionsHeroHeadline } from "./ExcursionsHeroHeadline";
import { ExcursionsHeroSubheadline } from "./ExcursionsHeroSubheadline";
import { ExcursionsHeroStats } from "./ExcursionsHeroStats";

// Types matching your Sanity ExcursionsPage schema hero fields
interface ExcursionsHeroProps {
  backgroundImage: {
    url: string;
    alt: string;
    lqip?: string;
  };
  headline: string;
  subheadline: string;
  totalExcursions: number;
}

export function ExcursionsHero({
  backgroundImage,
  headline,
  subheadline,
  totalExcursions,
}: ExcursionsHeroProps) {
  return (
    <section className="relative min-h-[50vh] md:min-h-[55vh] flex items-center overflow-hidden">
      {/* Full-bleed background image with overlay */}
      <ExcursionsHeroBackground
        src={backgroundImage.url}
        alt={backgroundImage.alt}
        lqip={backgroundImage.lqip}
      />

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 md:py-28">
        <div className="max-w-2xl lg:max-w-3xl">
          <ExcursionsHeroHeadline text={headline} />
          <ExcursionsHeroSubheadline text={subheadline} />
          <ExcursionsHeroStats totalExcursions={totalExcursions} />
        </div>
      </div>

      {/* Bottom wave transition — smooth into the filter bar below */}
      <div className="absolute -bottom-px left-0 right-0 z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 10 480 0 720 20C960 40 1200 60 1440 30V80H0V40Z"
            className="fill-white"
          />
        </svg>
      </div>
    </section>
  );
}
