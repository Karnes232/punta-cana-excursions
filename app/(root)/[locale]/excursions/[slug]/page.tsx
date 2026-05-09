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
import {
  getIndividualExcursion,
  getIndividualExcursionSeo,
} from "@/sanity/queries/IndividualExcursions/Excursionqueries";
import type { BookingLabels } from "@/components/IndividualExcursionPage/PriceDeposit/bookingTypes";
import type { Metadata } from "next";
import { getDefaultSeo } from "@/sanity/queries/SEO/seoProjection";
import { buildMetadata } from "@/lib/seo/buildMetadata";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const [pageSeo, defaultSeo, excursion] = await Promise.all([
    getIndividualExcursionSeo(slug),
    getDefaultSeo(),
    getIndividualExcursion(slug),
  ]);
  const heroImage = excursion?.heroImage;
  return buildMetadata({
    seo: pageSeo?.seo,
    defaults: defaultSeo?.defaultSeo,
    locale: locale as "en" | "es",
    path: `/excursions/${slug}`,
    fallbackTitle: getLocalized(excursion?.title, locale),
    fallbackDescription: getLocalized(excursion?.shortSummary, locale),
    fallbackImage: heroImage?.asset?.url
      ? {
          url: heroImage.asset.url,
          alt: getLocalized(heroImage.alt, locale) || undefined,
          width: heroImage.asset.metadata?.dimensions?.width,
          height: heroImage.asset.metadata?.dimensions?.height,
        }
      : undefined,
  });
}

export default async function ExcursionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [excursion, pageSeo] = await Promise.all([
    getIndividualExcursion(slug),
    getIndividualExcursionSeo(slug),
  ]);
  const jsonLd =
    locale === "es"
      ? pageSeo?.seo?.structuredDataEs
      : pageSeo?.seo?.structuredDataEn;

  const childAgeRange = getLocalized(excursion?.childAgeRange, locale);
  const infantPolicy = excursion?.infantPolicy
    ? getLocalized(excursion.infantPolicy, locale)
    : undefined;
  const isEs = locale === "es";

  const bookingLabels: BookingLabels = {
    modalTitle: isEs ? "Reserva tu excursión" : "Book your excursion",
    modalSubtitle: getLocalized(excursion?.title, locale),
    close: isEs ? "Cerrar" : "Close",
    stepFormTitle: isEs ? "Detalles de tu reserva" : "Booking details",
    stepReviewTitle: isEs ? "Revisa y paga" : "Review & pay",
    dateLabel: isEs ? "Fecha de la excursión" : "Excursion date",
    dateHelper: isEs
      ? "Reserva con al menos {hours} horas de antelación."
      : "Book at least {hours} hours in advance.",
    dateInvalidWeekday: isEs
      ? "Esta excursión no opera ese día"
      : "This excursion does not run on that day",
    dateInvalidNotice: isEs
      ? "La fecha está dentro del plazo mínimo de reserva"
      : "Date is within the booking notice window",
    timeLabel: isEs ? "Hora de salida" : "Departure time",
    timeRequired: isEs ? "Selecciona una hora" : "Select a time",
    guestsLabel: isEs ? "Huéspedes" : "Guests",
    adultsLabel: isEs ? "Adultos" : "Adults",
    childrenLabel: isEs ? "Niños" : "Children",
    childAgeRangeNote: childAgeRange || undefined,
    contactSection: isEs ? "Tus datos" : "Your details",
    nameLabel: isEs ? "Nombre completo" : "Full name",
    namePlaceholder: isEs ? "Juan García" : "John Smith",
    emailLabel: isEs ? "Correo electrónico" : "Email address",
    emailPlaceholder: isEs ? "juan@ejemplo.com" : "john@example.com",
    phoneLabel: isEs ? "Teléfono" : "Phone",
    phonePlaceholder: "+1 (809) 000-0000",
    hotelLabel: isEs ? "Hotel de recogida" : "Pickup hotel",
    hotelPlaceholder: "Barceló Bávaro Palace…",
    required: isEs ? "Campo requerido" : "Required",
    invalidEmail: isEs ? "Correo no válido" : "Invalid email",
    invalidPhone: isEs ? "Teléfono no válido" : "Invalid phone",
    continueToPayment: isEs ? "Continuar al pago" : "Continue to payment",
    editDetails: isEs ? "Editar detalles" : "Edit details",
    reviewExcursion: isEs ? "Excursión" : "Excursion",
    reviewDate: isEs ? "Fecha" : "Date",
    reviewTime: isEs ? "Hora" : "Time",
    reviewGuests: isEs ? "Huéspedes" : "Guests",
    reviewHotel: isEs ? "Hotel" : "Hotel",
    reviewTotal: isEs ? "Precio total" : "Total price",
    reviewDeposit: isEs ? "Depósito a pagar" : "Deposit to pay",
    reviewDepositNote: isEs
      ? "Saldo restante a pagar el día de la excursión."
      : "Balance due on the day of the excursion.",
    reviewBalanceLabel: isEs ? "Saldo del día" : "Day-of balance",
    successTitle: isEs ? "¡Reserva confirmada!" : "Booking confirmed!",
    successMessage: isEs
      ? "Tu depósito fue procesado y tu lugar está reservado. Te enviamos un correo con los detalles."
      : "Your deposit was processed and your spot is reserved. We've sent a confirmation email with the details.",
    successCheckEmail: isEs ? "Revisa tu bandeja:" : "Check your inbox:",
    errorTitle: isEs ? "Algo salió mal" : "Something went wrong",
    errorRetry: isEs ? "Reintentar" : "Retry",
    errorContact: isEs
      ? "Por favor contáctanos para confirmar tu reserva."
      : "Please contact us to confirm your booking.",
    paymentError: isEs
      ? "El pago no se pudo procesar. Inténtalo de nuevo."
      : "Payment could not be processed. Please try again.",
  };

  const faq = excursion?.faq?.map((item) => ({
    _key: item._key,
    question: getLocalized(item.question, locale),
    answer: getLocalized(item.answer, locale),
  }));

  return (
    <>
      <JsonLd data={jsonLd} />
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
        locale={locale}
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
          activityLevel: excursion?.activityLevel,
          daysAvailable: excursion?.daysAvailable ?? [],
          timeSlots: excursion?.timeSlots ?? [],
          bookingNoticeHours: excursion?.bookingNoticeHours,
        }}
        labels={{
          excursions: locale === "es" ? "Excursiones" : "Excursions",
          duration: locale === "es" ? "Duración" : "Duration",
          pickup: locale === "es" ? "Recogida" : "Pickup",
          groupSize: locale === "es" ? "Tamaño del grupo" : "Group Size",
          pickupZones: locale === "es" ? "Zonas de recogida" : "Pickup Zones",
          activityLevel: locale === "es" ? "Nivel de actividad" : "Activity Level",
          activityEasy: locale === "es" ? "Fácil" : "Easy",
          activityModerate: locale === "es" ? "Moderado" : "Moderate",
          activityChallenging: locale === "es" ? "Exigente" : "Challenging",
          schedule: locale === "es" ? "Horario" : "Schedule",
          bookingNotice: locale === "es" ? "Reserva con al menos X horas de antelación" : "Book at least X hours in advance",
          departures: locale === "es" ? "Salidas" : "Departures",
        }}
      />
      <ExcursionContentLayout
        sidebar={
          <PriceDeposit
            price={excursion?.price ?? 0}
            depositAmount={excursion?.depositAmount ?? 0}
            priceNote={getLocalized(excursion?.priceNote, locale)}
            childPrice={excursion?.childPrice}
            childAgeRange={childAgeRange || undefined}
            infantPolicy={infantPolicy}
            excursionId={excursion?._id ?? ""}
            excursionTitle={getLocalized(excursion?.title, locale)}
            whatsappNumber="18091234567"
            locale={locale}
            daysAvailable={excursion?.daysAvailable ?? []}
            timeSlots={excursion?.timeSlots ?? []}
            bookingNoticeHours={excursion?.bookingNoticeHours ?? 24}
            bookingLabels={bookingLabels}
            labels={{
              from: locale === "es" ? "Desde" : "From",
              perPerson: locale === "es" ? "por persona" : "per person",
              depositRequired: locale === "es" ? "Depósito para reservar" : "Deposit to reserve",
              payRestOnsite: locale === "es"
                ? "Paga el resto el día de la excursión"
                : "Pay the rest on the day of the excursion",
              reserveNow: locale === "es" ? "Reserva Tu Lugar" : "Reserve Your Spot",
              contactCta: locale === "es" ? "Hacer una pregunta" : "Ask a Question",
              freeCancellation: locale === "es" ? "Cancelación gratuita 24h antes" : "Free cancellation 24h before",
              instantConfirmation: locale === "es" ? "Confirmación instantánea" : "Instant confirmation",
              securePayment: locale === "es" ? "Pago seguro" : "Secure payment",
              child: locale === "es" ? "Niños" : "Children",
              infant: locale === "es" ? "Bebés" : "Infants",
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
