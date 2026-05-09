import type { Metadata } from "next";
import {
  getHowItWorksPage,
  getHowItWorksPageSeo,
} from "@/sanity/queries/HowItWorksPage/HowItWorksPage";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import {
  getGeneralLayout,
  getLocalized,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { HowItWorksHero } from "@/components/HowItWorksPage/HowItWorksHero";
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
  const [{ locale }, page, pageSeo, layout] = await Promise.all([
    params,
    getHowItWorksPage(),
    getHowItWorksPageSeo(),
    getGeneralLayout(),
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
        headline={getLocalized(page?.heroHeadline, locale)}
        subheadline={getLocalized(page?.heroSubheadline, locale)}
        backgroundImage={
          page?.heroImage?.asset?.url
            ? {
                url: page.heroImage.asset.url,
                lqip: page.heroImage.asset.metadata?.lqip,
              }
            : undefined
        }
      />

      {steps.length > 0 && (
        <HowBookingWorks
          heading={getLocalized(page?.stepsHeading, locale)}
          subheading={getLocalized(page?.stepsSubheading, locale) || undefined}
          steps={steps}
        />
      )}

      {faqs.length > 0 && (
        <FaqPreview
          heading={getLocalized(page?.faqHeading, locale)}
          subheading={getLocalized(page?.faqSubheading, locale) || undefined}
          faqs={faqs}
        />
      )}

      {page?.ctaHeadline && (
        <CtaBanner
          headline={getLocalized(page?.ctaHeadline, locale)}
          subheadline={getLocalized(page?.ctaSubheadline, locale) || undefined}
          primaryCtaText={getLocalized(page?.ctaButtonText, locale)}
          primaryCtaHref={page?.ctaButtonHref || "/excursions"}
          whatsappNumber={layout?.phone || ""}
          whatsappLabel={
            getLocalized(page?.ctaWhatsappLabel, locale) || undefined
          }
        />
      )}
    </main>
  );
}
