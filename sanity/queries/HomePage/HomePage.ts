import { client } from "@/sanity/lib/client";
import {
  LocalizedField,
  LocalizedBlockContent,
} from "../GeneralLayout/generalLayoutQuery";

export interface BookingStep {
  stepNumber: number;
  icon: string;
  title: {
    en: string;
    es: string;
  };
  description: {
    en: string;
    es: string;
  };
}

export interface Review {
  name: string;
  country?: string;
  text: {
    en: string;
    es: string;
  };
  rating: number;
  excursionTitle: string;
}

export interface FaqItem {
  question: {
    en: string;
    es: string;
  };
  answer: {
    en: string;
    es: string;
  };
}

export interface HomePage {
  _id: string;
  _type: "homePage";
  //Hero Section
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
  heroImageAlt: LocalizedField;
  heroEyebrow: LocalizedField;
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  heroPrimaryCta: {
    text: LocalizedField;
    href: string;
  };
  heroSecondaryCta: {
    text: LocalizedField;
    href: string;
  };
  //Brand Intro Section
  brandIntroTagline: LocalizedField;
  brandIntroHeading: LocalizedField;
  brandIntroBody: LocalizedBlockContent;
  brandIntroImage: {
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
  brandIntroImageAlt: LocalizedField;
  //Featured Excursions Section
  featuredEyebrow: LocalizedField;
  featuredHeading: LocalizedField;
  featuredSubheading: LocalizedField;
  featuredViewAllText: LocalizedField;
  //Excursion Categories Section
  categoriesEyebrow: LocalizedField;
  categoriesHeading: LocalizedField;
  categoriesSubheading: LocalizedField;
  divingCardTitle: LocalizedField;
  divingCardDescription: LocalizedField;
  divingCardImage: {
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
  } | null;
  //Why Choose Us Section
  whyChooseUsEyebrow: LocalizedField;
  whyChooseUsHeading: LocalizedField;
  whyChooseUsSubheading: LocalizedField;
  trustPillars: {
    icon: string;
    title: LocalizedField;
    description: LocalizedField;
  }[];

  //How Booking Works Section
  howBookingWorksEyebrow: LocalizedField;
  howBookingWorksHeading: LocalizedField;
  howBookingWorksSubheading: LocalizedField;
  bookingSteps: BookingStep[];
  //Reviews Section
  reviewsEyebrow: LocalizedField;
  reviewsHeading: LocalizedField;
  reviewsSubheading: LocalizedField;
  reviews: Review[];
  //FAQ Preview Section
  faqPreviewEyebrow: LocalizedField;
  faqPreviewHeading: LocalizedField;
  faqPreviewSubheading: LocalizedField;
  faqPreviewItems: FaqItem[];
  faqPreviewCtaText: LocalizedField;
  //CTA Banner Section
  ctaBannerEyebrow: LocalizedField;
  ctaBannerHeadline: LocalizedField;
  ctaBannerSubheadline: LocalizedField;
  ctaBannerButtonText: LocalizedField;
  ctaBannerButtonHref: string;
  ctaBannerSecondaryButtonText: LocalizedField;
  ctaBannerSecondaryButtonHref: string;
}

export const homePageQuery = `*[_type == "homePage"][0] {
    _id,
    _type,
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
    heroImageAlt,
    heroEyebrow,
    heroHeadline,
    heroSubheadline,
    heroPrimaryCta {
        text,
        href
    },
    heroSecondaryCta {
        text,
        href
    },
    brandIntroTagline,
    brandIntroHeading,
    brandIntroBody,
    brandIntroImage {
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
    brandIntroImageAlt,
    featuredEyebrow,
    featuredHeading,
    featuredSubheading,
    featuredViewAllText,
    categoriesEyebrow,
    categoriesHeading,
    categoriesSubheading,
    divingCardTitle,
    divingCardDescription,
    divingCardImage {
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
    whyChooseUsEyebrow,
    whyChooseUsHeading,
    whyChooseUsSubheading,
    trustPillars[] {
        icon,
        title,
        description
    },
    howBookingWorksEyebrow,
    howBookingWorksHeading,
    howBookingWorksSubheading,
    bookingSteps[] {
        stepNumber,
        icon,
        title,
        description
    },
    reviewsEyebrow,
    reviewsHeading,
    reviewsSubheading,
    reviews[] {
        name,
        country,
        text,
        rating,
        excursionTitle
    },
    faqPreviewEyebrow,
    faqPreviewHeading,
    faqPreviewSubheading,
    faqPreviewItems[] {
        question,
        answer
    },
    faqPreviewCtaText,
    ctaBannerEyebrow,
    ctaBannerHeadline,
    ctaBannerSubheadline,
    ctaBannerButtonText,
    ctaBannerButtonHref,
    ctaBannerSecondaryButtonText,
    ctaBannerSecondaryButtonHref
}   
`;

export async function getHomePage(): Promise<HomePage | null> {
  return await client.fetch(homePageQuery);
}

// =============================================================================
// SEO
// =============================================================================

import { seoProjection, type SeoData } from "../SEO/seoProjection";

export const homePageSeoQuery = `*[_type == "homePage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getHomePageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(homePageSeoQuery);
}
