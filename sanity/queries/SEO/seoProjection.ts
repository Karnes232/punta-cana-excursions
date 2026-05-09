import { client } from "@/sanity/lib/client";
import type {
  LocalizedField,
  LocalizedStringArray,
} from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface SeoImageAsset {
  asset: {
    url: string;
    metadata: {
      lqip?: string;
      dimensions?: { width: number; height: number };
    };
  };
  alt?: string;
}

/** Bilingual SEO — used by every page document except blogArticle. */
export interface SeoData {
  metaTitle?: LocalizedField;
  metaDescription?: LocalizedField;
  keywords?: LocalizedStringArray;
  ogTitle?: LocalizedField;
  ogDescription?: LocalizedField;
  ogImage?: SeoImageAsset | null;
  twitterCard?: "summary" | "summary_large_image";
  structuredDataEn?: string;
  structuredDataEs?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

/** Single-language SEO — used by blogArticle (one doc per language). */
export interface SeoSingleLanguageData {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: SeoImageAsset | null;
  twitterCard?: "summary" | "summary_large_image";
  structuredData?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

// =============================================================================
// GROQ projection fragments
// =============================================================================

/** Projection fragment for the bilingual `seo` object. */
export const seoProjection = `
  metaTitle,
  metaDescription,
  keywords,
  ogTitle,
  ogDescription,
  ogImage {
    asset->{
      url,
      metadata { lqip, dimensions { width, height } }
    },
    alt
  },
  twitterCard,
  structuredDataEn,
  structuredDataEs,
  noIndex,
  noFollow
`;

/** Projection fragment for the single-language `seoSingleLanguage` object. */
export const seoSingleLanguageProjection = `
  metaTitle,
  metaDescription,
  keywords,
  ogTitle,
  ogDescription,
  ogImage {
    asset->{
      url,
      metadata { lqip, dimensions { width, height } }
    },
    alt
  },
  twitterCard,
  structuredData,
  noIndex,
  noFollow
`;

// =============================================================================
// Site-wide default SEO (from generalLayout)
// =============================================================================

export interface DefaultSeoResult {
  defaultSeo: SeoData | null;
  companyName: LocalizedField | null;
}

export const defaultSeoQuery = `*[_type == "generalLayout"][0]{
  "defaultSeo": defaultSeo { ${seoProjection} },
  companyName
}`;

export async function getDefaultSeo(): Promise<DefaultSeoResult | null> {
  return client.fetch(defaultSeoQuery);
}
