import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/lib/client";

// =============================================================================
// Types
// =============================================================================

export interface LocalizedField {
  en?: string;
  es?: string;
}

/** Matches Sanity `localizedStringArray` — per-locale lists of strings */
export interface LocalizedStringArray {
  en?: string[];
  es?: string[];
}

/** Matches Sanity `localizedBlockContent` — per-locale Portable Text */
export interface LocalizedBlockContent {
  en?: PortableTextBlock[];
  es?: PortableTextBlock[];
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface NavLink {
  label: LocalizedField;
  href: string;
  isExternal?: boolean;
}

export interface FooterQuickLink {
  label: LocalizedField;
  href: string;
}

export interface Logo {
  asset: {
    _id: string;
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
    };
  };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface GeneralLayout {
  logo: {
    asset: {
      _id: string;
      url: string;
      metadata: {
        dimensions: {
          width: number;
          height: number;
        };
      };
    };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  logoAlt?: {
    asset: {
      _id: string;
      url: string;
    };
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  companyName: LocalizedField;
  tagline: LocalizedField;
  email: string;
  phone: string;
  serviceArea: LocalizedField;
  contactCtaText: LocalizedField;
  responseTime: LocalizedField;
  socialLinks?: SocialLink[];
  navLinks: NavLink[];
  navCtaButton?: {
    label: LocalizedField;
    href: string;
  };
  footerDescription: LocalizedField;
  footerQuickLinks?: FooterQuickLink[];
}

// =============================================================================
// Queries
// =============================================================================

export const generalLayoutQuery = `*[_type == "generalLayout"][0] {
  logo {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    hotspot,
    crop
  },
  logoAlt {
    asset-> {
      _id,
      url
    },
    hotspot,
    crop
  },
  companyName,
  tagline,
  email,
  phone,
  serviceArea,
  contactCtaText,
  responseTime,
  socialLinks[] {
    platform,
    url
  },
  navLinks[] {
    label,
    href,
    isExternal
  },
  navCtaButton {
    label,
    href
  },
  footerDescription,
  footerQuickLinks[] {
    label,
    href
  }
}`;

export const logoQuery = `*[_type == "generalLayout"][0] {
  logo {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    hotspot,
    crop
  }
}`;

// =============================================================================
// Fetch functions
// =============================================================================

export async function getGeneralLayout(): Promise<GeneralLayout | null> {
  return await client.fetch(generalLayoutQuery);
}

export async function getLogo(): Promise<Pick<GeneralLayout, "logo"> | null> {
  return await client.fetch(logoQuery);
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Resolves a localized field to the correct language.
 * Falls back to English if the requested locale isn't available.
 *
 * Usage:
 *   const name = getLocalized(layout.companyName, "es");
 */
export function getLocalized(
  field: LocalizedField | null | undefined,
  locale: string,
): string {
  if (!field) return "";
  return (locale === "es" ? field.es : field.en) || field.en || "";
}

/**
 * Resolves a localized string array (e.g. highlights) for the active locale.
 * Falls back to English when the requested list is missing or empty.
 */
export function getLocalizedStringArray(
  field: LocalizedStringArray | null | undefined,
  locale: string,
): string[] {
  if (!field) return [];
  const primary = locale === "es" ? field.es : field.en;
  if (primary && primary.length > 0) return primary;
  return field.en ?? [];
}

/**
 * Resolves localized Portable Text (e.g. full description) for the active locale.
 * Falls back to English when the requested blocks are missing or empty.
 */
export function getLocalizedPortableText(
  field: LocalizedBlockContent | null | undefined,
  locale: string,
): PortableTextBlock[] {
  if (!field) return [];
  const primary = locale === "es" ? field.es : field.en;
  if (primary && primary.length > 0) return primary;
  return field.en ?? [];
}
