import { client } from "@/sanity/lib/client";

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
  storyBody: LocalizedText;
  storyImage: { url: string; lqip?: string } | null;
  foundedYear: number;

  statsHeadline: LocalizedString;
  stats: AboutStatItem[];

  valuesHeadline: LocalizedString;
  valuesSubheading: LocalizedText;
  values: AboutValueItem[];

  teamHeadline: LocalizedString;
  teamSubheading: LocalizedText;
  teamMembers: AboutTeamMember[];

  ctaHeadline: LocalizedString;
  ctaSubheadline: LocalizedText;
  ctaButtonText: LocalizedString;
  ctaWhatsappNumber: string;
  ctaContactText: LocalizedString;

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
  statsHeadline,
  stats[] { value, label },
  valuesHeadline,
  valuesSubheading,
  values[] { icon, title, description },
  teamHeadline,
  teamSubheading,
  teamMembers[] {
    name,
    role,
    bio,
    photo { "url": asset->url, "lqip": asset->metadata.lqip }
  },
  ctaHeadline,
  ctaSubheadline,
  ctaButtonText,
  ctaWhatsappNumber,
  ctaContactText,
  seo { metaTitle, metaDescription, ogImage { "url": asset->url } }
}`;

// =============================================================================
// Fetch function
// =============================================================================

export async function getAboutPage(): Promise<AboutPageData | null> {
  return client.fetch<AboutPageData>(aboutPageQuery);
}
