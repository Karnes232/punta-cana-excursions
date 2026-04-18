import type { PortableTextBlock } from "@portabletext/types";
import { DivingIntroImage } from "./DivingIntroImage";
import { DivingIntroContent } from "./DivingIntroContent";
import { DivingIntroAccent } from "./DivingIntroAccent";
import { DivingIntroStats } from "./DivingIntroStats";

/* ---------------------------------------------------------------------------
   DivingIntro — "Grand Bay's Diving Expertise" section
   
   Two-column layout: Copy (left) + Image (right)
   Reversed from the Home BrandIntro (Image left, Copy right) so the
   Diving page has its own visual identity.
   
   Includes credential stats below the body text — a unique element
   that reinforces Grand Bay's underwater authority.
   
   Background: section-sand for alternating rhythm after the white hero wave.
   --------------------------------------------------------------------------- */

interface DivingIntroStat {
  value: string;
  label: string;
}

interface DivingIntroProps {
  tagline?: string;
  headline?: string;
  body?: PortableTextBlock[];
  image?: {
    url: string;
    lqip?: string;
  };
  stats?: DivingIntroStat[];
}

export function DivingIntro({
  tagline,
  headline,
  body,
  image,
  stats,
}: DivingIntroProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden section-sand">
      {/* Decorative underwater accent — subtle bubbles + wave curves */}
      <DivingIntroAccent />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-center">
          {/* Left — Copy + Stats */}
          <div className="order-2 lg:order-1">
            {tagline && headline && body && (
              <DivingIntroContent
                tagline={tagline}
                headline={headline}
                body={body}
              />
            )}
            {stats && <DivingIntroStats stats={stats} />}
          </div>

          {/* Right — Image */}
          <div className="order-1 lg:order-2">
            {image && (
              <DivingIntroImage
                src={image.url}
                alt={headline || ""}
                lqip={image.lqip}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
