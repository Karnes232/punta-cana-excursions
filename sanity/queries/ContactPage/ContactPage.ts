import { client } from "@/sanity/lib/client";
import type { LocalizedField } from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface ContactPageData {
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  heroImage: {
    asset: { url: string; metadata: { lqip?: string } };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  } | null;
  formHeadline: LocalizedField;
  infoHeadline: LocalizedField;
}

// =============================================================================
// Query
// =============================================================================

const contactPageQuery = /* groq */ `*[_type == "contactPage"][0] {
  heroHeadline,
  heroSubheadline,
  heroImage {
    asset-> { url, metadata { lqip } },
    hotspot,
    crop
  },
  formHeadline,
  infoHeadline
}`;

// =============================================================================
// Fetch function
// =============================================================================

export async function getContactPage(): Promise<ContactPageData | null> {
  return client.fetch<ContactPageData>(contactPageQuery);
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const contactPageSeoQuery = `*[_type == "contactPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getContactPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(contactPageSeoQuery);
}
