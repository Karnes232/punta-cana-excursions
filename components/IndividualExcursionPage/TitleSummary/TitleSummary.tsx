import { TitleHeading } from "./TitleHeading";
import { TitleBreadcrumb } from "./TitleBreadcrumb";
import { TitleSummaryText } from "./TitleSummaryText";
import { TitleStatsBar } from "./TitleStatsBar";

interface TitleSummaryProps {
  /** Route locale for localized stats (e.g. weekday abbreviations) */
  locale?: string;
  /** Excursion name */
  title: string;
  /** 1–2 sentence tagline */
  summary: string;
  /** Category name for breadcrumb + badge */
  category: {
    title: string;
    slug: string;
  };
  /** Override breadcrumb section href (e.g. "/scuba-diving"). Default: "/excursions". */
  sectionHref?: string;
  /** Override breadcrumb category href. Default: `${sectionHref}?category=${slug}`. */
  categoryHref?: string;
  /** Optional badge label (e.g. "Most Popular", "Best Seller") */
  badge?: string | null;
  /** Key stats displayed in the stats bar */
  stats: {
    duration: string;
    pickupTime?: string;
    groupSize?: string;
    pickupZones?: string[];
    activityLevel?: string;
    daysAvailable?: string[];
    timeSlots?: string[];
    bookingNoticeHours?: number;
  };
  /** i18n labels */
  labels: {
    excursions: string; // "Excursions" / "Excursiones" (breadcrumb)
    duration: string; // "Duration" / "Duración"
    pickup: string; // "Pickup" / "Recogida"
    groupSize: string; // "Group Size" / "Tamaño del grupo"
    pickupZones: string; // "Pickup Zones" / "Zonas de recogida"
    activityLevel?: string; // "Activity Level" / "Nivel de actividad"
    activityEasy?: string;
    activityModerate?: string;
    activityChallenging?: string;
    schedule?: string; // "Schedule" / "Horario"
    bookingNotice?: string; // "Book at least X hours in advance"
    departures?: string; // "Departures" / "Salidas"
  };
}

export function TitleSummary({
  locale = "en",
  title,
  summary,
  category,
  badge,
  stats,
  labels,
  sectionHref,
  categoryHref,
}: TitleSummaryProps) {
  return (
    <section className="relative bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-6 pb-8 md:pt-8 md:pb-10">
        {/* Breadcrumb — Home > Excursions > Category */}
        <TitleBreadcrumb
          categoryTitle={category.title}
          categorySlug={category.slug}
          excursionsLabel={labels.excursions}
          sectionHref={sectionHref}
          categoryHref={categoryHref}
        />

        {/* Title + Badge row */}
        <div className="mt-3 md:mt-4">
          <TitleHeading title={title} badge={badge} />
        </div>

        {/* Summary tagline */}
        <div className="mt-3 md:mt-4">
          <TitleSummaryText text={summary} />
        </div>

        {/* Stats bar — duration, pickup, group size */}
        <div className="mt-6 md:mt-8">
          <TitleStatsBar stats={stats} labels={labels} locale={locale} />
        </div>
      </div>

      {/* Subtle bottom border to separate from next section */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />
    </section>
  );
}
