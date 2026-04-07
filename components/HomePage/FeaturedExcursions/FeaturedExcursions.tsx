import { FeaturedSectionHeader } from "./FeaturedSectionHeader";
import { FeaturedExcursionCard } from "./FeaturedExcursionCard";
import { FeaturedViewAll } from "./FeaturedViewAll";

export interface FeaturedExcursion {
  slug: string;
  title: string;
  summary: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  price: number;
  duration: string;
  category: string;
  badge?: string; // e.g. "Popular", "Best Seller"
}

interface FeaturedExcursionsProps {
  heading: string;
  subheading?: string;
  excursions: FeaturedExcursion[];
  viewAllText: string;
  viewAllHref: string;
  currencySymbol?: string;
}

export function FeaturedExcursions({
  heading,
  subheading,
  excursions,
  viewAllText,
  viewAllHref,
  currencySymbol = "$",
}: FeaturedExcursionsProps) {
  return (
    <section className="relative py-20 md:py-28 section-sand overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <FeaturedSectionHeader heading={heading} subheading={subheading} />

        {/* Excursion card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {excursions.map((excursion, index) => (
            <FeaturedExcursionCard
              key={excursion.slug}
              excursion={excursion}
              index={index}
              currencySymbol={currencySymbol}
            />
          ))}
        </div>

        <FeaturedViewAll text={viewAllText} href={viewAllHref} />
      </div>
    </section>
  );
}
