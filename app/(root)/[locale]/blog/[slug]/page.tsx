import { redirect } from "@/i18n/navigation";
import { BlogPostHero } from "@/components/IndividualBlogPost/BlogPostHero/BlogPostHero";
import { BlogPostBody } from "@/components/IndividualBlogPost/BlogPostBody/BlogPostBody";
import { BlogPostTranslations } from "@/components/IndividualBlogPost/BlogPostTranslations/BlogPostTranslations";
import {
  getBlogArticle,
  getBlogArticleSeo,
  getBlogArticleTranslations,
  getBlogArticleSlugs,
} from "@/sanity/queries/Blog/Blog";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildSingleLanguageMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";

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
  const featuredImage = article?.featuredImage;
  return buildSingleLanguageMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: `/blog/${slug}`,
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
  const slugs = await getBlogArticleSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const [article, pageSeo] = await Promise.all([
    getBlogArticle(slug),
    getBlogArticleSeo(slug),
  ]);

  if (!article) {
    redirect({ href: "/blog", locale });
  }

  const jsonLd = pageSeo?.seo?.structuredData;

  const translations = await getBlogArticleTranslations(
    article!.translationGroup,
    slug,
  );

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
  );
}
