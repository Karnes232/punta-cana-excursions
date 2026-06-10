import { FaqHero } from "@/components/FaqPage/FaqHero/FaqHero";
import { FaqCategories } from "@/components/FaqPage/FaqCategories/FaqCategories";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import type { FaqCategoryData } from "@/components/FaqPage/FaqCategories/FaqCategories";
import { getFaqPage, getFaqPageSeo } from "@/sanity/queries/FaqPage/FaqPage";
import type { LocalizedField } from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { assertSiteLocale } from "@/i18n/siteLocale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo] = await Promise.all([
    getFaqPageSeo(),
    getDefaultSeo(),
  ]);
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/faq",
  });
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page, pageSeo] = await Promise.all([
    params,
    getFaqPage(),
    getFaqPageSeo(),
  ]);

  assertSiteLocale(locale);

  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const categories: FaqCategoryData[] =
    page?.categories?.map((cat) => ({
      _key: cat._key,
      eyebrow: cat.eyebrow?.[lk] ?? "",
      categoryName: cat.categoryName?.[lk] ?? "",
      subheading: cat.subheading?.[lk] ?? "",
      icon: cat.icon ?? null,
      items: (cat.items ?? []).map((item) => ({
        _key: item._key,
        question: item.question?.[lk] ?? "",
        answer: item.answer?.[lk] ?? "",
      })),
    })) ?? [];

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />
      <FaqHero
        eyebrow={page?.heroEyebrow?.[lk] ?? (isEs ? "¿Tienes Preguntas?" : "Got Questions?")}
        headline={page?.heroHeadline?.[lk] ?? (isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions")}
        subheadline={page?.heroSubheadline?.[lk] ?? ""}
        backgroundImage={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
                alt: page.heroImage.alt?.[lk],
              }
            : undefined
        }
      />

      <FaqCategories
        categories={categories}
        allLabel={isEs ? "Todas" : "All"}
      />

      {page?.ctaHeadline?.[lk] && (
        <CtaBanner
          eyebrow={page?.ctaEyebrow?.[lk] || undefined}
          headline={page?.ctaHeadline?.[lk] ?? ""}
          subheadline={page?.ctaSubheadline?.[lk] || undefined}
          primaryCtaText={page?.ctaPrimaryButtonText?.[lk] ?? ""}
          primaryCtaHref={page?.ctaPrimaryButtonHref || "/contact"}
          secondaryCtaText={page?.ctaSecondaryButtonText?.[lk] || undefined}
          secondaryCtaHref={page?.ctaSecondaryButtonHref || "/excursions"}
        />
      )}
    </main>
  );
}
