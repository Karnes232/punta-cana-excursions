import type { Metadata } from "next";
import { generateHreflangAlternates } from "@/i18n/hreflang";
import { SITE_URL } from "@/lib/seo/constants";
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
  locale: Locale;
  /** Path WITHOUT the locale prefix, e.g. "/excursions/foo" or "/" */
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
}

interface BuildSingleLanguageMetadataArgs {
  seo: SeoSingleLanguageData | null | undefined;
  defaults: SeoData | null | undefined;
  locale: Locale;
  path: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: FallbackImage | null;
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
  const { seo, defaults, locale, path, fallbackTitle, fallbackDescription, fallbackImage } = args;

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

  const alternates = generateHreflangAlternates(locale, path);
  const canonical = locale === "es"
    ? `${SITE_URL}${path === "/" ? "/es" : `/es${path}`}`
    : `${SITE_URL}${path}`;

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
      locale: locale === "es" ? "es_ES" : "en_US",
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
  const { seo, defaults, locale, path, fallbackTitle, fallbackDescription, fallbackImage } = args;

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

  const alternates = generateHreflangAlternates(locale, path);
  const canonical = locale === "es"
    ? `${SITE_URL}${path === "/" ? "/es" : `/es${path}`}`
    : `${SITE_URL}${path}`;

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
      locale: locale === "es" ? "es_ES" : "en_US",
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
