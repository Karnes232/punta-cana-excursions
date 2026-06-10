import { redirect } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { BlogPostHero } from "@/components/IndividualBlogPost/BlogPostHero/BlogPostHero";
import { BlogPostBody } from "@/components/IndividualBlogPost/BlogPostBody/BlogPostBody";
import { BlogPostTranslations } from "@/components/IndividualBlogPost/BlogPostTranslations/BlogPostTranslations";
import {
  getBlogArticle,
  getBlogArticleSeo,
  getBlogArticleTranslations,
  getBlogSitemapEntries,
} from "@/sanity/queries/Blog/Blog";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildSingleLanguageMetadata } from "@/lib/seo/buildMetadata";
import { buildHreflangFromSiblings } from "@/i18n/hreflang";
import type { BlogLocale } from "@/i18n/blogLocales";
import { AlternateSlugProvider } from "@/components/ui/AlternateSlugProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [pageSeo, defaultSeo, article] = await Promise.all([
    getBlogArticleSeo(slug),
    getDefaultSeo(),
    getBlogArticle(slug),
  ]);

  // hreflang: enumerate every language version in this article's translation
  // group (self + siblings), each at its own per-language URL.
  let alternates;
  if (article) {
    const siblings = await getBlogArticleTranslations(
      article.translationGroup,
      slug,
    );
    const versions = [
      { locale: article.language as BlogLocale, slug: article.slug },
      ...siblings.map((s) => ({ locale: s.language as BlogLocale, slug: s.slug })),
    ];
    alternates = buildHreflangFromSiblings(
      versions.map((v) => ({
        locale: v.locale,
        href: { pathname: "/blog/[slug]" as const, params: { slug: v.slug } },
      })),
      "en",
    );
  }

  const featuredImage = article?.featuredImage;
  return buildSingleLanguageMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: (article?.language ?? locale) as BlogLocale,
    href: { pathname: "/blog/[slug]", params: { slug } },
    alternates,
    fallbackTitle: article?.title ?? undefined,
    fallbackDescription: article?.excerpt ?? undefined,
    fallbackImage: featuredImage?.asset?.url
      ? {
          url: featuredImage.asset.url,
          alt: featuredImage.alt ?? undefined,
          width: featuredImage.asset.metadata?.dimensions?.width,
          height: featuredImage.asset.metadata?.dimensions?.height,
        }
      : undefined,
  });
}

export async function generateStaticParams() {
  // Each article is one document in one language with its own slug. Build it at
  // its own locale prefix only (e.g. a French article -> /fr/blog/<slug>), so
  // the URL locale, <html lang>, and hreflang all match the article's language.
  const entries = await getBlogSitemapEntries();
  return entries.map((e) => ({ locale: e.language, slug: e.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [article, pageSeo] = await Promise.all([
    getBlogArticle(slug),
    getBlogArticleSeo(slug),
  ]);

  if (!article) {
    redirect({ href: "/blog", locale });
  }

  // Each article is one language with its own slug — only serve it under its own
  // locale prefix (e.g. a French article only at /fr/blog/<slug>), so the URL
  // locale and <html lang> always match the content and we avoid duplicates.
  if (article!.language !== locale) notFound();

  const jsonLd = pageSeo?.seo?.structuredData;

  const translations = await getBlogArticleTranslations(
    article!.translationGroup,
    slug,
  );

  // Feed the global EN/ES language switcher the correct per-locale slug for this
  // translation group, so toggling lands on the sibling article (not a 404).
  const slugByLocale: Partial<Record<"en" | "es", string>> = {};
  for (const v of [
    { language: article!.language, slug },
    ...translations,
  ]) {
    if (v.language === "en" || v.language === "es") {
      slugByLocale[v.language] = v.slug;
    }
  }

  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const categoryName =
    article!.category?.title?.[lk] ?? article!.category?.title?.en ?? null;

  const labels = isEs
    ? {
        breadcrumb: "Blog",
        minRead: "min de lectura",
        readIn: "Leer en otro idioma",
      }
    : {
        breadcrumb: "Blog",
        minRead: "min read",
        readIn: "Read in another language",
      };

  return (
    <AlternateSlugProvider
      value={{ pathname: "/blog/[slug]", slugByLocale }}
    >
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      <BlogPostHero
        title={article!.title}
        excerpt={article!.excerpt}
        publishedAt={article!.publishedAt}
        readingTime={article!.readingTime}
        language={article!.language}
        categoryName={categoryName}
        featuredImage={article!.featuredImage}
        locale={locale}
        breadcrumbLabel={labels.breadcrumb}
        minReadLabel={labels.minRead}
      />

      {/* Language switcher — shown only when other language versions exist */}
      <div className="max-w-3xl mx-auto px-5 sm:px-8 pt-8">
        <BlogPostTranslations
          currentLanguage={article!.language}
          currentSlug={slug}
          translations={translations}
          label={labels.readIn}
        />
      </div>

      <BlogPostBody body={article!.body} />
    </main>
    </AlternateSlugProvider>
  );
}
