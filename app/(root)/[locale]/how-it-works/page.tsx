import type { Metadata } from "next";
import {
  getHowItWorksPage,
  getHowItWorksPageSeo,
} from "@/sanity/queries/HowItWorksPage/HowItWorksPage";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import {
  getLocalized,
  getLocalizedPortableText,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { HowItWorksHero } from "@/components/HowItWorksPage/HowItWorksHero";
import { HowItWorksIntro } from "@/components/HowItWorksPage/HowItWorksIntro";
import { HowBookingWorks } from "@/components/HomePage/HowBookingWorks/HowBookingWorks";
import { FaqPreview } from "@/components/HomePage/FaqPreview/FaqPreview";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [pageSeo, defaultSeo, page] = await Promise.all([
    getHowItWorksPageSeo(),
    getDefaultSeo(),
    getHowItWorksPage(),
  ]);
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: "/how-it-works",
    fallbackTitle: getLocalized(page?.heroHeadline, locale),
    fallbackDescription: getLocalized(page?.heroSubheadline, locale),
  });
}

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, page, pageSeo] = await Promise.all([
    params,
    getHowItWorksPage(),
    getHowItWorksPageSeo(),
  ]);

  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const steps = (page?.steps ?? []).map((s) => ({
    stepNumber: s.stepNumber,
    icon: s.icon,
    title: getLocalized(s.title, locale),
    description: getLocalized(s.description, locale),
  }));

  const faqs = (page?.faqItems ?? []).map((f) => ({
    question: getLocalized(f.question, locale),
    answer: getLocalized(f.answer, locale),
  }));

  return (
    <main className="min-h-screen bg-white">
      <JsonLd data={jsonLd} />

      <HowItWorksHero
        eyebrow={getLocalized(page?.heroEyebrow, locale)}
        headline={getLocalized(page?.heroHeadline, locale)}
        subheadline={getLocalized(page?.heroSubheadline, locale)}
        backgroundImage={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
                alt: getLocalized(page.heroImage.alt, locale),
              }
            : undefined
        }
      />

      <HowItWorksIntro
        eyebrow={getLocalized(page?.introEyebrow, locale)}
        headline={getLocalized(page?.introHeadline, locale)}
        body={getLocalizedPortableText(page?.introBody, locale)}
      />

      {steps.length > 0 && (
        <HowBookingWorks
          eyebrow={getLocalized(page?.stepsEyebrow, locale)}
          heading={getLocalized(page?.stepsHeading, locale)}
          steps={steps}
        />
      )}

      {faqs.length > 0 && (
        <FaqPreview
          eyebrow={getLocalized(page?.faqEyebrow, locale) || undefined}
          heading={getLocalized(page?.faqHeading, locale)}
          subheading={getLocalized(page?.faqSubheading, locale) || undefined}
          faqs={faqs}
        />
      )}

      {page?.ctaHeadline && (
        <CtaBanner
          eyebrow={getLocalized(page?.ctaEyebrow, locale) || undefined}
          headline={getLocalized(page?.ctaHeadline, locale)}
          subheadline={getLocalized(page?.ctaSubheadline, locale) || undefined}
          primaryCtaText={getLocalized(page?.ctaButtonText, locale)}
          primaryCtaHref={page?.ctaButtonHref || "/excursions"}
          secondaryCtaText={
            getLocalized(page?.ctaSecondaryButtonText, locale) || undefined
          }
          secondaryCtaHref={page?.ctaSecondaryButtonHref || "/contact"}
        />
      )}
    </main>
  );
}
