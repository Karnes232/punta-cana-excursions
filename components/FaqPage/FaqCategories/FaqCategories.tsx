"use client";

import { useState } from "react";
import { FaqAccordionItem } from "@/components/HomePage/FaqPreview/FaqAccordionItem";

export interface FaqCategoryData {
  _key: string;
  eyebrow: string;
  categoryName: string;
  subheading: string;
  icon: string | null;
  items: { _key: string; question: string; answer: string }[];
}

interface FaqCategoriesProps {
  categories: FaqCategoryData[];
  allLabel: string;
}

export function FaqCategories({ categories, allLabel }: FaqCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openKeys, setOpenKeys] = useState<Record<string, string | null>>({});

  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c._key === activeCategory);

  // Single-open: opening one category closes any other.
  function toggleCategory(categoryKey: string) {
    setOpenCategory((prev) => (prev === categoryKey ? null : categoryKey));
  }

  function selectCategory(categoryKey: string) {
    setActiveCategory(categoryKey);
    setOpenCategory(categoryKey);
  }

  function toggleItem(categoryKey: string, itemKey: string) {
    setOpenKeys((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === itemKey ? null : itemKey,
    }));
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20">
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        <FilterPill
          label={allLabel}
          active={activeCategory === "all"}
          onClick={() => setActiveCategory("all")}
          icon={null}
        />
        {categories.map((cat) => (
          <FilterPill
            key={cat._key}
            label={cat.eyebrow || cat.categoryName}
            active={activeCategory === cat._key}
            onClick={() => selectCategory(cat._key)}
            icon={cat.icon}
          />
        ))}
      </div>

      {/* Category sections — each is a collapsible accordion */}
      <div className="space-y-4">
        {visibleCategories.map((cat) => {
          const categoryOpen = openCategory === cat._key;
          const headingId = `faq-cat-heading-${cat._key}`;
          const panelId = `faq-cat-panel-${cat._key}`;

          return (
            <div
              key={cat._key}
              className="border-b border-slate-100 pb-4 last:border-b-0"
            >
              {/* Category header — toggles the whole category */}
              <h2>
                <button
                  id={headingId}
                  type="button"
                  aria-expanded={categoryOpen}
                  aria-controls={panelId}
                  onClick={() => toggleCategory(cat._key)}
                  className="w-full flex items-center gap-3 text-left group rounded-xl py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean min-h-[48px]"
                >
                  <span className="w-9 h-9 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                    <CategoryIcon icon={cat.icon} />
                  </span>

                  <span className="flex-1 min-w-0">
                    {cat.eyebrow && (
                      <span className="block font-heading font-semibold text-teal text-xs uppercase tracking-widest">
                        {cat.eyebrow}
                      </span>
                    )}
                    <span className="block font-heading font-bold text-navy text-xl leading-snug group-hover:text-ocean transition-colors duration-200">
                      {cat.categoryName}
                    </span>
                  </span>

                  <span className="font-body text-xs text-slate/50 flex-shrink-0">
                    {cat.items.length}
                  </span>

                  {/* Chevron — rotates on open */}
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out ${
                      categoryOpen ? "bg-ocean/10 rotate-180" : "bg-sand group-hover:bg-ocean/8"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      className={`w-4 h-4 transition-colors duration-200 ${
                        categoryOpen ? "text-ocean" : "text-gray-dark group-hover:text-ocean"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </span>
                </button>
              </h2>

              {/* Subheading — visible whether the category is open or collapsed */}
              {cat.subheading && (
                <p className="font-body text-sm text-slate/60 leading-relaxed mt-1 pl-12">
                  {cat.subheading}
                </p>
              )}

              {/* Collapsible panel — animated with grid-rows for smooth height */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: categoryOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <div className="pt-4">
                    <div className="space-y-3">
                      {cat.items.map((item) => (
                        <FaqAccordionItem
                          key={item._key}
                          question={item.question}
                          answer={item.answer}
                          isOpen={openKeys[cat._key] === item._key}
                          onToggle={() => toggleItem(cat._key, item._key)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: string | null;
}

function FilterPill({ label, active, onClick, icon }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all duration-200 min-h-[44px] ${
        active
          ? "bg-ocean text-white shadow-md shadow-ocean/20"
          : "bg-sand text-slate hover:bg-ocean/10 hover:text-ocean border border-slate-200"
      }`}
    >
      {icon && (
        <span className="text-xs" aria-hidden="true">
          <CategoryIcon icon={icon} small />
        </span>
      )}
      {label}
    </button>
  );
}

/**
 * Outline icon paths keyed by the category `icon` value. Each value is an
 * array of SVG path `d` strings (some icons need more than one path).
 * Unknown / null keys fall back to GENERAL_ICON (question mark).
 */
const GENERAL_ICON = [
  "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z",
];

const CATEGORY_ICON_PATHS: Record<string, string[]> = {
  // Booking & Payments — credit card
  booking: [
    "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z",
  ],
  // Cancellations, Refunds & Changes — circular arrows
  cancellation: [
    "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  ],
  // Pickup, Transportation & Hotels — truck / shuttle
  transport: [
    "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  ],
  // Safety & Health Requirements — shield check
  safety: [
    "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  ],
  // What to Expect on Your Excursion — sparkles
  expect: [
    "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  ],
  // Diving & Snorkeling — water waves
  diving: [
    "M3 7.5c1.2.9 2.4.9 3.6 0s2.4-.9 3.6 0 2.4.9 3.6 0 2.4-.9 3.6 0 2.4.9 3.6 0",
    "M3 12c1.2.9 2.4.9 3.6 0s2.4-.9 3.6 0 2.4.9 3.6 0 2.4-.9 3.6 0 2.4.9 3.6 0",
    "M3 16.5c1.2.9 2.4.9 3.6 0s2.4-.9 3.6 0 2.4.9 3.6 0 2.4-.9 3.6 0 2.4.9 3.6 0",
  ],
  // Planning Your Punta Cana Trip — folded map
  planning: [
    "M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z",
  ],
  // About Us & Our Operations — office building
  about: [
    "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21a.75.75 0 01.75.75V21",
  ],
};

function CategoryIcon({ icon, small }: { icon: string | null; small?: boolean }) {
  const size = small ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  const color = small ? "text-current" : "text-ocean";
  const paths = (icon && CATEGORY_ICON_PATHS[icon]) || GENERAL_ICON;

  return (
    <svg
      className={`${size} ${color}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}
