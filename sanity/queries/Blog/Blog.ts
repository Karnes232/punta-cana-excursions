import { client } from "@/sanity/lib/client";
import type { LocalizedField } from "../GeneralLayout/generalLayoutQuery";
import type { PortableTextBlock } from "@portabletext/types";

// =============================================================================
// Types
// =============================================================================

export interface BlogPageData {
  heroHeadline: LocalizedField;
  heroSubheadline: LocalizedField;
}

export interface BlogCategoryRef {
  _id: string;
  slug: string;
  title: LocalizedField;
}

export interface BlogArticleCard {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  readingTime: number;
  language: string;
  translationGroup: string;
  category: BlogCategoryRef | null;
  featuredImage: {
    asset: { url: string; metadata: { lqip?: string; dimensions: { width: number; height: number } } };
    alt: string | null;
  } | null;
}

export interface BlogArticleFull extends BlogArticleCard {
  body: PortableTextBlock[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: { asset: { url: string } } | null;
}

export interface BlogTranslation {
  _id: string;
  language: string;
  slug: string;
  title: string;
}

export interface BlogSlug {
  slug: string;
}

export interface BlogCategoryItem {
  _id: string;
  slug: string;
  title: LocalizedField;
  sortOrder: number;
}

// =============================================================================
// Queries
// =============================================================================

const blogPageQuery = /* groq */ `*[_type == "blogPage"][0] {
  heroHeadline,
  heroSubheadline
}`;

const featuredImageFragment = /* groq */ `featuredImage {
  asset->{ url, metadata { lqip, dimensions { width, height } } },
  alt
}`;

const categoryFragment = /* groq */ `category->{ _id, "slug": slug.current, title }`;

const cardFragment = /* groq */ `
  _id, title, "slug": slug.current, excerpt, publishedAt,
  readingTime, language, translationGroup,
  ${categoryFragment},
  ${featuredImageFragment}
`;

function buildArticlesQuery(language?: string, category?: string) {
  const filters = [`_type == "blogArticle"`];
  if (language) filters.push(`language == $language`);
  if (category) filters.push(`category->slug.current == $category`);
  return /* groq */ `*[${filters.join(" && ")}] | order(publishedAt desc)[0...24] { ${cardFragment} }`;
}

const blogArticleQuery = /* groq */ `*[_type == "blogArticle" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, excerpt, publishedAt,
  readingTime, language, translationGroup,
  body,
  ${categoryFragment},
  ${featuredImageFragment},
  seoTitle, seoDescription,
  ogImage { asset->{ url } }
}`;

const translationsQuery = /* groq */ `*[
  _type == "blogArticle" &&
  translationGroup == $group &&
  slug.current != $slug
] {
  _id, language, "slug": slug.current, title
}`;

const slugsQuery = /* groq */ `*[_type == "blogArticle"] { "slug": slug.current }`;

const categoriesQuery = /* groq */ `*[_type == "blogCategory"] | order(sortOrder asc) {
  _id, "slug": slug.current, title, sortOrder
}`;

// =============================================================================
// Fetch functions
// =============================================================================

export async function getBlogPage(): Promise<BlogPageData | null> {
  return client.fetch<BlogPageData>(blogPageQuery);
}

export async function getBlogArticles(language?: string, category?: string): Promise<BlogArticleCard[]> {
  const query = buildArticlesQuery(language, category);
  const params: Record<string, string> = {};
  if (language) params.language = language;
  if (category) params.category = category;
  return client.fetch<BlogArticleCard[]>(query, params);
}

export async function getBlogCategories(): Promise<BlogCategoryItem[]> {
  return client.fetch<BlogCategoryItem[]>(categoriesQuery);
}

export async function getBlogArticle(slug: string): Promise<BlogArticleFull | null> {
  return client.fetch<BlogArticleFull>(blogArticleQuery, { slug });
}

export async function getBlogArticleTranslations(
  group: string,
  currentSlug: string,
): Promise<BlogTranslation[]> {
  return client.fetch<BlogTranslation[]>(translationsQuery, {
    group,
    slug: currentSlug,
  });
}

export async function getBlogArticleSlugs(): Promise<BlogSlug[]> {
  return client.fetch<BlogSlug[]>(slugsQuery);
}

// =============================================================================
// SEO
// =============================================================================

import {
  seoProjection,
  seoSingleLanguageProjection,
  type SeoData,
  type SeoSingleLanguageData,
} from "../SEO/seoProjection";

export const blogPageSeoQuery = `*[_type == "blogPage"][0]{
  "seo": seo { ${seoProjection} }
}`;

export async function getBlogPageSeo(): Promise<{ seo: SeoData | null } | null> {
  return client.fetch(blogPageSeoQuery);
}

export const blogArticleSeoQuery = `*[_type == "blogArticle" && slug.current == $slug][0]{
  "seo": seo { ${seoSingleLanguageProjection} }
}`;

export async function getBlogArticleSeo(
  slug: string,
): Promise<{ seo: SeoSingleLanguageData | null } | null> {
  return client.fetch(blogArticleSeoQuery, { slug });
}
