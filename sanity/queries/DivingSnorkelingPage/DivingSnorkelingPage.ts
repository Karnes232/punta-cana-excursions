import type { LocalizedBlockContent } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { client } from "@/sanity/lib/client";

// =============================================================================
// Shared types
// =============================================================================

interface LocalizedString {
  en: string;
  es: string;
}

interface LocalizedText {
  en: string;
  es: string;
}

interface CTA {
  text: LocalizedString;
  href: string;
}

interface TrustPillar {
  icon: string;
  title: LocalizedString;
  description: LocalizedText;
}

export interface DivingExcursionCard {
  _id: string;
  title: LocalizedString;
  slug: { current: string };
  shortSummary: LocalizedText;
  heroImage: {
    url: string;
    lqip?: string;
    alt?: LocalizedString | null;
  };
  price: number;
  depositAmount: number;
  priceNote: LocalizedString;
  duration: LocalizedString;
  isFeatured: boolean;
  badge: LocalizedString | null;
  activityType: string;
  experienceLevel: string;
}

export interface DivingSnorkelingPageData {
  heroImage: { url: string; lqip?: string };
  heroBadge: LocalizedString;
  heroHeadline: LocalizedString;
  heroSubheadline: LocalizedString;
  heroPrimaryCTA: CTA;
  heroSecondaryCTA: CTA;
  introTagline: LocalizedString;
  introHeadline: LocalizedString;
  introBody: LocalizedBlockContent;
  introImage: { url: string; lqip?: string };
  introStats: Array<{ value: LocalizedString; label: LocalizedString }>;
  trustHeadline: LocalizedString;
  trustPillars: TrustPillar[];
  ctaHeadline: LocalizedString;
  ctaButtonText: LocalizedString;
  ctaWhatsappNumber: string;
  seo: {
    metaTitle: LocalizedString;
    metaDescription: LocalizedText;
    ogImage: { url: string } | null;
  };
}

// =============================================================================
// Shared excursion card projection (reused in both queries)
// =============================================================================

const excursionCardProjection = /* groq */ `{
  _id,
  title,
  slug,
  shortSummary,
  heroImage {
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    alt
  },
  price,
  depositAmount,
  priceNote,
  duration,
  isFeatured,
  badge,
  activityType,
  experienceLevel
}`;

// =============================================================================
// Queries
// =============================================================================

export const divingSnorkelingPageQuery = /* groq */ `*[_type == "divingSnorkelingPage"][0] {
  heroImage {
    "url": asset->url,
    "lqip": asset->metadata.lqip
  },
  heroBadge,
  heroHeadline,
  heroSubheadline,
  heroPrimaryCTA { text, href },
  heroSecondaryCTA { text, href },
  introTagline,
  introHeadline,
  introBody,
  introImage {
    "url": asset->url,
    "lqip": asset->metadata.lqip
  },
  introStats[] { value, label },
  trustHeadline,
  trustPillars[] { icon, title, description },
  ctaHeadline,
  ctaButtonText,
  ctaWhatsappNumber,
  seo {
    metaTitle,
    metaDescription,
    ogImage { "url": asset->url }
  }
}`;

export const divingExcursionsQuery = /* groq */ `*[_type == "divingExcursion" && activityType in ["scuba-diving", "freediving", "scuba-snorkeling"]] | order(sortOrder asc) ${excursionCardProjection}`;

export const snorkelingExcursionsQuery = /* groq */ `*[_type == "divingExcursion" && activityType in ["snorkeling", "snuba"]] | order(sortOrder asc) ${excursionCardProjection}`;

// =============================================================================
// Fetch functions
// =============================================================================

export async function getDivingSnorkelingPage(): Promise<DivingSnorkelingPageData | null> {
  return client.fetch<DivingSnorkelingPageData>(divingSnorkelingPageQuery);
}

export async function getDivingExcursions(): Promise<DivingExcursionCard[]> {
  return client.fetch<DivingExcursionCard[]>(divingExcursionsQuery);
}

export async function getSnorkelingExcursions(): Promise<DivingExcursionCard[]> {
  return client.fetch<DivingExcursionCard[]>(snorkelingExcursionsQuery);
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const divingSnorkelingPageSeoQuery = `*[_type == "divingSnorkelingPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getDivingSnorkelingPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(divingSnorkelingPageSeoQuery);
}
