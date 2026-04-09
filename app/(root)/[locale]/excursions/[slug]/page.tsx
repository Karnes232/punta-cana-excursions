import { FullDescription } from "@/components/IndividualExcursionPage/FullDescription/FullDescription";
import { Highlights } from "@/components/IndividualExcursionPage/Highlights/Highlights";
import { ImageGalleryHero } from "@/components/IndividualExcursionPage/ImageGalleryHero/ImageGalleryHero";
import { PriceDeposit } from "@/components/IndividualExcursionPage/PriceDeposit/PriceDeposit";
import { TitleSummary } from "@/components/IndividualExcursionPage/TitleSummary/TitleSummary";
import { WhatsIncluded } from "@/components/IndividualExcursionPage/WhatsIncluded/WhatsIncluded";
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
    </>
  );
}
