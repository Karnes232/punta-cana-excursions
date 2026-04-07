"use client";

import type { SortOption } from "./FilterBar";

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  labels: {
    sortBy: string;
    featured: string;
    priceLow: string;
    priceHigh: string;
    duration: string;
  };
}

export function SortDropdown({ value, onChange, labels }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="font-body text-sm text-gray hidden sm:inline">
        {labels.sortBy}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          className="
            appearance-none
            pl-3.5 pr-9 py-2
            rounded-lg
            border border-sand-dark
            bg-white
            font-heading text-sm font-medium text-slate
            cursor-pointer
            transition-all duration-200
            hover:border-ocean/30
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40 focus-visible:ring-offset-1
          "
        >
          <option value="featured">{labels.featured}</option>
          <option value="price-low">{labels.priceLow}</option>
          <option value="price-high">{labels.priceHigh}</option>
          <option value="duration">{labels.duration}</option>
        </select>

        {/* Custom chevron */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
