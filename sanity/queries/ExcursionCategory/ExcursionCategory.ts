import { client } from "@/sanity/lib/client";
import { LocalizedField } from "../GeneralLayout/generalLayoutQuery";


export interface ExcursionCategoryPage {
    _id: string;
    slug: string;
    title: LocalizedField;
}

export const excursionCategoryPageQuery = `*[_type == "excursionCategory"] {
    _id,
    "slug": slug.current,
    title,
}`;

export async function getExcursionCategoryPage(): Promise<ExcursionCategoryPage[]> {
    const result = await client.fetch<ExcursionCategoryPage[]>(
        excursionCategoryPageQuery,
    );
    return Array.isArray(result) ? result : [];
}

export interface ExcursionCategoryHomePage {
    _id: string;
    slug: string;
    title: LocalizedField;
    image: {
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
}

export const excursionCategoryHomePageQuery = `*[_type == "excursionCategory"][0...6] {
    _id,
    "slug": slug.current,
    title,
    image {
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
    }
}`;

export async function getExcursionCategoryHomePage(): Promise<ExcursionCategoryHomePage[]> {
    const result = await client.fetch<ExcursionCategoryHomePage[]>(
        excursionCategoryHomePageQuery,
    );
    return Array.isArray(result) ? result : [];
}