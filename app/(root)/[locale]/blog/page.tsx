import { Suspense } from "react";
import { BlogHero } from "@/components/BlogPage/BlogHero/BlogHero";
import { BlogFilters } from "@/components/BlogPage/BlogFilters/BlogFilters";
import { BlogGrid } from "@/components/BlogPage/BlogGrid/BlogGrid";
import {
  getBlogPage,
  getBlogPageSeo,
  getBlogArticles,
  getBlogCategories,
} from "@/sanity/queries/Blog/Blog";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, blogData] = await Promise.all([
    getBlogPageSeo(),
    getDefaultSeo(),
    getBlogPage(),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/blog",
    fallbackTitle: blogData?.heroHeadline?.[lk],
    fallbackDescription: blogData?.heroSubheadline?.[lk],
  });
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ lang?: string; category?: string }>;
}) {
  const [{ locale }, { lang, category }] = await Promise.all([params, searchParams]);

  const defaultLang = locale === "es" ? "es" : "en";
  const activeLang = lang ?? defaultLang;
  const activeCategory = category ?? undefined;
  const isEs = locale === "es";
  const lk = locale as keyof LocalizedField;

  const [blogData, articles, rawCategories, pageSeo] = await Promise.all([
    getBlogPage(),
    getBlogArticles(activeLang, activeCategory),
    getBlogCategories(),
    getBlogPageSeo(),
  ]);
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const categoryOptions = (rawCategories ?? []).map((cat) => ({
    slug: cat.slug,
    label: cat.title?.[lk] ?? cat.title?.en ?? cat.slug,
  }));

  const labels = isEs
    ? {
        empty: "No se encontraron artículos.",
        readMore: "Leer más",
        minRead: "min de lectura",
        allCategories: "Todas las categorías",
        languageLabel: "Idioma",
        categoryLabel: "Categoría",
      }
    : {
        empty: "No articles found.",
        readMore: "Read more",
        minRead: "min read",
        allCategories: "All categories",
        languageLabel: "Language",
        categoryLabel: "Category",
      };

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      <BlogHero
        headline={blogData?.heroHeadline?.[lk] ?? "Blog"}
        subheadline={blogData?.heroSubheadline?.[lk] ?? ""}
      />

      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 md:py-20">
        <div className="mb-10">
          <Suspense fallback={null}>
            <BlogFilters
              defaultLanguage={defaultLang}
              categories={categoryOptions}
              allCategoriesLabel={labels.allCategories}
              languageLabel={labels.languageLabel}
              categoryLabel={labels.categoryLabel}
            />
          </Suspense>
        </div>

        <BlogGrid
          articles={articles}
          locale={locale}
          emptyMessage={labels.empty}
          readMoreLabel={labels.readMore}
          minReadLabel={labels.minRead}
        />
      </section>
    </main>
  );
}
