import { WhyChooseUsSectionHeader } from "./WhyChooseUsSectionHeader";
import { TrustPillar } from "./TrustPillar";
import { WhyChooseUsBackground } from "./WhyChooseUsBackground";

export interface TrustPillarData {
  icon: string; // Icon key string — mapped to SVG in TrustPillarIcon
  title: string;
  description: string;
}

interface WhyChooseUsProps {
  heading: string;
  subheading?: string;
  pillars: TrustPillarData[];
}

export function WhyChooseUs({
  heading,
  subheading,
  pillars,
}: WhyChooseUsProps) {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden section-sand">
      <WhyChooseUsBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <WhyChooseUsSectionHeader heading={heading} subheading={subheading} />

        {/* Trust pillar grid — 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <TrustPillar key={pillar.title} pillar={pillar} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
