import { client } from "@/sanity/lib/client";
import {
  LocalizedBlockContent,
  LocalizedField,
  LocalizedStringArray,
} from "../GeneralLayout/generalLayoutQuery";

// =============================================================================
// Types
// =============================================================================

export interface GalleryImage {
  asset: {
    _id: string;
    url: string;
    metadata: {
      lqip: string;
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  alt: LocalizedField;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface ExcursionCategory {
  _id: string;
  title: LocalizedField;
  slug: {
    current: string;
  };
}

export interface ExcursionFaqItem {
  _key: string;
  question: LocalizedField;
  answer: LocalizedField;
}

export interface RelatedExcursion {
  _id: string;
  title: LocalizedField;
  slug: {
    current: string;
  };
  shortSummary: LocalizedField;
  price: number;
  duration: LocalizedField;
  isFeatured: boolean;
  badge: LocalizedField | null;
  heroImage: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        lqip: string;
      };
    };
    alt: LocalizedField;
    hotspot?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  category: ExcursionCategory;
}

export interface IndividualExcursion {
  _id: string;
  _type: "excursion";

  // Section 2: Title + Summary
  title: LocalizedField;
  slug: {
    current: string;
  };
  shortSummary: LocalizedField;
  badge: LocalizedField | null;

  // Section 1: Image Gallery Hero
  heroImage: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        lqip: string;
        dimensions: {
          width: number;
          height: number;
          aspectRatio: number;
        };
      };
    };
    alt: LocalizedField;
    hotspot?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  gallery: GalleryImage[];

  // Section 2 continued: Category
  category: ExcursionCategory;

  // Section 3: Price & Deposit
  price: number;
  depositAmount: number;
  priceNote: LocalizedField;

  // Section 2 continued: Key stats
  duration: LocalizedField;
  pickupTime: LocalizedField;
  pickupZones: string[];
  groupSize: LocalizedField;

  // Section 4: Highlights
  highlights: LocalizedStringArray;

  // Section 5: Full Description (localized Portable Text)
  fullDescription: LocalizedBlockContent;

  // Section 6: What's Included
  whatsIncluded: LocalizedStringArray;

  // Section 7: What to Bring
  whatToBring: LocalizedStringArray;

  // Section 8: Restrictions
  restrictions: LocalizedStringArray;

  // Section 9: FAQ
  faq: ExcursionFaqItem[];

  // Section 11: Related Excursions
  relatedExcursions: RelatedExcursion[];

  // SEO
  seo: any;
}

export interface ExcursionListItem {
  _id: string;
  title: LocalizedField;
  slug: {
    current: string;
  };
  shortSummary: LocalizedField;
  price: number;
  duration: LocalizedField;
  isFeatured: boolean;
  badge: LocalizedField | null;
  sortOrder: number;
  heroImage: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        lqip: string;
      };
    };
    alt: LocalizedField;
    hotspot?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    crop?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
  category: ExcursionCategory;
}

export interface ExcursionSlug {
  slug: string;
}

// =============================================================================
// Queries
// =============================================================================

export const individualExcursionQuery = `*[_type == "excursion" && slug.current == $slug][0] {
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
            metadata {
                lqip,
                dimensions {
                    width,
                    height,
                    aspectRatio
                }
            }
        },
        alt,
        hotspot,
        crop
    },
    gallery[] {
        asset-> {
            _id,
            url,
            metadata {
                lqip,
                dimensions {
                    width,
                    height
                }
            }
        },
        alt,
        hotspot,
        crop
    },
    category-> {
        _id,
        title,
        slug
    },
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
    faq[] {
        _key,
        question,
        answer
    },
    relatedExcursions[]-> {
        _id,
        title,
        slug,
        shortSummary,
        price,
        duration,
        isFeatured,
        badge,
        heroImage {
            asset-> {
                _id,
                url,
                metadata {
                    lqip
                }
            },
            alt,
            hotspot,
            crop
        },
        category-> {
            _id,
            title,
            slug
        }
    },
    seo
}`;

export const excursionListQuery = `*[_type == "excursion"] | order(sortOrder asc) {
    _id,
    title,
    slug,
    shortSummary,
    price,
    duration,
    isFeatured,
    badge,
    sortOrder,
    heroImage {
        asset-> {
            _id,
            url,
            metadata {
                lqip
            }
        },
        alt,
        hotspot,
        crop
    },
    category-> {
        _id,
        title,
        slug
    }
}`;

export const excursionSlugsQuery = `*[_type == "excursion" && defined(slug.current)] {
    "slug": slug.current
}`;

export const featuredExcursionsQuery = `*[_type == "excursion" && isFeatured == true] | order(sortOrder asc) [0...3] {
    _id,
    title,
    slug,
    shortSummary,
    price,
    duration,
    isFeatured,
    badge,
    sortOrder,
    heroImage {
        asset-> {
            _id,
            url,
            metadata {
                lqip
            }
        },
        alt,
        hotspot,
        crop
    },
    category-> {
        _id,
        title,
        slug
    }
}`;

// =============================================================================
// Fetch functions
// =============================================================================

export async function getIndividualExcursion(
  slug: string,
): Promise<IndividualExcursion | null> {
  return await client.fetch(individualExcursionQuery, { slug });
}

export async function getExcursionList(): Promise<ExcursionListItem[]> {
  return await client.fetch(excursionListQuery);
}

export async function getFeaturedExcursions(): Promise<ExcursionListItem[]> {
  return await client.fetch(featuredExcursionsQuery);
}

export async function getExcursionSlugs(): Promise<ExcursionSlug[]> {
  return await client.fetch(excursionSlugsQuery);
}
