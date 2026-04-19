"use client";

import { useRouter } from "@/i18n/navigation";
import { LOCALE_LABELS } from "@/i18n/blogLocales";
import type { BlogLocale } from "@/i18n/blogLocales";
import type { BlogTranslation } from "@/sanity/queries/Blog/Blog";

interface BlogPostTranslationsProps {
  currentLanguage: string;
  currentSlug: string;
  translations: BlogTranslation[];
  label: string;
}

export function BlogPostTranslations({
  currentLanguage,
  currentSlug,
  translations,
  label,
}: BlogPostTranslationsProps) {
  const router = useRouter();

  if (translations.length === 0) return null;

  const options = [
    { language: currentLanguage, slug: currentSlug },
    ...translations,
  ].sort((a, b) => a.language.localeCompare(b.language));

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    if (slug !== currentSlug) {
      router.push(`/blog/${slug}`);
    }
  }

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-sand border border-slate-100">
      <GlobeIcon />
      <span className="font-body text-sm text-slate/60 whitespace-nowrap">{label}:</span>
      <div className="relative flex items-center">
        <select
          value={currentSlug}
          onChange={handleChange}
          className="appearance-none font-body text-sm font-semibold text-ocean bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-ocean focus:ring-2 focus:ring-ocean/20 transition-all duration-200"
        >
          {options.map((opt) => (
            <option key={opt.slug} value={opt.slug}>
              {LOCALE_LABELS[opt.language as BlogLocale] ?? opt.language.toUpperCase()}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2">
          <svg className="w-3.5 h-3.5 text-ocean/50" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4 text-slate/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}
