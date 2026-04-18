import { Hero } from "@/components/HomePage/Hero/Hero";
import { BrandIntro } from "@/components/HomePage/BrandIntro/BrandIntro";
import { FeaturedExcursions } from "@/components/HomePage/FeaturedExcursions/FeaturedExcursions";
import { ExcursionCategories } from "@/components/HomePage/ExcursionCategories/ExcursionCategories";
import { WhyChooseUs } from "@/components/HomePage/WhyChooseUs/WhyChooseUs";
import { HowBookingWorks } from "@/components/HomePage/HowBookingWorks/HowBookingWorks";
import { Reviews } from "@/components/HomePage/Reviews/Reviews";
import { FaqPreview } from "@/components/HomePage/FaqPreview/FaqPreview";
import { CtaBanner } from "@/components/HomePage/CtaBanner/CtaBanner";
import { getHomePage } from "@/sanity/queries/HomePage/HomePage";
import {
  getLocalized,
  LocalizedField,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getExcursionCategoryHomePage } from "@/sanity/queries/ExcursionCategory/ExcursionCategory";
import { getFeaturedExcursions } from "@/sanity/queries/IndividualExcursions/Excursionqueries";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, homePage, excursionCategories, featuredExcursions] =
    await Promise.all([
      params,
      getHomePage(),
      getExcursionCategoryHomePage(),
      getFeaturedExcursions(),
    ]);
  const localeKey = locale as keyof LocalizedField;

  return (
    <>
      <Hero
        backgroundImage={{
          url: homePage?.heroImage?.asset?.url ?? "",
          alt: homePage?.heroImageAlt?.[localeKey] ?? "",
          lqip: homePage?.heroImage?.asset?.metadata?.lqip ?? "",
        }}
        headline={homePage?.heroHeadline?.[localeKey] ?? ""}
        subheadline={homePage?.heroSubheadline?.[localeKey] ?? ""}
        primaryCTA={{
          text: homePage?.heroPrimaryCta?.text?.[localeKey] ?? "",
          href: homePage?.heroPrimaryCta?.href ?? "",
        }}
        secondaryCTA={{
          text: homePage?.heroSecondaryCta?.text?.[localeKey] ?? "",
          href: homePage?.heroSecondaryCta?.href ?? "",
        }}
      />
      <BrandIntro
        image={{
          url: homePage?.brandIntroImage?.asset?.url ?? "",
          alt: homePage?.brandIntroImageAlt?.[localeKey] ?? "",
          lqip: homePage?.brandIntroImage?.asset?.metadata?.lqip ?? "",
        }}
        heading={homePage?.brandIntroHeading?.[localeKey] ?? ""}
        body={homePage?.brandIntroBody?.[localeKey] ?? ""}
        tagline={homePage?.brandIntroTagline?.[localeKey] ?? ""}
      />
      <FeaturedExcursions
        heading={homePage?.featuredHeading?.[localeKey] ?? ""}
        subheading={homePage?.featuredSubheading?.[localeKey] ?? ""}
        viewAllText={homePage?.featuredViewAllText?.[localeKey] ?? ""}
        viewAllHref="/excursions"
        excursions={featuredExcursions.map((exc) => ({
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
          category: getLocalized(exc.category?.title, locale),
          badge: exc.badge ? getLocalized(exc.badge, locale) : undefined,
        }))}
      />
      <ExcursionCategories
        heading={
          homePage?.categoriesHeading?.[localeKey] ??
          homePage?.categoriesHeading?.en ??
          ""
        }
        subheading={
          homePage?.categoriesSubheading?.[localeKey] ??
          homePage?.categoriesSubheading?.en ??
          ""
        }
        categories={excursionCategories.map((category) => ({
          slug: category.slug,
          title: category.title?.[localeKey] ?? category.title?.en ?? "",
          image: {
            url: category.image?.asset?.url ?? "",
            alt: category.title?.[localeKey] ?? category.title?.en ?? "",
            lqip: category.image?.asset?.metadata?.lqip ?? "",
          },
        }))}
      />
      <WhyChooseUs
        heading={
          homePage?.whyChooseUsHeading?.[localeKey] ??
          homePage?.whyChooseUsHeading?.en ??
          ""
        }
        subheading={
          homePage?.whyChooseUsSubheading?.[localeKey] ??
          homePage?.whyChooseUsSubheading?.en ??
          ""
        }
        pillars={
          homePage?.trustPillars?.map((pillar) => ({
            icon: pillar.icon,
            title: pillar.title?.[localeKey] ?? pillar.title?.en ?? "",
            description:
              pillar.description?.[localeKey] ?? pillar.description?.en ?? "",
          })) ?? []
        }
      />
      <HowBookingWorks
        heading={
          homePage?.howBookingWorksHeading?.[localeKey] ??
          homePage?.howBookingWorksHeading?.en ??
          ""
        }
        subheading={
          homePage?.howBookingWorksSubheading?.[localeKey] ??
          homePage?.howBookingWorksSubheading?.en ??
          ""
        }
        steps={
          homePage?.bookingSteps?.map((step) => ({
            stepNumber: step.stepNumber,
            icon: step.icon,
            title: step.title?.[localeKey] ?? step.title?.en ?? "",
            description:
              step.description?.[localeKey] ?? step.description?.en ?? "",
          })) ?? []
        }
      />
      <Reviews
        heading={
          homePage?.reviewsHeading?.[localeKey] ??
          homePage?.reviewsHeading?.en ??
          ""
        }
        subheading={
          homePage?.reviewsSubheading?.[localeKey] ??
          homePage?.reviewsSubheading?.en ??
          ""
        }
        reviews={
          homePage?.reviews?.map((review) => ({
            name: review.name,
            country: review.country,
            text: review.text?.[localeKey] ?? review.text?.en ?? "",
            rating: review.rating,
            excursionTitle: review.excursionTitle,
          })) ?? []
        }
      />
      <FaqPreview
        heading={
          homePage?.faqPreviewHeading?.[localeKey] ??
          homePage?.faqPreviewHeading?.en ??
          ""
        }
        subheading={
          homePage?.faqPreviewSubheading?.[localeKey] ??
          homePage?.faqPreviewSubheading?.en ??
          ""
        }
        faqs={
          homePage?.faqPreviewItems?.map((item) => ({
            question: item.question?.[localeKey] ?? item.question?.en ?? "",
            answer: item.answer?.[localeKey] ?? item.answer?.en ?? "",
          })) ?? []
        }
        ctaText={
          homePage?.faqPreviewCtaText?.[localeKey] ??
          homePage?.faqPreviewCtaText?.en ??
          ""
        }
        ctaHref="/faq"
      />
      <CtaBanner
        headline={
          homePage?.ctaBannerHeadline?.[localeKey] ??
          homePage?.ctaBannerHeadline?.en ??
          ""
        }
        subheadline={
          homePage?.ctaBannerSubheadline?.[localeKey] ??
          homePage?.ctaBannerSubheadline?.en ??
          ""
        }
        primaryCtaText={
          homePage?.ctaBannerButtonText?.[localeKey] ??
          homePage?.ctaBannerButtonText?.en ??
          ""
        }
        primaryCtaHref={homePage?.ctaBannerButtonHref ?? ""}
        whatsappNumber="1234567890"
        whatsappText={
          homePage?.ctaBannerWhatsappLabel?.[localeKey] ??
          homePage?.ctaBannerWhatsappLabel?.en ??
          ""
        }
        whatsappLabel={
          homePage?.ctaBannerWhatsappLabel?.[localeKey] ??
          homePage?.ctaBannerWhatsappLabel?.en ??
          ""
        }
      />
    </>
  );
}
