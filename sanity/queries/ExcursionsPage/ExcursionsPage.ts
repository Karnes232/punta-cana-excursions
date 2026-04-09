import { client } from "@/sanity/lib/client";
import { LocalizedField } from "../GeneralLayout/generalLayoutQuery";

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
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
  ctaHeadline: LocalizedField;
  ctaDescription: LocalizedField;
  ctaWhatsappButtonText: LocalizedField;
  ctaContactButtonText: LocalizedField;
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
    heroHeadline,
    heroSubheadline,
    ctaHeadline,
    ctaDescription,
    ctaWhatsappButtonText,
    ctaContactButtonText,
}`;

export async function getExcursionsPage(): Promise<ExcursionsPage | null> {
  const result = await client.fetch<ExcursionsPage>(excursionsPageQuery);
  return result;
}
