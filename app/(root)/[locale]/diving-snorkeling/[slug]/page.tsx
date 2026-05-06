import { notFound } from "next/navigation";
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
  getIndividualDivingExcursion,
  getDivingExcursionSlugs,
} from "@/sanity/queries/DivingSnorkelingPage/IndividualDivingExcursion";

// =============================================================================
// Static params
// =============================================================================

export async function generateStaticParams() {
  const slugs = await getDivingExcursionSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

// =============================================================================
// Helpers
// =============================================================================

const activityTypeLabels: Record<string, { en: string; es: string }> = {
  "scuba-diving": { en: "Scuba Diving", es: "Buceo" },
  snorkeling: { en: "Snorkeling", es: "Snorkel" },
  freediving: { en: "Freediving", es: "Apnea" },
  snuba: { en: "Snuba", es: "Snuba" },
  "scuba-snorkeling": { en: "Scuba + Snorkeling", es: "Buceo + Snorkel" },
};

const experienceLevelLabels: Record<string, { en: string; es: string }> = {
  "all-levels": { en: "All Levels", es: "Todos los Niveles" },
  beginner: { en: "Beginner", es: "Principiante" },
  intermediate: { en: "Intermediate", es: "Intermedio" },
  advanced: { en: "Advanced", es: "Avanzado" },
};

const activitySectionAnchors: Record<string, string> = {
  "scuba-diving": "#diving-excursions",
  freediving: "#diving-excursions",
  "scuba-snorkeling": "#diving-excursions",
  snorkeling: "#snorkeling-excursions",
  snuba: "#snorkeling-excursions",
};

// =============================================================================
// Page
// =============================================================================

export default async function DivingExcursionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const excursion = await getIndividualDivingExcursion(slug);

  if (!excursion) notFound();

  const l = locale as "en" | "es";
  const isEs = locale === "es";

  const activityLabel = activityTypeLabels[excursion.activityType]?.[l] ?? excursion.activityType;
  const experienceLabel = experienceLevelLabels[excursion.experienceLevel]?.[l] ?? excursion.experienceLevel;
  const sectionAnchor = activitySectionAnchors[excursion.activityType] ?? "";

  const faq = excursion.faq?.map((item) => ({
    _key: item._key,
    question: getLocalized(item.question, locale),
    answer: getLocalized(item.answer, locale),
  }));

  // Build restrictions list — prepend certification requirement if applicable
  const restrictionItems = getLocalizedStringArray(excursion.restrictions, locale);
  if (excursion.certificationRequired && excursion.certificationDetails) {
    const certNote = isEs
      ? `Certificación requerida: ${getLocalized(excursion.certificationDetails, locale)}`
      : `Certification required: ${getLocalized(excursion.certificationDetails, locale)}`;
    restrictionItems.unshift(certNote);
  }

  const marineLifeItems = getLocalizedStringArray(excursion.marineLife, locale);
  const equipmentItems = getLocalizedStringArray(excursion.equipmentProvided, locale);

  return (
    <>
      <ImageGalleryHero
        heroImage={{
          url: excursion.heroImage?.asset?.url ?? "",
          alt: getLocalized(excursion.heroImage?.alt, locale),
          lqip: excursion.heroImage?.asset?.metadata?.lqip ?? "",
        }}
        galleryImages={
          excursion.gallery?.map((img) => ({
            url: img.asset.url,
            alt: getLocalized(img.alt, locale),
            lqip: img.asset.metadata.lqip,
          })) ?? []
        }
        excursionTitle={getLocalized(excursion.title, locale)}
        categoryBadge={activityLabel}
        labels={{
          viewAllPhotos: isEs ? "Ver todas las fotos" : "View All Photos",
          photoOf: isEs ? "Foto de" : "Photo of",
          close: isEs ? "Cerrar" : "Close",
          previous: isEs ? "Anterior" : "Previous",
          next: isEs ? "Siguiente" : "Next",
        }}
      />

      <TitleSummary
        locale={locale}
        title={getLocalized(excursion.title, locale)}
        badge={excursion.badge ? getLocalized(excursion.badge, locale) : null}
        summary={getLocalized(excursion.shortSummary, locale)}
        category={{
          title: activityLabel,
          slug: excursion.activityType,
        }}
        sectionHref="/diving-snorkeling"
        categoryHref={`/diving-snorkeling${sectionAnchor}`}
        stats={{
          duration: getLocalized(excursion.duration, locale),
          pickupTime: experienceLabel,
          groupSize: excursion.maxDepth
            ? getLocalized(excursion.maxDepth, locale)
            : undefined,
          pickupZones: excursion.numberOfDives
            ? [
                `${excursion.numberOfDives} ${
                  isEs
                    ? excursion.numberOfDives === 1
                      ? "inmersión"
                      : "inmersiones"
                    : excursion.numberOfDives === 1
                      ? "dive"
                      : "dives"
                }`,
              ]
            : undefined,
        }}
        labels={{
          excursions: isEs ? "Buceo y Snorkel" : "Diving & Snorkeling",
          duration: isEs ? "Duración" : "Duration",
          pickup: isEs ? "Nivel de Experiencia" : "Experience Level",
          groupSize: isEs ? "Profundidad Máx." : "Max Depth",
          pickupZones: isEs ? "Inmersiones" : "Dives",
        }}
      />

      <ExcursionContentLayout
        sidebar={
          <PriceDeposit
            price={excursion.price ?? 0}
            depositAmount={excursion.depositAmount ?? 0}
            priceNote={getLocalized(excursion.priceNote, locale)}
            excursionTitle={getLocalized(excursion.title, locale)}
            whatsappNumber="18091234567"
            locale={locale}
            labels={{
              from: isEs ? "Desde" : "From",
              perPerson: isEs ? "por persona" : "per person",
              depositRequired: isEs ? "Depósito para reservar" : "Deposit to reserve",
              payRestOnsite: isEs
                ? "Paga el resto el día de la excursión"
                : "Pay the rest on the day of the excursion",
              reserveNow: isEs ? "Reserva Tu Lugar" : "Reserve Your Spot",
              contactCta: isEs ? "Hacer una pregunta" : "Ask a Question",
              freeCancellation: isEs
                ? "Cancelación gratuita 24h antes"
                : "Free cancellation 24h before",
              instantConfirmation: isEs ? "Confirmación instantánea" : "Instant confirmation",
              securePayment: isEs ? "Pago seguro" : "Secure payment",
            }}
          />
        }
      >
        <Highlights
          highlights={getLocalizedStringArray(excursion.highlights, locale)}
          locale={locale}
          labels={{
            heading: isEs ? "Destacados" : "Highlights",
            subheading: isEs
              ? "Lo que hace especial esta excursión"
              : "What makes this excursion special",
          }}
        />

        <FullDescription
          body={getLocalizedPortableText(excursion.fullDescription, locale)}
          labels={{
            heading: isEs ? "Descripción Completa" : "Full Description",
          }}
        />

        {marineLifeItems.length > 0 && (
          <Highlights
            highlights={marineLifeItems}
            locale={locale}
            labels={{
              heading: isEs ? "Vida Marina" : "Marine Life",
              subheading: isEs
                ? "Lo que podrías encontrar bajo el agua"
                : "What you might encounter underwater",
            }}
          />
        )}

        {equipmentItems.length > 0 && (
          <WhatsIncluded
            items={equipmentItems}
            labels={{
              heading: isEs ? "Equipo Proporcionado" : "Equipment Provided",
              subheading: isEs
                ? "Todo el equipo está incluido"
                : "All gear is included with your excursion",
            }}
          />
        )}

        <WhatsIncluded
          items={getLocalizedStringArray(excursion.whatsIncluded, locale)}
          labels={{
            heading: isEs ? "Qué Incluye" : "What's Included",
            subheading: isEs
              ? "Todo cubierto en el precio de tu excursión"
              : "Everything covered in your excursion price",
          }}
        />

        <WhatToBring
          items={getLocalizedStringArray(excursion.whatToBring, locale)}
          labels={{
            heading: isEs ? "Qué Traer" : "What to Bring",
            subheading: isEs
              ? "Empaca esto para la mejor experiencia"
              : "Pack these for the best experience",
          }}
        />

        {restrictionItems.length > 0 && (
          <Restrictions
            items={restrictionItems}
            labels={{
              heading: isEs ? "Restricciones" : "Restrictions",
              subheading: isEs
                ? "Por favor revisa antes de reservar"
                : "Please review before booking",
            }}
          />
        )}

        <ExcursionFaq
          items={faq ?? []}
          labels={{
            heading: "FAQ",
            subheading: isEs
              ? "Preguntas frecuentes sobre esta excursión"
              : "Common questions about this excursion",
          }}
        />
      </ExcursionContentLayout>

      {excursion.relatedExcursions && excursion.relatedExcursions.length > 0 && (
        <RelatedExcursions
          excursions={excursion.relatedExcursions.map((rel) => ({
            slug: rel.slug.current,
            href: `/diving-snorkeling/${rel.slug.current}`,
            title: getLocalized(rel.title, locale),
            summary: getLocalized(rel.shortSummary, locale),
            image: {
              asset: {
                url: rel.heroImage.asset.url,
                metadata: { lqip: rel.heroImage.asset.metadata.lqip },
              },
              alt: getLocalized(rel.heroImage.alt, locale),
              lqip: rel.heroImage.asset.metadata.lqip,
            },
            price: rel.price,
            duration: getLocalized(rel.duration, locale),
            category:
              activityTypeLabels[rel.activityType]?.[l] ?? rel.activityType,
          }))}
          labels={{
            heading: isEs ? "Excursiones Relacionadas" : "Related Excursions",
            subheading: isEs
              ? "Más excursiones acuáticas para explorar"
              : "More water excursions to explore",
            viewDetails: isEs ? "Ver detalles" : "View details",
            from: isEs ? "Desde" : "From",
          }}
        />
      )}
    </>
  );
}
