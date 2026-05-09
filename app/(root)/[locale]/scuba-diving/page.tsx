import { DivingCTA } from "@/components/DivingSnorkelingPage/DivingCTA/DivingCTA";
import { DivingIntro } from "@/components/DivingSnorkelingPage/DivingIntro/DivingIntro";
import { DivingHero } from "@/components/DivingSnorkelingPage/Hero/DivingHero";
import { WaterExcursionsSection } from "@/components/DivingSnorkelingPage/WaterExcursions/WaterExcursionsSection";
import { WhyBookWithUs } from "@/components/DivingSnorkelingPage/WhyBookWithUs/WhyBookWithUs";
import {
  getDivingSnorkelingPage,
  getDivingSnorkelingPageSeo,
  getDivingExcursions,
  getSnorkelingExcursions,
  type DivingExcursionCard,
} from "@/sanity/queries/DivingSnorkelingPage/DivingSnorkelingPage";
import {
  getLocalized,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getTranslations } from "next-intl/server";
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
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getDivingSnorkelingPageSeo(),
    getDefaultSeo(),
    getDivingSnorkelingPage(),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/diving-snorkeling",
    fallbackTitle: page?.heroHeadline?.[lk],
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

function mapExcursionCard(e: DivingExcursionCard, locale: string) {
  return {
    slug: e.slug.current,
    href: `/diving-snorkeling/${e.slug.current}`,
    title: getLocalized(e.title, locale),
    summary: getLocalized(e.shortSummary, locale),
    image: {
      url: e.heroImage?.url ?? "",
      alt: getLocalized(e.heroImage?.alt, locale) || getLocalized(e.title, locale),
      lqip: e.heroImage?.lqip ?? "",
    },
    price: e.price,
    duration: getLocalized(e.duration, locale),
    badge: e.badge ? getLocalized(e.badge, locale) : null,
    isFeatured: e.isFeatured,
  };
}

export default async function DivingSnorkelingPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }, page, divingExcursions, snorkelingExcursions, t, pageSeo] =
    await Promise.all([
      params,
      getDivingSnorkelingPage(),
      getDivingExcursions(),
      getSnorkelingExcursions(),
      getTranslations("divingSnorkeling"),
      getDivingSnorkelingPageSeo(),
    ]);

  const localeKey = locale as keyof LocalizedField;
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  return (
    <>
      <JsonLd data={jsonLd} />
      <DivingHero
        backgroundImage={page?.heroImage || { url: "", lqip: "" }}
        badge={page?.heroBadge?.[localeKey] || ""}
        headline={page?.heroHeadline?.[localeKey] || ""}
        subheadline={page?.heroSubheadline?.[localeKey] || ""}
        primaryCTA={{
          text: page?.heroPrimaryCTA?.text?.[localeKey] || "",
          href: page?.heroPrimaryCTA?.href || "",
        }}
        secondaryCTA={{
          text: page?.heroSecondaryCTA?.text?.[localeKey] || "",
          href: page?.heroSecondaryCTA?.href || "",
        }}
      />

      <DivingIntro
        tagline={page?.introTagline?.[localeKey]}
        headline={page?.introHeadline?.[localeKey]}
        body={page?.introBody?.[localeKey]}
        image={page?.introImage}
        stats={page?.introStats?.map((stat) => ({
          value: stat.value?.[localeKey],
          label: stat.label?.[localeKey],
        }))}
      />

      <WaterExcursionsSection
        id="diving-excursions"
        heading={t("divingSectionHeading")}
        subheading={t("divingSectionSubheading")}
        iconType="diving"
        variant="white"
        excursions={divingExcursions.map((e) => mapExcursionCard(e, locale))}
        labels={{
          from: t("from"),
          perPerson: t("perPerson"),
          viewDetails: t("viewDetails"),
          noExcursions: t("divingNoExcursions"),
          noExcursionsMessage: t("divingNoExcursionsMessage"),
          featured: t("featured"),
        }}
      />

      <WaterExcursionsSection
        id="snorkeling-excursions"
        heading={t("snorkelingSectionHeading")}
        subheading={t("snorkelingSectionSubheading")}
        iconType="snorkeling"
        variant="sand"
        excursions={snorkelingExcursions.map((e) => mapExcursionCard(e, locale))}
        labels={{
          from: t("from"),
          perPerson: t("perPerson"),
          viewDetails: t("viewDetails"),
          noExcursions: t("noExcursions"),
          noExcursionsMessage: t("noExcursionsMessage"),
          featured: t("featured"),
        }}
      />

      <WhyBookWithUs
        heading={page?.trustHeadline?.[localeKey] || ""}
        pillars={page?.trustPillars?.map((pillar) => ({
          icon: pillar.icon,
          title: pillar.title?.[localeKey],
          description: pillar.description?.[localeKey],
        })) || []}
      />

      <DivingCTA
        headline={page?.ctaHeadline?.[localeKey] || ""}
        whatsappButtonText={page?.ctaButtonText?.[localeKey] || ""}
        whatsappNumber={page?.ctaWhatsappNumber || ""}
        contactButtonText="Contact us"
        contactHref="/contact"
      />
    </>
  );
}
