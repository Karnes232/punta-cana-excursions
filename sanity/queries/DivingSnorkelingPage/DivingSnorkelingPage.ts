import type { LocalizedBlockContent } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { client } from "@/sanity/lib/client";

/* ---------------------------------------------------------------------------
   divingSnorkelingPageQuery — Combined GROQ for the Diving & Snorkeling page
   
   Fetches:
   1. The page singleton (hero, intro, trust, CTA, SEO fields)
   2. Diving excursions (filtered by category slug "diving")
   3. Snorkeling excursions (filtered by category slug "snorkeling")
   
   All in a single request using GROQ named projections.
   --------------------------------------------------------------------------- */

export const divingSnorkelingPageQuery = /* groq */ `{
  "page": *[_type == "divingSnorkelingPage"][0] {
    // Hero
    heroImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "alt": asset->altText
    },
    heroBadge,
    heroHeadline,
    heroSubheadline,
    heroPrimaryCTA {
      text,
      href
    },
    heroSecondaryCTA {
      text,
      href
    },

    // Intro
    introTagline,
    introHeadline,
    introBody,
    introImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "alt": asset->altText
    },
    introStats[] {
      value,
      label
    },

    // Trust
    trustHeadline,
    trustPillars[] {
      icon,
      title,
      description
    },

    // CTA
    ctaHeadline,
    ctaButtonText,
    ctaWhatsappNumber,

    // SEO
    seo {
      metaTitle,
      metaDescription,
      ogImage { "url": asset->url }
    }
  },

  "divingExcursions": *[_type == "excursion" && category->slug.current == "diving"] | order(sortOrder asc) {
    _id,
    title,
    slug,
    shortSummary,
    heroImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "alt": asset->altText
    },
    price,
    depositAmount,
    priceNote,
    duration,
    isFeatured,
    badge,
    category-> { title, slug }
  },

  "snorkelingExcursions": *[_type == "excursion" && category->slug.current == "snorkeling"] | order(sortOrder asc) {
    _id,
    title,
    slug,
    shortSummary,
    heroImage {
      "url": asset->url,
      "lqip": asset->metadata.lqip,
      "alt": asset->altText
    },
    price,
    depositAmount,
    priceNote,
    duration,
    isFeatured,
    badge,
    category-> { title, slug }
  }
}`;

// =============================================================================
// TypeScript interfaces
// =============================================================================

interface LocalizedString {
  en: string;
  es: string;
}

interface LocalizedText {
  en: string;
  es: string;
}

interface SanityImage {
  url: string;
  /** From asset altText in GROQ projections */
  alt?: string | null;
  lqip?: string;
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

interface ExcursionCard {
  _id: string;
  title: LocalizedString;
  slug: { current: string };
  shortSummary: LocalizedText;
  heroImage: SanityImage;
  price: number;
  depositAmount: number;
  priceNote: LocalizedString;
  duration: LocalizedString;
  isFeatured: boolean;
  badge: LocalizedString | null;
  category: {
    title: LocalizedString;
    slug: { current: string };
  };
}

export interface DivingSnorkelingPageData {
  page: {
    heroImage: SanityImage;
    heroBadge: LocalizedString;
    heroHeadline: LocalizedString;
    heroSubheadline: LocalizedString;
    heroPrimaryCTA: CTA;
    heroSecondaryCTA: CTA;
    introTagline: LocalizedString;
    introHeadline: LocalizedString;
    introBody: LocalizedBlockContent;
    introImage: SanityImage;
    introStats: Array<{
      value: LocalizedString;
      label: LocalizedString;
    }>;
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
  };
  divingExcursions: ExcursionCard[];
  snorkelingExcursions: ExcursionCard[];
}

// =============================================================================
// Fetch function
// =============================================================================

export async function getDivingSnorkelingPage(): Promise<DivingSnorkelingPageData> {
  return client.fetch<DivingSnorkelingPageData>(divingSnorkelingPageQuery);
}

// =============================================================================
// Localization helper (same pattern used across the project)
// =============================================================================

export function getLocalized(
  field: LocalizedString | LocalizedText | undefined | null,
  locale: string,
): string {
  if (!field) return "";
  return (field as unknown as Record<string, string>)[locale] || field.en || "";
}
