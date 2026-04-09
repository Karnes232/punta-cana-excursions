import { ExcursionFaqHeader } from "./ExcursionFaqHeader";
import { ExcursionFaqAccordion } from "./ExcursionFaqAccordion";

export interface FaqItem {
  _key: string;
  question: string;
  answer: string;
}

interface ExcursionFaqProps {
  /** FAQ items (already locale-resolved) */
  items: FaqItem[];
  /** i18n labels */
  labels: {
    heading: string; // "Frequently Asked Questions" / "Preguntas Frecuentes"
    subheading: string; // "Common questions about this excursion" / "Preguntas comunes sobre esta excursión"
  };
}

export function ExcursionFaq({ items, labels }: ExcursionFaqProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-white py-10 md:py-14" id="faq">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <ExcursionFaqHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-7 md:mt-9 max-w-3xl">
          <ExcursionFaqAccordion items={items} />
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />
    </section>
  );
}
