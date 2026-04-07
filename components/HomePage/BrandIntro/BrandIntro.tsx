import { BrandIntroImage } from "./BrandIntroImage";
import { BrandIntroContent } from "./BrandIntroContent";
import { BrandIntroAccent } from "./BrandIntroAccent";

interface BrandIntroProps {
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  heading: string;
  body: string;
  tagline?: string;
}

export function BrandIntro({ image, heading, body, tagline }: BrandIntroProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden section-white">
      {/* Subtle decorative accent — wave-inspired shape */}
      <BrandIntroAccent />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left — Image */}
          <BrandIntroImage src={image.url} alt={image.alt} lqip={image.lqip} />

          {/* Right — Copy */}
          <BrandIntroContent heading={heading} body={body} tagline={tagline} />
        </div>
      </div>
    </section>
  );
}
