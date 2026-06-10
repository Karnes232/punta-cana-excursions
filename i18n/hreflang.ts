import { getPathname, type AppHref } from "@/i18n/navigation";
import { SITE_URL } from "@/lib/seo/constants";
import type { BlogLocale } from "@/i18n/blogLocales";

/**
 * Build an absolute URL for a typed href in a given locale. Uses next-intl's
 * `getPathname` so localized segments (e.g. /about -> /es/sobre-nosotros) and
 * the locale prefix are resolved correctly. Accepts any routing locale — the
 * extra blog locales (fr/de/pt/it) resolve to e.g. /fr/blog/<slug>.
 */
export function getLocalizedUrl(
  locale: BlogLocale,
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

/**
 * Build a Next.js `alternates.languages` map from an explicit list of
 * translation siblings. Used for individual blog articles, which are one
 * document per language (en/es/fr/de/pt/it) linked by a translationGroup — each
 * sibling has its own slug, so every existing language version is enumerated
 * with `x-default` pointing at the English version when present.
 */
export function buildHreflangFromSiblings(
  siblings: { locale: BlogLocale; href: AppHref }[],
  xDefaultLocale: BlogLocale,
  baseUrl: string = SITE_URL,
): { languages: Record<string, string> } {
  const languages: Record<string, string> = {};
  for (const { locale, href } of siblings) {
    languages[locale] = getLocalizedUrl(locale, href, baseUrl);
  }
  const xDefault = languages[xDefaultLocale] ?? Object.values(languages)[0];
  if (xDefault) languages["x-default"] = xDefault;
  return { languages };
}
