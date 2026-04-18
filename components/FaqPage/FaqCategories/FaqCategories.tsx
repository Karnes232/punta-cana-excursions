"use client";

import { useState } from "react";
import { FaqAccordionItem } from "@/components/HomePage/FaqPreview/FaqAccordionItem";

export interface FaqCategoryData {
  _key: string;
  categoryName: string;
  icon: string | null;
  items: { _key: string; question: string; answer: string }[];
}

interface FaqCategoriesProps {
  categories: FaqCategoryData[];
  allLabel: string;
}

export function FaqCategories({ categories, allLabel }: FaqCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openKeys, setOpenKeys] = useState<Record<string, string | null>>({});

  const visibleCategories =
    activeCategory === "all"
      ? categories
      : categories.filter((c) => c._key === activeCategory);

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
            label={cat.categoryName}
            active={activeCategory === cat._key}
            onClick={() => setActiveCategory(cat._key)}
            icon={cat.icon}
          />
        ))}
      </div>

      {/* Category sections */}
      <div className="space-y-12">
        {visibleCategories.map((cat) => (
          <div key={cat._key}>
            {/* Category heading */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-ocean/10 flex items-center justify-center flex-shrink-0">
                <CategoryIcon icon={cat.icon} />
              </div>
              <h2 className="font-heading font-bold text-navy text-xl">
                {cat.categoryName}
              </h2>
              <div className="flex-1 h-px bg-slate-100" />
              <span className="font-body text-xs text-slate/50 flex-shrink-0">
                {cat.items.length}
              </span>
            </div>

            {/* Accordion items */}
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
        ))}
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

function CategoryIcon({ icon, small }: { icon: string | null; small?: boolean }) {
  const size = small ? "w-3.5 h-3.5" : "w-4.5 h-4.5";
  const color = small ? "text-current" : "text-ocean";

  if (icon === "booking") {
    return (
      <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    );
  }
  if (icon === "excursion") {
    return (
      <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    );
  }
  if (icon === "cancellation") {
    return (
      <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
    );
  }
  if (icon === "safety") {
    return (
      <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    );
  }
  // general / fallback
  return (
    <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  );
}
