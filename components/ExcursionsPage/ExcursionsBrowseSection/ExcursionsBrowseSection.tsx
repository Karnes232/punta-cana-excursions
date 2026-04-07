"use client";

import { useState, useMemo } from "react";
import {
  ExcursionsFilterBar,
  type CategoryFilter,
  type SortOption,
} from "./FilterBar";
import { ExcursionGrid, type BrowseExcursion } from "./ExcursionGrid";

interface ExcursionsBrowseSectionProps {
  categories: CategoryFilter[];
  excursions: BrowseExcursion[];
  currencySymbol?: string;
  /** All i18n labels for the section */
  labels: {
    filter: {
      all: string;
      sortBy: string;
      sortFeatured: string;
      sortPriceLow: string;
      sortPriceHigh: string;
      sortDuration: string;
      showing: string;
      excursion: string;
      excursions: string;
    };
    card: {
      from: string;
      perPerson: string;
      viewAndBook: string;
    };
    empty: {
      title: string;
      description: string;
    };
  };
}

export function ExcursionsBrowseSection({
  categories,
  excursions,
  currencySymbol = "$",
  labels,
}: ExcursionsBrowseSectionProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filtered = useMemo(() => {
    // Filter by category
    let items =
      activeCategory === "all"
        ? [...excursions]
        : excursions.filter(
            (e) => e.category.toLowerCase() === activeCategory.toLowerCase(),
          );

    // Sort
    switch (sortBy) {
      case "price-low":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        items.sort((a, b) => b.price - a.price);
        break;
      case "duration": {
        const parseDuration = (d: string) => parseInt(d) || 0;
        items.sort(
          (a, b) => parseDuration(a.duration) - parseDuration(b.duration),
        );
        break;
      }
      case "featured":
      default:
        items.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        });
        break;
    }

    return items;
  }, [excursions, activeCategory, sortBy]);

  return (
    <section className="section-white">
      <ExcursionsFilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        resultCount={filtered.length}
        labels={labels.filter}
      />

      <ExcursionGrid
        excursions={filtered}
        currencySymbol={currencySymbol}
        labels={labels.card}
        emptyLabels={labels.empty}
      />
    </section>
  );
}
