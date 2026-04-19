"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ALL_LOCALES, LOCALE_LABELS } from "@/i18n/blogLocales";
import type { BlogLocale } from "@/i18n/blogLocales";

interface CategoryOption {
  slug: string;
  label: string;
}

interface BlogFiltersProps {
  defaultLanguage: string;
  categories?: CategoryOption[];
  allCategoriesLabel: string;
  languageLabel: string;
  categoryLabel: string;
}

export function BlogFilters({
  defaultLanguage,
  categories = [],
  allCategoriesLabel,
  languageLabel,
  categoryLabel,
}: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeLang = searchParams.get("lang") ?? defaultLanguage;
  const activeCategory = searchParams.get("category") ?? "";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
      <FilterSelect
        label={languageLabel}
        value={activeLang}
        onChange={(v) => updateParam("lang", v)}
        icon={<GlobeIcon />}
      >
        {ALL_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code as BlogLocale]}
          </option>
        ))}
      </FilterSelect>

      {categories.length > 0 && (
        <FilterSelect
          label={categoryLabel}
          value={activeCategory}
          onChange={(v) => updateParam("category", v)}
          icon={<TagIcon />}
        >
          <option value="">{allCategoriesLabel}</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </FilterSelect>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  icon,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-xs font-medium text-slate/60 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 text-ocean/70">
          {icon}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none font-body text-sm text-navy bg-white border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 min-w-[200px] cursor-pointer focus:outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 transition-all duration-200 hover:border-slate-300"
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3">
          <svg className="w-4 h-4 text-slate/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
    </svg>
  );
}
