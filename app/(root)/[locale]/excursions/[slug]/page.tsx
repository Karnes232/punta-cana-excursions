import { ExcursionContentLayout } from "@/components/IndividualExcursionPage/ExcursionContentLayout";
import { ExcursionFaq } from "@/components/IndividualExcursionPage/ExcursionFaq/ExcursionFaq";
import { FullDescription } from "@/components/IndividualExcursionPage/FullDescription/FullDescription";
import { Highlights } from "@/components/IndividualExcursionPage/Highlights/Highlights";
import { ImageGalleryHero } from "@/components/IndividualExcursionPage/ImageGalleryHero/ImageGalleryHero";
import { PriceDeposit } from "@/components/IndividualExcursionPage/PriceDeposit/PriceDeposit";
import { RelatedExcursions } from "@/components/IndividualExcursionPage/RelatedExcursions/RelatedExcursions";
import { Restrictions } from "@/components/IndividualExcursionPage/Restrictions/Restrictions";
import { TitleSummary } from "@/components/IndividualExcursionPage/TitleSummary/TitleSummary";
import { WhatsIncluded } from "@/components/IndividualExcursionPage/WhatsIncluded/WhatsIncluded";
import { WhatToBring } from "@/components/IndividualExcursionPage/WhatToBring/WhatToBring";
import {
  getLocalized,
  getLocalizedPortableText,
  getLocalizedStringArray,
} from "@/sanity/queries/GeneralLayout/generalLayoutQuery";
import { getIndividualExcursion } from "@/sanity/queries/IndividualExcursions/Excursionqueries";

export default async function ExcursionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const excursion = await getIndividualExcursion(slug);
  const faq = excursion?.faq?.map((item) => ({
    _key: item._key,
    question: getLocalized(item.question, locale),
    answer: getLocalized(item.answer, locale),
  }));

  return (
    <>
      <ImageGalleryHero
        heroImage={{
          url: excursion?.heroImage.asset.url || "",
          alt: getLocalized(excursion?.heroImage.alt, locale),
          lqip: excursion?.heroImage.asset.metadata.lqip || "",
        }}
        galleryImages={
          excursion?.gallery.map((img) => ({
            url: img.asset.url,
            alt: getLocalized(img.alt, locale),
            lqip: img.asset.metadata.lqip,
          })) || []
        }
        excursionTitle={getLocalized(excursion?.title, locale)}
        categoryBadge={getLocalized(excursion?.category.title, locale)}
        labels={{
          viewAllPhotos: "View All Photos",
          photoOf: "Photo of",
          close: "Close",
          previous: "Previous",
          next: "Next",
        }}
      />
      <TitleSummary
        title={getLocalized(excursion?.title, locale)}
        badge={excursion?.badge ? getLocalized(excursion.badge, locale) : null}
        summary={getLocalized(excursion?.shortSummary, locale)}
        category={{
          title: getLocalized(excursion?.category.title, locale),
          slug: excursion?.category?.slug.current ?? "",
        }}
        stats={{
          duration: getLocalized(excursion?.duration, locale),
          pickupTime: getLocalized(excursion?.pickupTime, locale),
          groupSize: getLocalized(excursion?.groupSize, locale),
          pickupZones: excursion?.pickupZones ?? [],
        }}
        labels={{
          excursions: locale === "es" ? "Excursiones" : "Excursions",
          duration: locale === "es" ? "Duración" : "Duration",
          pickup: locale === "es" ? "Recogida" : "Pickup",
          groupSize: locale === "es" ? "Tamaño del grupo" : "Group Size",
          pickupZones: locale === "es" ? "Zonas de recogida" : "Pickup Zones",
        }}
      />
      <ExcursionContentLayout
        sidebar={
          <PriceDeposit
            price={excursion?.price ?? 0}
            depositAmount={excursion?.depositAmount ?? 0}
            priceNote={getLocalized(excursion?.priceNote, locale)}
            excursionTitle={getLocalized(excursion?.title, locale)}
            whatsappNumber={"18091234567"}
            labels={{
              from: "From",
              perPerson: "per person",
              depositRequired: "Deposit to reserve",
              payRestOnsite: "Pay the rest on the day of the excursion",
              reserveNow: "Reserve Your Spot",
              whatsappCta: "Ask on WhatsApp",
              whatsappMessage:
                "Hi, I'm interested in the {title} excursion. Can you provide more information?",
              freeCancellation: "Free cancellation 24h before",
              instantConfirmation: "Instant confirmation",
              securePayment: "Secure payment",
            }}
          />
        }
      >
        <Highlights
          highlights={getLocalizedStringArray(excursion?.highlights, locale)}
          locale={locale}
          labels={{
            heading: "Highlights",
            subheading: "What makes this excursion special",
          }}
        />
        <FullDescription
          body={getLocalizedPortableText(excursion?.fullDescription, locale)}
          labels={{
            heading: "Full Description",
          }}
        />
        <WhatsIncluded
          items={getLocalizedStringArray(excursion?.whatsIncluded, locale)}
          labels={{
            heading: "Whats Included",
            subheading: "Everything covered in your excursion price",
          }}
        />
        <WhatToBring
          items={getLocalizedStringArray(excursion?.whatToBring, locale)}
          labels={{
            heading: "What to Bring",
            subheading: "Pack these for the best experience",
          }}
        />
        <Restrictions
          items={getLocalizedStringArray(excursion?.restrictions, locale)}
          labels={{
            heading: "Restrictions",
            subheading: "Please review before booking",
          }}
        />
        <ExcursionFaq
          items={faq ?? []}
          labels={{
            heading: "FAQ",
            subheading: "Common questions about this excursion",
          }}
        />
      </ExcursionContentLayout>
      {excursion?.relatedExcursions && (
        <RelatedExcursions
          excursions={
            excursion?.relatedExcursions?.map((excursion) => ({
              slug: excursion.slug.current,
              title: getLocalized(excursion.title, locale),
              summary: getLocalized(excursion.shortSummary, locale),
              image: {
                asset: {
                  url: excursion.heroImage.asset.url,
                  metadata: {
                    lqip: excursion.heroImage.asset.metadata.lqip,
                  },
                },
                alt: getLocalized(excursion.heroImage.alt, locale),
              },
              price: excursion.price,
              duration: getLocalized(excursion.duration, locale),
              category: getLocalized(excursion.category.title, locale),
            })) ?? []
          }
          labels={{
            heading: "Related Excursions",
            subheading: "More excursions to explore",
            viewDetails: "View details",
            from: "From",
          }}
        />
      )}
    </>
  );
}
