import { RelatedExcursionsHeader } from "./RelatedExcursionsHeader";
import { RelatedExcursionCard } from "./RelatedExcursionCard";

export interface RelatedExcursionData {
  slug: string;
  title: string;
  summary: string;
  image: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
      };
    };
    alt: string;
    lqip?: string;
  };
  price: number;
  duration: string;
  category: string;
  badge?: string | null;
}

interface RelatedExcursionsProps {
  /** Array of related excursions (aim for 3) */
  excursions: RelatedExcursionData[];
  /** i18n labels */
  labels: {
    heading: string; // "You Might Also Like" / "También Te Puede Gustar"
    subheading: string; // "More excursions to explore" / "Más excursiones para explorar"
    viewDetails: string; // "View details" / "Ver detalles"
    from: string; // "From" / "Desde"
  };
}

export function RelatedExcursions({
  excursions,
  labels,
}: RelatedExcursionsProps) {
  if (!excursions || excursions.length === 0) return null;

  return (
    <section className="relative bg-sand/50 py-12 md:py-16" id="related">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <RelatedExcursionsHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {excursions.slice(0, 3).map((excursion, i) => (
            <RelatedExcursionCard
              key={excursion.slug}
              excursion={excursion}
              index={i}
              labels={{
                viewDetails: labels.viewDetails,
                from: labels.from,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
