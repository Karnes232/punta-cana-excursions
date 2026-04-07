"use client";

import { useState, useRef, useEffect } from "react";
import { CategoryPill } from "./CategoryPill";
import { SortDropdown } from "./SortDropdown";
import { ResultCount } from "./ResultCount";
import { FilterScrollFade } from "./FilterScrollFade";

export interface CategoryFilter {
  slug: string;
  title: string;
}

export type SortOption = "featured" | "price-low" | "price-high" | "duration";

interface ExcursionsFilterBarProps {
  categories: CategoryFilter[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  /** i18n labels */
  labels: {
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
}

export function ExcursionsFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  resultCount,
  labels,
}: ExcursionsFilterBarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Detect when the bar becomes sticky to add shadow
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Invisible sentinel — when it scrolls out of view, the bar is stuck */}
      <div ref={sentinelRef} className="h-0 w-full" aria-hidden="true" />

      <div
        className={`
          sticky top-0 z-30 transition-shadow duration-300
          ${isSticky ? "shadow-md" : ""}
        `}
        style={{
          background: isSticky
            ? "rgba(255, 255, 255, 0.92)"
            : "var(--color-white)",
          backdropFilter: isSticky ? "blur(12px)" : "none",
          WebkitBackdropFilter: isSticky ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4 md:py-5">
          {/* Category pills row */}
          <div className="relative mb-4">
            <FilterScrollFade>
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1">
                <CategoryPill
                  label={labels.all}
                  isActive={activeCategory === "all"}
                  onClick={() => onCategoryChange("all")}
                />
                {categories.map((cat) => (
                  <CategoryPill
                    key={cat.slug}
                    label={cat.title}
                    isActive={activeCategory === cat.slug}
                    onClick={() => onCategoryChange(cat.slug)}
                  />
                ))}
              </div>
            </FilterScrollFade>
          </div>

          {/* Sort + result count row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <ResultCount
              count={resultCount}
              labels={{
                showing: labels.showing,
                singular: labels.excursion,
                plural: labels.excursions,
              }}
            />
            <SortDropdown
              value={sortBy}
              onChange={onSortChange}
              labels={{
                sortBy: labels.sortBy,
                featured: labels.sortFeatured,
                priceLow: labels.sortPriceLow,
                priceHigh: labels.sortPriceHigh,
                duration: labels.sortDuration,
              }}
            />
          </div>
        </div>

        {/* Bottom border when not sticky (sticky uses shadow instead) */}
        {!isSticky && <div className="h-px bg-sand-dark" />}
      </div>
    </>
  );
}
