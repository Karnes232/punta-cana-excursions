import type { PortableTextBlock } from "@portabletext/types";
import { WaterExcursionsSectionHeader } from "./WaterExcursionsSectionHeader";
import { WaterExcursionCard } from "./WaterExcursionCard";
import { WaterExcursionsEmptyState } from "./WaterExcursionsEmptyState";

/* ---------------------------------------------------------------------------
   WaterExcursionsSection — Reusable section for diving & snorkeling cards
   
   Used TWICE on the Diving & Snorkeling page:
     1. id="diving-excursions" — Diving trips
     2. id="snorkeling-excursions" — Snorkeling experiences
   
   The component is generic — only the props differ between the two usages.
   Background alternates: diving = section-white, snorkeling = section-sand
   (controlled by the `variant` prop).
   --------------------------------------------------------------------------- */

export interface WaterExcursion {
  slug: string;
  href: string;
  title: string;
  summary: string;
  image: {
    url: string;
    alt: string;
    lqip?: string;
  };
  price: number;
  duration: string;
  badge?: string | null;
  isFeatured: boolean;
}

interface WaterExcursionsSectionProps {
  /** Anchor ID for scroll-to, e.g. "diving-excursions" */
  id: string;
  /** Optional uppercase kicker shown above the heading */
  eyebrow?: string;
  /** Section heading, e.g. "Diving Excursions" */
  heading: string;
  /** Optional rich-text subheading under the heading */
  subheading?: PortableTextBlock[];
  /** Optional rich-text body shown below the subheading */
  body?: PortableTextBlock[];
  /** Which icon to show in the header: "diving" or "snorkeling" */
  iconType: "diving" | "snorkeling";
  /** Excursion cards data */
  excursions: WaterExcursion[];
  /** Background variant for alternating rhythm */
  variant?: "white" | "sand";
  /** i18n labels */
  labels: {
    from: string;
    perPerson: string;
    viewDetails: string;
    noExcursions: string;
    noExcursionsMessage: string;
    featured: string;
  };
  /** Currency symbol, default "$" */
  currencySymbol?: string;
}

export function WaterExcursionsSection({
  id,
  eyebrow,
  heading,
  subheading,
  body,
  iconType,
  excursions,
  variant = "white",
  labels,
  currencySymbol = "$",
}: WaterExcursionsSectionProps) {
  const bgClass = variant === "sand" ? "section-sand" : "section-white";

  return (
    <section id={id} className={`relative py-20 md:py-28 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Section header with icon */}
        <WaterExcursionsSectionHeader
          eyebrow={eyebrow}
          heading={heading}
          subheading={subheading}
          body={body}
          iconType={iconType}
        />

        {/* Card grid or empty state */}
        {excursions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12 md:mt-14">
            {excursions.map((excursion, index) => (
              <WaterExcursionCard
                key={excursion.slug}
                excursion={excursion}
                index={index}
                labels={labels}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        ) : (
          <WaterExcursionsEmptyState
            title={labels.noExcursions}
            message={labels.noExcursionsMessage}
          />
        )}
      </div>
    </section>
  );
}
