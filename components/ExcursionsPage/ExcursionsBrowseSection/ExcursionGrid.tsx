"use client";

import { ExcursionBrowseCard } from "./ExcursionBrowseCard";
import { ExcursionGridEmpty } from "./ExcursionGridEmpty";

export interface BrowseExcursion {
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
  badge?: string;
  isFeatured: boolean;
}

interface ExcursionGridProps {
  excursions: BrowseExcursion[];
  currencySymbol?: string;
  /** i18n labels for card content */
  labels: {
    from: string;
    perPerson: string;
    viewAndBook: string;
  };
  emptyLabels: {
    title: string;
    description: string;
  };
}

export function ExcursionGrid({
  excursions,
  currencySymbol = "$",
  labels,
  emptyLabels,
}: ExcursionGridProps) {
  if (excursions.length === 0) {
    return (
      <ExcursionGridEmpty
        title={emptyLabels.title}
        description={emptyLabels.description}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
        {excursions.map((excursion, index) => (
          <ExcursionBrowseCard
            key={excursion.slug}
            excursion={excursion}
            index={index}
            currencySymbol={currencySymbol}
            labels={labels}
          />
        ))}
      </div>
    </div>
  );
}
