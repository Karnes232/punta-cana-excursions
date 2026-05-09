import { client } from "@/sanity/lib/client";
import type { LocalizedField } from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface FaqItem {
  _key: string;
  question: LocalizedField;
  answer: LocalizedField;
}

export interface FaqCategory {
  _key: string;
  categoryName: LocalizedField;
  icon: string | null;
  items: FaqItem[];
}

export interface FaqPageData {
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  heroImage: {
    asset: { url: string; metadata: { lqip?: string } };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  } | null;
  categories: FaqCategory[];
}

// =============================================================================
// Query
// =============================================================================

const faqPageQuery = /* groq */ `*[_type == "faqPage"][0] {
  heroHeadline,
  heroSubheadline,
  heroImage {
    asset-> { url, metadata { lqip } },
    hotspot,
    crop
  },
  categories[] {
    _key,
    categoryName,
    icon,
    items[] {
      _key,
      question,
      answer
    }
  }
}`;

// =============================================================================
// Fetch function
// =============================================================================

export async function getFaqPage(): Promise<FaqPageData | null> {
  return client.fetch<FaqPageData>(faqPageQuery);
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const faqPageSeoQuery = `*[_type == "faqPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getFaqPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(faqPageSeoQuery);
}
