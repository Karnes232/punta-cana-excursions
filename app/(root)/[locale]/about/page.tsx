import { AboutCTA } from "@/components/AboutPage/AboutCTA/AboutCTA";
import { AboutHero } from "@/components/AboutPage/AboutHero/AboutHero";
import { ByTheNumbers } from "@/components/AboutPage/ByTheNumbers/ByTheNumbers";
import { OurStory } from "@/components/AboutPage/OurStory/OurStory";
import { OurValues } from "@/components/AboutPage/OurValues/OurValues";
import { WhatWeBelieve } from "@/components/AboutPage/WhatWeBelieve/WhatWeBelieve";
import { WhereWeOperate } from "@/components/AboutPage/WhereWeOperate/WhereWeOperate";
import { getAboutPage, getAboutPageSeo } from "@/sanity/queries/AboutPage/AboutPage";
import {
  getLocalizedPortableText,
  type LocalizedField,
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
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getAboutPageSeo(),
    getDefaultSeo(),
    getAboutPage(),
  ]);
  const lk = locale as keyof LocalizedField;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    href: "/about",
    fallbackTitle: page?.heroHeadline?.[lk],
    fallbackDescription: page?.heroSubheadline?.[lk],
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page, pageSeo] = await Promise.all([
    params,
    getAboutPage(),
    getAboutPageSeo(),
  ]);

  const lk = locale as keyof LocalizedField;
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  return (
    <>
      <JsonLd data={jsonLd} />
      <AboutHero
        backgroundImage={page?.heroImage ?? null}
        badge={page?.heroBadge?.[lk] ?? ""}
        headline={page?.heroHeadline?.[lk] ?? ""}
        subheadline={page?.heroSubheadline?.[lk] ?? ""}
      />

      <OurStory
        tagline={page?.storyTagline?.[lk] ?? ""}
        headline={page?.storyHeadline?.[lk] ?? ""}
        body={getLocalizedPortableText(page?.storyBody, locale)}
        image={page?.storyImage ?? null}
        foundedYear={page?.foundedYear ?? 0}
      />

      <WhatWeBelieve
        eyebrow={page?.beliefsEyebrow?.[lk] ?? ""}
        headline={page?.beliefsHeadline?.[lk] ?? ""}
        body={getLocalizedPortableText(page?.beliefsBody, locale)}
        beliefs={
          page?.beliefs?.map((b) => ({
            headline: b.headline?.[lk] ?? "",
            body: getLocalizedPortableText(b.body, locale),
          })) ?? []
        }
      />

      <ByTheNumbers
        headline={page?.statsHeadline?.[lk] ?? ""}
        stats={
          page?.stats?.map((s) => ({
            value: s.value?.[lk] ?? "",
            label: s.label?.[lk] ?? "",
          })) ?? []
        }
      />

      <OurValues
        eyebrow={page?.valuesEyebrow?.[lk] ?? ""}
        headline={page?.valuesHeadline?.[lk] ?? ""}
        subheading={getLocalizedPortableText(page?.valuesSubheading, locale)}
        values={
          page?.values?.map((v) => ({
            icon: v.icon,
            title: v.title?.[lk] ?? "",
            description: v.description?.[lk] ?? "",
          })) ?? []
        }
      />

      <WhereWeOperate
        eyebrow={page?.operateEyebrow?.[lk] ?? ""}
        headline={page?.operateHeadline?.[lk] ?? ""}
        body={getLocalizedPortableText(page?.operateBody, locale)}
      />

      <AboutCTA
        eyebrow={page?.ctaEyebrow?.[lk] ?? ""}
        headline={page?.ctaHeadline?.[lk] ?? ""}
        subheadline={page?.ctaSubheadline?.[lk] ?? ""}
        primaryButtonText={page?.ctaPrimaryButtonText?.[lk] ?? ""}
        primaryButtonHref={page?.ctaPrimaryButtonHref || "/contact"}
        secondaryButtonText={page?.ctaSecondaryButtonText?.[lk] ?? ""}
        secondaryButtonHref={page?.ctaSecondaryButtonHref || "/excursions"}
      />
    </>
  );
}
