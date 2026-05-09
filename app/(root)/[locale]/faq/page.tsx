import { FaqHero } from "@/components/FaqPage/FaqHero/FaqHero";
import { FaqCategories } from "@/components/FaqPage/FaqCategories/FaqCategories";
import type { FaqCategoryData } from "@/components/FaqPage/FaqCategories/FaqCategories";
import { getFaqPage, getFaqPageSeo } from "@/sanity/queries/FaqPage/FaqPage";
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
  const [pageSeo, defaultSeo] = await Promise.all([
    getFaqPageSeo(),
    getDefaultSeo(),
  ]);
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/faq",
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
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const lk = locale as keyof LocalizedField;
  const isEs = locale === "es";

  const categories: FaqCategoryData[] =
    page?.categories?.map((cat) => ({
      _key: cat._key,
      categoryName: cat.categoryName?.[lk] ?? "",
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
        headline={page?.heroHeadline?.[lk] ?? (isEs ? "Preguntas Frecuentes" : "Frequently Asked Questions")}
        subheadline={page?.heroSubheadline?.[lk] ?? ""}
        backgroundImage={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
              }
            : undefined
        }
      />

      <FaqCategories
        categories={categories}
        allLabel={isEs ? "Todas" : "All"}
      />
    </main>
  );
}
