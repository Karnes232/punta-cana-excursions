import { client } from "@/sanity/lib/client";
import type { LocalizedBlockContent } from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

interface LocalizedString {
  en: string;
  es: string;
}

interface LocalizedText {
  en: string;
  es: string;
}

export interface AboutStatItem {
  value: LocalizedString;
  label: LocalizedString;
}

export interface AboutValueItem {
  icon: string;
  title: LocalizedString;
  description: LocalizedText;
}

export interface AboutBeliefItem {
  headline: LocalizedString;
  body: LocalizedBlockContent;
}

export interface AboutTeamMember {
  name: string;
  role: LocalizedString;
  bio: LocalizedText;
  photo: { url: string; lqip?: string } | null;
}

export interface AboutPageData {
  heroImage: { url: string; lqip?: string } | null;
  heroBadge: LocalizedString;
  heroHeadline: LocalizedString;
  heroSubheadline: LocalizedText;

  storyTagline: LocalizedString;
  storyHeadline: LocalizedString;
  storyBody: LocalizedBlockContent;
  storyImage: { url: string; lqip?: string } | null;
  foundedYear: number;

  beliefsEyebrow: LocalizedString;
  beliefsHeadline: LocalizedString;
  beliefsBody: LocalizedBlockContent;
  beliefs: AboutBeliefItem[];

  statsHeadline: LocalizedString;
  stats: AboutStatItem[];

  valuesEyebrow: LocalizedString;
  valuesHeadline: LocalizedString;
  valuesSubheading: LocalizedBlockContent;
  values: AboutValueItem[];

  operateEyebrow: LocalizedString;
  operateHeadline: LocalizedString;
  operateBody: LocalizedBlockContent;

  teamHeadline: LocalizedString;
  teamSubheading: LocalizedText;
  teamMembers: AboutTeamMember[];

  ctaEyebrow: LocalizedString;
  ctaHeadline: LocalizedString;
  ctaSubheadline: LocalizedText;
  ctaPrimaryButtonText: LocalizedString;
  ctaPrimaryButtonHref: string;
  ctaSecondaryButtonText: LocalizedString;
  ctaSecondaryButtonHref: string;

  seo: {
    metaTitle: LocalizedString;
    metaDescription: LocalizedText;
    ogImage: { url: string } | null;
  };
}

// =============================================================================
// Query
// =============================================================================

export const aboutPageQuery = /* groq */ `*[_type == "aboutPage"][0] {
  heroImage { "url": asset->url, "lqip": asset->metadata.lqip },
  heroBadge,
  heroHeadline,
  heroSubheadline,
  storyTagline,
  storyHeadline,
  storyBody,
  storyImage { "url": asset->url, "lqip": asset->metadata.lqip },
  foundedYear,
  beliefsEyebrow,
  beliefsHeadline,
  beliefsBody,
  beliefs[] { headline, body },
  statsHeadline,
  stats[] { value, label },
  valuesEyebrow,
  valuesHeadline,
  valuesSubheading,
  values[] { icon, title, description },
  operateEyebrow,
  operateHeadline,
  operateBody,
  teamHeadline,
  teamSubheading,
  teamMembers[] {
    name,
    role,
    bio,
    photo { "url": asset->url, "lqip": asset->metadata.lqip }
  },
  ctaEyebrow,
  ctaHeadline,
  ctaSubheadline,
  ctaPrimaryButtonText,
  ctaPrimaryButtonHref,
  ctaSecondaryButtonText,
  ctaSecondaryButtonHref,
  seo { metaTitle, metaDescription, ogImage { "url": asset->url } }
}`;

// =============================================================================
// Fetch function
// =============================================================================

export async function getAboutPage(): Promise<AboutPageData | null> {
  return client.fetch<AboutPageData>(aboutPageQuery);
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const aboutPageSeoQuery = `*[_type == "aboutPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getAboutPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(aboutPageSeoQuery);
}
