import { getPathname, type AppHref } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/constants";

/**
 * Build an absolute URL for a typed href in a given locale. Uses next-intl's
 * `getPathname` so localized segments (e.g. /about -> /es/sobre-nosotros) and
 * the locale prefix are resolved correctly.
 */
export function getLocalizedUrl(
  locale: "en" | "es",
  href: AppHref,
  baseUrl: string = SITE_URL,
): string {
  const path = getPathname({ locale, href });
  return path === "/" ? baseUrl : `${baseUrl}${path}`;
}

/**
 * Generate reciprocal hreflang URLs. Pass the same href for both locales for
 * pages that share a slug, or distinct hrefs when the dynamic [slug] differs
 * per locale (per-locale slugs).
 */
export function generateHreflangUrls(
  hrefByLocale: { en: AppHref; es: AppHref },
  baseUrl: string = SITE_URL,
): { en: string; es: string } {
  return {
    en: getLocalizedUrl("en", hrefByLocale.en, baseUrl),
    es: getLocalizedUrl("es", hrefByLocale.es, baseUrl),
  };
}

/**
 * Generate the `alternates.languages` object for Next.js metadata, with
 * x-default pointing at the English URL.
 */
export function generateHreflangAlternates(
  hrefByLocale: { en: AppHref; es: AppHref },
  baseUrl: string = SITE_URL,
) {
  const urls = generateHreflangUrls(hrefByLocale, baseUrl);

  return {
    languages: {
      en: urls.en,
      es: urls.es,
      "x-default": urls.en,
    },
  };
}
