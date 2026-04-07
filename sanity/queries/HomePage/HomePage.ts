import { client } from "@/sanity/lib/client";
import { LocalizedField } from "../GeneralLayout/generalLayoutQuery";

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
  brandIntroBody: LocalizedField;
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
  featuredHeading: LocalizedField;
  featuredSubheading: LocalizedField;
  featuredViewAllText: LocalizedField;
  //Excursion Categories Section
  categoriesHeading: LocalizedField;
  categoriesSubheading: LocalizedField;
  //Why Choose Us Section
  whyChooseUsHeading: LocalizedField;
  whyChooseUsSubheading: LocalizedField;
  trustPillars: {
    icon: string;
    title: LocalizedField;
    description: LocalizedField;
  }[];

  //How Booking Works Section
  howBookingWorksHeading: LocalizedField;
  howBookingWorksSubheading: LocalizedField;
  bookingSteps: BookingStep[];
  //Reviews Section
  reviewsHeading: LocalizedField;
  reviewsSubheading: LocalizedField;
  reviews: Review[];
  //FAQ Preview Section
  faqPreviewHeading: LocalizedField;
  faqPreviewSubheading: LocalizedField;
  faqPreviewItems: FaqItem[];
  faqPreviewCtaText: LocalizedField;
  //CTA Banner Section
  ctaBannerHeadline: LocalizedField;
  ctaBannerSubheadline: LocalizedField;
  ctaBannerButtonText: LocalizedField;
  ctaBannerButtonHref: string;

  ctaBannerWhatsappLabel: LocalizedField;
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
    featuredHeading,
    featuredSubheading,
    featuredViewAllText,
    categoriesHeading,
    categoriesSubheading,
    whyChooseUsHeading,
    whyChooseUsSubheading,
    trustPillars[] {
        icon,
        title,
        description
    },
    howBookingWorksHeading,
    howBookingWorksSubheading,
    bookingSteps[] {
        stepNumber,
        icon,
        title,
        description
    },
    reviewsHeading,
    reviewsSubheading,
    reviews[] {
        name,
        country,
        text,
        rating,
        excursionTitle
    },
    faqPreviewHeading,
    faqPreviewSubheading,
    faqPreviewItems[] {
        question,
        answer
    },
    faqPreviewCtaText,
    ctaBannerHeadline,
    ctaBannerSubheadline,
    ctaBannerButtonText,
    ctaBannerButtonHref,
    ctaBannerWhatsappLabel
}   
`;

export async function getHomePage(): Promise<HomePage | null> {
  return await client.fetch(homePageQuery);
}
