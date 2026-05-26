import { client } from "@/sanity/lib/client";
import type {
  LocalizedField,
  LocalizedBlockContent,
} from "../GeneralLayout/generalLayoutQuery";
import { seoProjection, type SeoData } from "../SEO/seoProjection";

// =============================================================================
// Types
// =============================================================================

export interface BookingStep {
  stepNumber: number;
  icon: string;
  title: LocalizedField;
  description: LocalizedField;
}

export interface FaqItem {
  question: LocalizedField;
  answer: LocalizedField;
}

export interface HowItWorksHeroImage {
  asset: {
    url: string;
    metadata: {
      lqip?: string;
    };
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: LocalizedField | null;
}

export interface HowItWorksPageData {
  heroEyebrow: LocalizedField;
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  heroImage: HowItWorksHeroImage | null;

  introEyebrow: LocalizedField;
  introHeadline: LocalizedField;
  introBody: LocalizedBlockContent;

  stepsEyebrow: LocalizedField;
  stepsHeading: LocalizedField;
  steps: BookingStep[];

  faqEyebrow: LocalizedField;
  faqHeading: LocalizedField;
  faqSubheading: LocalizedField;
  faqItems: FaqItem[];

  ctaEyebrow: LocalizedField;
  ctaHeadline: LocalizedField;
  ctaSubheadline: LocalizedField;
  ctaButtonText: LocalizedField;
  ctaButtonHref: string;
  ctaSecondaryButtonText: LocalizedField;
  ctaSecondaryButtonHref: string;
}

// =============================================================================
// Query
// =============================================================================

export const howItWorksPageQuery = /* groq */ `*[_type == "howItWorksPage"][0]{
  heroEyebrow,
  heroHeadline,
  heroSubheadline,
  heroImage {
    asset->{
      url,
      metadata { lqip }
    },
    hotspot,
    crop,
    alt
  },
  introEyebrow,
  introHeadline,
  introBody,
  stepsEyebrow,
  stepsHeading,
  steps[] {
    stepNumber,
    icon,
    title,
    description
  },
  faqEyebrow,
  faqHeading,
  faqSubheading,
  faqItems[] {
    question,
    answer
  },
  ctaEyebrow,
  ctaHeadline,
  ctaSubheadline,
  ctaButtonText,
  ctaButtonHref,
  ctaSecondaryButtonText,
  ctaSecondaryButtonHref
}`;

// =============================================================================
// Fetch function
// =============================================================================

export async function getHowItWorksPage(): Promise<HowItWorksPageData | null> {
  return client.fetch<HowItWorksPageData | null>(howItWorksPageQuery);
}

// =============================================================================
// SEO
// =============================================================================

export const howItWorksPageSeoQuery = `*[_type == "howItWorksPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getHowItWorksPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(howItWorksPageSeoQuery);
}
