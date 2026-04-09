import { HighlightsGrid } from "./HighlightsGrid";
import { HighlightsSectionHeader } from "./HighlightsSectionHeader";

interface HighlightsProps {
  /** Array of highlight strings from Sanity localizedStringArray */
  highlights: string[];
  locale: string;
  /** i18n labels */
  labels: {
    heading: string; // "Highlights" / "Puntos destacados"
    subheading: string; // "What makes this excursion special" / "Lo que hace especial esta excursión"
  };
}

export function Highlights({ highlights, labels, locale }: HighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="relative bg-sand/50 py-10 md:py-14" id="highlights">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <HighlightsSectionHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-7 md:mt-9">
          <HighlightsGrid highlights={highlights} locale={locale} />
        </div>
      </div>
    </section>
  );
}
