import { client } from "@/sanity/lib/client";
import {
  LocalizedBlockContent,
  LocalizedField,
  LocalizedStringArray,
} from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface DivingGalleryImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip: string;
      dimensions: { width: number; height: number };
    };
  };
  alt: LocalizedField;
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface DivingFaqItem {
  _key: string;
  question: LocalizedField;
  answer: LocalizedField;
}

export interface RelatedDivingExcursion {
  _id: string;
  title: LocalizedField;
  slug: { current: string };
  shortSummary: LocalizedField;
  price: number;
  duration: LocalizedField;
  isFeatured: boolean;
  badge: LocalizedField | null;
  activityType: string;
  heroImage: {
    asset: {
      _id: string;
      url: string;
      metadata: { lqip: string };
    };
    alt: LocalizedField;
  };
}

export interface IndividualDivingExcursion {
  _id: string;
  _type: "divingExcursion";

  // Content
  title: LocalizedField;
  slug: { current: string };
  shortSummary: LocalizedField;
  badge: LocalizedField | null;

  // Media
  heroImage: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        lqip: string;
        dimensions: { width: number; height: number; aspectRatio: number };
      };
    };
    alt: LocalizedField;
    hotspot?: { x: number; y: number; width: number; height: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  gallery: DivingGalleryImage[];

  // Diving details
  activityType: string;
  experienceLevel: string;
  certificationRequired: boolean;
  certificationDetails: LocalizedField | null;
  maxDepth: LocalizedField | null;
  numberOfDives: number | null;
  marineLife: LocalizedStringArray;
  equipmentProvided: LocalizedStringArray;

  // Pricing & logistics
  price: number;
  depositAmount: number;
  priceNote: LocalizedField;
  duration: LocalizedField;
  pickupTime: LocalizedField | null;
  pickupZones: string[];
  groupSize: LocalizedField | null;

  // Lists
  highlights: LocalizedStringArray;
  fullDescription: LocalizedBlockContent;
  whatsIncluded: LocalizedStringArray;
  whatToBring: LocalizedStringArray;
  restrictions: LocalizedStringArray;

  // FAQ + related
  faq: DivingFaqItem[];
  relatedExcursions: RelatedDivingExcursion[];

  seo: any;
}

export interface DivingExcursionSlug {
  slug: string;
}

// =============================================================================
// Queries
// =============================================================================

export const individualDivingExcursionQuery = `*[_type == "divingExcursion" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  shortSummary,
  badge,
  heroImage {
    asset-> {
      _id,
      url,
      metadata { lqip, dimensions { width, height, aspectRatio } }
    },
    alt, hotspot, crop
  },
  gallery[] {
    asset-> {
      _id,
      url,
      metadata { lqip, dimensions { width, height } }
    },
    alt, hotspot, crop
  },
  activityType,
  experienceLevel,
  certificationRequired,
  certificationDetails,
  maxDepth,
  numberOfDives,
  marineLife,
  equipmentProvided,
  price,
  depositAmount,
  priceNote,
  duration,
  pickupTime,
  pickupZones,
  groupSize,
  highlights,
  fullDescription,
  whatsIncluded,
  whatToBring,
  restrictions,
  faq[] { _key, question, answer },
  relatedExcursions[]-> {
    _id,
    title,
    slug,
    shortSummary,
    price,
    duration,
    isFeatured,
    badge,
    activityType,
    heroImage {
      asset-> { _id, url, metadata { lqip } },
      alt
    }
  },
  seo
}`;

export const divingExcursionSlugsQuery = `*[_type == "divingExcursion" && defined(slug.current)] {
  "slug": slug.current
}`;

// =============================================================================
// Fetch functions
// =============================================================================

export async function getIndividualDivingExcursion(
  slug: string,
): Promise<IndividualDivingExcursion | null> {
  return await client.fetch(individualDivingExcursionQuery, { slug });
}

export async function getDivingExcursionSlugs(): Promise<DivingExcursionSlug[]> {
  return await client.fetch(divingExcursionSlugsQuery);
}
