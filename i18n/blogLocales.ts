export const ALL_LOCALES = ["en", "es", "fr", "de", "pt", "it"] as const;
export type BlogLocale = (typeof ALL_LOCALES)[number];

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
