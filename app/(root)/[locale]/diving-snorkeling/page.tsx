import { DivingCTA } from "@/components/DivingSnorkelingPage/DivingCTA/DivingCTA";
import { DivingIntro } from "@/components/DivingSnorkelingPage/DivingIntro/DivingIntro";
import { DivingHero } from "@/components/DivingSnorkelingPage/Hero/DivingHero";
import { WaterExcursionsSection } from "@/components/DivingSnorkelingPage/WaterExcursions/WaterExcursionsSection";
import { WhyBookWithUs } from "@/components/DivingSnorkelingPage/WhyBookWithUs/WhyBookWithUs";
import { getDivingSnorkelingPage } from "@/sanity/queries/DivingSnorkelingPage/DivingSnorkelingPage";
import {
  getLocalized,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getTranslations } from "next-intl/server";

export default async function DivingSnorkelingPage({
  params,
}: {
  params: { locale: string };
}) {
  const [{ locale }, divingSnorkelingPage] = await Promise.all([
    params,
    getDivingSnorkelingPage(),
  ]);

  const localeKey = locale as keyof LocalizedField;
  const t = await getTranslations("divingSnorkeling");
  console.log(divingSnorkelingPage);

  return (
    <>
      <DivingHero
        backgroundImage={divingSnorkelingPage?.page.heroImage}
        badge={divingSnorkelingPage?.page?.heroBadge?.[localeKey]}
        headline={divingSnorkelingPage?.page?.heroHeadline?.[localeKey]}
        subheadline={divingSnorkelingPage?.page?.heroSubheadline?.[localeKey]}
        primaryCTA={{
          text: divingSnorkelingPage?.page?.heroPrimaryCTA?.text?.[localeKey],
          href: divingSnorkelingPage?.page?.heroPrimaryCTA?.href,
        }}
        secondaryCTA={{
          text: divingSnorkelingPage?.page?.heroSecondaryCTA?.text?.[localeKey],
          href: divingSnorkelingPage?.page?.heroSecondaryCTA?.href,
        }}
      />
      <DivingIntro
        tagline={divingSnorkelingPage?.page?.introTagline?.[localeKey]}
        headline={divingSnorkelingPage?.page?.introHeadline?.[localeKey]}
        body={divingSnorkelingPage?.page?.introBody?.[localeKey]}
        image={divingSnorkelingPage?.page?.introImage}
        stats={divingSnorkelingPage?.page?.introStats?.map((stat) => ({
          value: stat.value?.[localeKey],
          label: stat.label?.[localeKey],
        }))}
      />
      {/* Diving cards — white background */}
      <WaterExcursionsSection
        id="diving-excursions"
        heading={t("divingSectionHeading")}
        subheading={t("divingSectionSubheading")}
        iconType="diving"
        variant="white"
          excursions={divingSnorkelingPage?.divingExcursions?.map(e => ({
            slug: e.slug.current,
            title: getLocalized(e.title, locale),
            summary: getLocalized(e.shortSummary, locale),
            image: {
              url: e.heroImage.url,
              alt:
                e.heroImage.alt?.trim() || getLocalized(e.title, locale),
              lqip: e.heroImage.lqip,
            },
            price: e.price,
            duration: getLocalized(e.duration, locale),
            badge: e.badge ? getLocalized(e.badge, locale) : null,
            isFeatured: e.isFeatured,
          }))}
        labels={{
          from: t("from"),
          perPerson: t("perPerson"),
          viewDetails: t("viewDetails"),
          noExcursions: t("divingNoExcursions"),
          noExcursionsMessage: t("divingNoExcursionsMessage"),
          featured: t("featured"),
        }}
      />

      {/* Snorkeling cards — sand background */}
      <WaterExcursionsSection
        id="snorkeling-excursions"
        heading={t("snorkelingSectionHeading")}
        subheading={t("snorkelingSectionSubheading")}
        iconType="snorkeling"
        variant="sand"
          excursions={divingSnorkelingPage?.snorkelingExcursions?.map(e => ({
            slug: e.slug.current,
            title: getLocalized(e.title, locale),
            summary: getLocalized(e.shortSummary, locale),
            image: {
              url: e.heroImage.url,
              alt:
                e.heroImage.alt?.trim() || getLocalized(e.title, locale),
              lqip: e.heroImage.lqip,
            },
            price: e.price,
            duration: getLocalized(e.duration, locale),
            badge: e.badge ? getLocalized(e.badge, locale) : null,
            isFeatured: e.isFeatured,
          }))}
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
        heading={divingSnorkelingPage?.page.trustHeadline?.[localeKey]}
        // subheading={divingSnorkelingPage?.page.trustSubheadline?.[localeKey]}
        pillars={divingSnorkelingPage?.page.trustPillars?.map((pillar) => ({
          icon: pillar.icon,
          title: pillar.title?.[localeKey],
          description: pillar.description?.[localeKey],
        }))}
      />
      <DivingCTA
        headline={divingSnorkelingPage?.page.ctaHeadline?.[localeKey]}
        // subtext={divingSnorkelingPage?.page.ctaSubtext?.[localeKey]}
        whatsappButtonText={divingSnorkelingPage?.page.ctaButtonText?.[localeKey]}
        whatsappNumber={divingSnorkelingPage?.page.ctaWhatsappNumber}
        contactButtonText={'contact us'}
        contactHref="/contact"
      />
    </>
  );
}
