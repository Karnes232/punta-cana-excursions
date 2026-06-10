import type { Metadata } from "next";
import { generateHreflangAlternates, getLocalizedUrl } from "@/i18n/hreflang";
import type { AppHref } from "@/i18n/navigation";
import { OG_LOCALE, type BlogLocale } from "@/i18n/blogLocales";
import { getLocalized } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type {
  SeoData,
  SeoImageAsset,
  SeoSingleLanguageData,
} from "@/sanity/queries/SEO/seoProjection";

type Locale = "en" | "es";

interface FallbackImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface BuildMetadataArgs {
  seo: SeoData | null | undefined;
  defaults: SeoData | null | undefined;
  /**
   * Page locale. Usually en/es (bilingual site pages), but the blog index also
   * renders in the extra blog locales (fr/de/pt/it) — those resolve real
   * `/fr/blog` URLs. Bilingual `seo`/`defaults` content falls back to English.
   */
  locale: BlogLocale;
  /** Typed canonical href, e.g. "/about" or { pathname: "/excursions/[slug]", params: { slug } } */
  href: AppHref;
  /** Per-locale hrefs when the dynamic [slug] differs per locale; falls back to `href`. */
  hrefByLocale?: Partial<Record<Locale, AppHref>>;
  /** Pre-built hreflang map; when omitted, a reciprocal en/es pair is generated. */
  alternates?: { languages: Record<string, string> };
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
}

interface BuildSingleLanguageMetadataArgs {
  seo: SeoSingleLanguageData | null | undefined;
  defaults: SeoData | null | undefined;
  /** The article's own language — any routing locale (en/es/fr/de/pt/it). */
  locale: BlogLocale;
  href: AppHref;
  /**
   * Pre-built hreflang map derived from the article's translation group. When
   * omitted, falls back to a reciprocal en/es pair for the same href.
   */
  alternates?: { languages: Record<string, string> };
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
}

/** Resolve per-locale hrefs from the single href plus any per-locale overrides. */
function resolveHrefs(
  href: AppHref,
  hrefByLocale?: Partial<Record<Locale, AppHref>>,
): { en: AppHref; es: AppHref } {
  return {
    en: hrefByLocale?.en ?? href,
    es: hrefByLocale?.es ?? href,
  };
}

const firstNonEmpty = (...values: Array<string | undefined | null>): string | undefined => {
  for (const v of values) {
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
};

const seoImageToFallback = (img: SeoImageAsset | null | undefined): FallbackImage | undefined => {
  if (!img?.asset?.url) return undefined;
  return {
    url: img.asset.url,
    alt: img.alt,
    width: img.asset.metadata?.dimensions?.width,
    height: img.asset.metadata?.dimensions?.height,
  };
};

const robotsFromSeo = (
  noIndex?: boolean,
  noFollow?: boolean,
): Metadata["robots"] => {
  // If neither flag is set, omit the robots field — let crawlers default to index/follow.
  if (!noIndex && !noFollow) return undefined;
  return {
    index: !noIndex,
    follow: !noFollow,
  };
};

/**
 * Build a Next.js Metadata object from a bilingual `seo` Sanity object,
 * with fallbacks to defaultSeo (generalLayout) and per-page hardcoded fallbacks.
 */
export function buildMetadata(args: BuildMetadataArgs): Metadata {
  const { seo, defaults, locale, href, hrefByLocale, alternates: alternatesArg, fallbackTitle, fallbackDescription, fallbackImage } = args;

  const title = firstNonEmpty(
    getLocalized(seo?.metaTitle, locale),
    fallbackTitle,
    getLocalized(defaults?.metaTitle, locale),
  );

  const description = firstNonEmpty(
    getLocalized(seo?.metaDescription, locale),
    fallbackDescription,
    getLocalized(defaults?.metaDescription, locale),
  );

  const keywordsArr =
    (locale === "es" ? seo?.keywords?.es : seo?.keywords?.en) ??
    (locale === "es" ? defaults?.keywords?.es : defaults?.keywords?.en) ??
    [];

  const ogTitle = firstNonEmpty(
    getLocalized(seo?.ogTitle, locale),
    title,
  );

  const ogDescription = firstNonEmpty(
    getLocalized(seo?.ogDescription, locale),
    description,
  );

  const image =
    seoImageToFallback(seo?.ogImage) ??
    (fallbackImage ?? undefined) ??
    seoImageToFallback(defaults?.ogImage);

  const alternates =
    alternatesArg ?? generateHreflangAlternates(resolveHrefs(href, hrefByLocale));
  // Canonical from the real locale. Per-locale slug overrides only exist for
  // en/es; other locales (the blog index in fr/de/pt/it) use the shared href.
  const canonicalHref =
    locale === "en" || locale === "es" ? hrefByLocale?.[locale] ?? href : href;
  const canonical = getLocalizedUrl(locale, canonicalHref);

  const twitterCard = seo?.twitterCard ?? defaults?.twitterCard ?? "summary_large_image";

  return {
    title,
    description,
    keywords: keywordsArr.length > 0 ? keywordsArr : undefined,
    alternates: {
      canonical,
      ...alternates,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: OG_LOCALE[locale],
      type: "website",
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: image ? [image.url] : undefined,
    },
    robots: robotsFromSeo(seo?.noIndex, seo?.noFollow),
  };
}

/**
 * Build Metadata from a single-language `seoSingleLanguage` Sanity object
 * (used for blog articles where each document represents one locale).
 */
export function buildSingleLanguageMetadata(
  args: BuildSingleLanguageMetadataArgs,
): Metadata {
  const { seo, defaults, locale, href, alternates: alternatesArg, fallbackTitle, fallbackDescription, fallbackImage } = args;

  const title = firstNonEmpty(
    seo?.metaTitle,
    fallbackTitle,
    getLocalized(defaults?.metaTitle, locale),
  );

  const description = firstNonEmpty(
    seo?.metaDescription,
    fallbackDescription,
    getLocalized(defaults?.metaDescription, locale),
  );

  const keywordsArr =
    seo?.keywords ??
    (locale === "es" ? defaults?.keywords?.es : defaults?.keywords?.en) ??
    [];

  const ogTitle = firstNonEmpty(seo?.ogTitle, title);
  const ogDescription = firstNonEmpty(seo?.ogDescription, description);

  const image =
    seoImageToFallback(seo?.ogImage) ??
    (fallbackImage ?? undefined) ??
    seoImageToFallback(defaults?.ogImage);

  // Canonical is the article's own per-language URL (e.g. /fr/blog/<slug>).
  const canonical = getLocalizedUrl(locale, href);
  // Prefer the translation-group-derived hreflang; otherwise fall back to a
  // reciprocal en/es pair for the same href (legacy single-language pages).
  const alternates =
    alternatesArg ?? generateHreflangAlternates({ en: href, es: href });

  const twitterCard = seo?.twitterCard ?? defaults?.twitterCard ?? "summary_large_image";

  return {
    title,
    description,
    keywords: keywordsArr.length > 0 ? keywordsArr : undefined,
    alternates: {
      canonical,
      ...alternates,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      locale: OG_LOCALE[locale],
      type: "article",
      images: image
        ? [
            {
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
            },
          ]
        : undefined,
    },
    twitter: {
      card: twitterCard,
      title: ogTitle,
      description: ogDescription,
      images: image ? [image.url] : undefined,
    },
    robots: robotsFromSeo(seo?.noIndex, seo?.noFollow),
  };
}
