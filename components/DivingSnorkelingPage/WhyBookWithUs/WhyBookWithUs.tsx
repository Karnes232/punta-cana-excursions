import { WhyBookHeader } from "./WhyBookHeader";
import { WhyBookPillar } from "./WhyBookPillar";
import { WhyBookBackground } from "./WhyBookBackground";

/* ---------------------------------------------------------------------------
   WhyBookWithUs — "Why Book Water Activities With Grand Bay" trust block
   
   Same architecture as the Home page WhyChooseUs:
   - Centered section header
   - 4-column pillar grid (2 on tablet, stacked on mobile)
   - Decorative background accent
   
   Differences:
   - section-white background (snorkeling cards above use sand)
   - Underwater-themed decorative background (bubbles + wave)
   - Diving-specific icon set (certified, safety, local, experience)
   - Ocean-blue accent divider instead of sunset-orange
   --------------------------------------------------------------------------- */

export interface WhyBookPillarData {
  icon: string;
  title: string;
  description: string;
}

interface WhyBookWithUsProps {
  heading: string;
  subheading?: string;
  pillars: WhyBookPillarData[];
}

export function WhyBookWithUs({
  heading,
  subheading,
  pillars,
}: WhyBookWithUsProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden section-white">
      <WhyBookBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <WhyBookHeader heading={heading} subheading={subheading} />

        {/* Trust pillar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <WhyBookPillar
              key={pillar.title}
              pillar={pillar}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}