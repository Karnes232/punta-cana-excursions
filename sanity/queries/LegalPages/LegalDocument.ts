import { client } from "@/sanity/lib/client";
import type { LocalizedBlockContent, LocalizedField } from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface LegalPageData {
  title: LocalizedField;
  body: LocalizedBlockContent;
  lastUpdated: string | null;
}

// =============================================================================
// Query
// =============================================================================

const legalDocumentQuery = /* groq */ `*[_type == "legalDocument" && _id == $id][0] {
  title,
  body,
  lastUpdated
}`;

// =============================================================================
// Fetch functions
// =============================================================================

async function getLegalDocument(id: string): Promise<LegalPageData | null> {
  return client.fetch<LegalPageData>(legalDocumentQuery, { id });
}

export const getPrivacyPolicy = () => getLegalDocument("privacy-policy");
export const getTermsOfService = () => getLegalDocument("terms-of-service");
export const getCancellationPolicy = () => getLegalDocument("cancellation-policy");

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const legalDocumentSeoQuery = `*[_type == "legalDocument" && _id == $id][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getLegalDocumentSeo(id: string): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(legalDocumentSeoQuery, { id });
}
