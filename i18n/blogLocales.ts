export const ALL_LOCALES = ["en", "es", "fr", "de", "pt", "it"] as const;
export type BlogLocale = (typeof ALL_LOCALES)[number];

/**
 * The locales the site UI/chrome actually exists in. The home page, excursions,
 * and every non-blog route only have en/es content, so they are restricted to
 * these. The extra blog locales (fr/de/pt/it) are real routing locales used
 * exclusively by individual blog articles (one document per language).
 */
export const SITE_LOCALES = ["en", "es"] as const;
export type SiteLocale = (typeof SITE_LOCALES)[number];

export function isSiteLocale(locale: string): locale is SiteLocale {
  return (SITE_LOCALES as readonly string[]).includes(locale);
}

/** OpenGraph `xx_XX` locale tag for each supported blog locale. */
export const OG_LOCALE: Record<BlogLocale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  it: "it_IT",
};

export const LOCALE_LABELS: Record<BlogLocale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  it: "Italiano",
};

export const LOCALE_FLAGS: Record<BlogLocale, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  pt: "🇧🇷",
  it: "🇮🇹",
};
