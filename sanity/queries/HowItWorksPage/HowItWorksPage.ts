import { client } from "@/sanity/lib/client";
import type { LocalizedField } from "../GeneralLayout/generalLayoutQuery";
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
}

export interface HowItWorksPageData {
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  heroImage: HowItWorksHeroImage | null;

  stepsHeading: LocalizedField;
  stepsSubheading: LocalizedField;
  steps: BookingStep[];

  faqHeading: LocalizedField;
  faqSubheading: LocalizedField;
  faqItems: FaqItem[];

  ctaHeadline: LocalizedField;
  ctaSubheadline: LocalizedField;
  ctaButtonText: LocalizedField;
  ctaButtonHref: string;
  ctaWhatsappLabel: LocalizedField;
}

// =============================================================================
// Query
// =============================================================================

export const howItWorksPageQuery = /* groq */ `*[_type == "howItWorksPage"][0]{
  heroHeadline,
  heroSubheadline,
  heroImage {
    asset->{
      url,
      metadata { lqip }
    },
    hotspot,
    crop
  },
  stepsHeading,
  stepsSubheading,
  steps[] {
    stepNumber,
    icon,
    title,
    description
  },
  faqHeading,
  faqSubheading,
  faqItems[] {
    question,
    answer
  },
  ctaHeadline,
  ctaSubheadline,
  ctaButtonText,
  ctaButtonHref,
  ctaWhatsappLabel
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
