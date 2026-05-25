import { client } from "@/sanity/lib/client";
import {
  LocalizedField,
  LocalizedBlockContent,
} from "../GeneralLayout/generalLayoutQuery";

export interface ExcursionsPage {
  _id: string;
  heroImage: {
    asset: {
      url: string;
      metadata: {
        lqip: string;
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
  };
  heroEyebrow: LocalizedField;
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  introEyebrow: LocalizedField;
  introHeading: LocalizedField;
  introBody: LocalizedBlockContent;
  ctaEyebrow: LocalizedField;
  ctaHeadline: LocalizedField;
  ctaDescription: LocalizedField;
  ctaPrimaryButtonText: LocalizedField;
  ctaPrimaryButtonHref: string;
  ctaSecondaryButtonText: LocalizedField;
  ctaSecondaryButtonHref: string;
  seoCopyEyebrow: LocalizedField;
  seoCopyHeading: LocalizedField;
  seoCopyBody: LocalizedBlockContent;
}

export const excursionsPageQuery = `*[_type == "excursionsPage"][0] {
    _id,
    heroImage {
        asset-> {
            url,
            metadata {
                lqip,
                dimensions {
                    width,
                    height,
                }
            }
        }
    },
    heroEyebrow,
    heroHeadline,
    heroSubheadline,
    introEyebrow,
    introHeading,
    introBody,
    ctaEyebrow,
    ctaHeadline,
    ctaDescription,
    ctaPrimaryButtonText,
    ctaPrimaryButtonHref,
    ctaSecondaryButtonText,
    ctaSecondaryButtonHref,
    seoCopyEyebrow,
    seoCopyHeading,
    seoCopyBody,
}`;

export async function getExcursionsPage(): Promise<ExcursionsPage | null> {
  const result = await client.fetch<ExcursionsPage>(excursionsPageQuery);
  return result;
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const excursionsPageSeoQuery = `*[_type == "excursionsPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getExcursionsPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(excursionsPageSeoQuery);
}
