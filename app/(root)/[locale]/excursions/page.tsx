import { ExcursionsBrowseSection } from "@/components/ExcursionsPage/ExcursionsBrowseSection/ExcursionsBrowseSection";
import { ExcursionsHero } from "@/components/ExcursionsPage/Hero/ExcursionsHero";
import { WhatsAppCTAStrip } from "@/components/ExcursionsPage/WhatsAppCTA/WhatsAppCTAStrip";
import { getExcursionCategoryPage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import {
  getExcursionsPage,
  getExcursionsPageSeo,
} from "@/sanity/queries/ExcursionsPage/ExcursionsPage";
import { getExcursionList } from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import {
  getLocalized,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
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
  const [pageSeo, defaultSeo, excursionsPage] = await Promise.all([
    getExcursionsPageSeo(),
    getDefaultSeo(),
    getExcursionsPage(),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/excursions",
    fallbackTitle: excursionsPage?.heroHeadline?.[lk],
    fallbackDescription: excursionsPage?.heroSubheadline?.[lk],
  });
}

export default async function Excursions({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const [
    { locale },
    { category: categoryParam },
    excursionCategories,
    excursionsPage,
    excursionList,
    pageSeo,
  ] = await Promise.all([
    params,
    searchParams,
    getExcursionCategoryPage(),
    getExcursionsPage(),
    getExcursionList(),
    getExcursionsPageSeo(),
  ]);
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const localeKey = locale as keyof LocalizedField;

  // Pre-select category from URL (?category=catamarans). Validate against the
  // category list so an unknown/garbage slug falls back to "all".
  const requestedCategory = Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;
  const initialCategory =
    requestedCategory &&
    excursionCategories.some((c) => c.slug === requestedCategory)
      ? requestedCategory
      : "all";

  const excursions = excursionList.map((exc) => ({
    slug: exc.slug.current,
    title: getLocalized(exc.title, locale),
    summary: getLocalized(exc.shortSummary, locale),
    image: {
      url: exc.heroImage?.asset?.url ?? "",
      alt: getLocalized(exc.heroImage?.alt, locale),
      lqip: exc.heroImage?.asset?.metadata?.lqip ?? "",
    },
    price: exc.price,
    duration: getLocalized(exc.duration, locale),
    category: exc.category?.slug?.current ?? "",
    badge: exc.badge ? getLocalized(exc.badge, locale) : undefined,
    isFeatured: exc.isFeatured,
  }));

  return (
    <>
      <JsonLd data={jsonLd} />
      <ExcursionsHero
        backgroundImage={{
          url: excursionsPage?.heroImage?.asset?.url ?? "",
          alt:
            excursionsPage?.heroHeadline?.[localeKey] ??
            excursionsPage?.heroHeadline?.en ??
            "",
          lqip: excursionsPage?.heroImage?.asset?.metadata?.lqip ?? "",
        }}
        headline={
          excursionsPage?.heroHeadline?.[localeKey] ??
          excursionsPage?.heroHeadline?.en ??
          ""
        }
        subheadline={
          excursionsPage?.heroSubheadline?.[localeKey] ??
          excursionsPage?.heroSubheadline?.en ??
          ""
        }
        totalExcursions={excursionList.length}
      />
      <ExcursionsBrowseSection
        categories={excursionCategories.map((category) => ({
          slug: category.slug,
          title: category.title?.[localeKey] ?? "",
        }))}
        excursions={excursions}
        currencySymbol="$"
        initialCategory={initialCategory}
        labels={{
          filter: {
            all: "All",
            sortBy: "Sort by",
            sortFeatured: "Featured",
            sortPriceLow: "Price low",
            sortPriceHigh: "Price high",
            sortDuration: "Duration",
            showing: "Showing",
            excursion: "Excursion",
            excursions: "Excursions",
          },
          card: {
            from: "From",
            perPerson: "Per person",
            viewAndBook: "View and book",
          },
          empty: {
            title: "No excursions found",
            description: "No excursions found",
          },
        }}
      />
      <WhatsAppCTAStrip
        headline={
          excursionsPage?.ctaHeadline?.[localeKey] ??
          excursionsPage?.ctaHeadline?.en ??
          ""
        }
        description={
          excursionsPage?.ctaDescription?.[localeKey] ??
          excursionsPage?.ctaDescription?.en ??
          ""
        }
        whatsappNumber="1234567890"
        whatsappDefaultMessage="Hello, I have a question about the best way to get to Punta Cana."
        whatsappButtonText={
          excursionsPage?.ctaWhatsappButtonText?.[localeKey] ??
          excursionsPage?.ctaWhatsappButtonText?.en ??
          ""
        }
        contactHref="/contact"
        contactButtonText={
          excursionsPage?.ctaContactButtonText?.[localeKey] ??
          excursionsPage?.ctaContactButtonText?.en ??
          ""
        }
      />
    </>
  );
}
