import { Suspense } from "react";
import { BlogHero } from "@/components/BlogPage/BlogHero/BlogHero";
import { BlogFilters } from "@/components/BlogPage/BlogFilters/BlogFilters";
import { BlogGrid } from "@/components/BlogPage/BlogGrid/BlogGrid";
import {
  getBlogPage,
  getBlogArticles,
  getBlogCategories,
} from "@/sanity/queries/Blog/Blog";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";

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

  const [blogData, articles, rawCategories] = await Promise.all([
    getBlogPage(),
    getBlogArticles(activeLang, activeCategory),
    getBlogCategories(),
  ]);

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
