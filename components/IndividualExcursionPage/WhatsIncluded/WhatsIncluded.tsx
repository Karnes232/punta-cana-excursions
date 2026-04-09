import { WhatsIncludedHeader } from "./WhatsIncludedHeader";
import { WhatsIncludedList } from "./WhatsIncludedList";

interface WhatsIncludedProps {
  /** Array of included items from Sanity localizedStringArray */
  items: string[];
  /** i18n labels */
  labels: {
    heading: string; // "What's Included" / "Qué Incluye"
    subheading: string; // "Everything covered in your excursion price" / "Todo cubierto en el precio de tu excursión"
  };
}

export function WhatsIncluded({ items, labels }: WhatsIncludedProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-sand/50 py-10 md:py-14" id="whats-included">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <WhatsIncludedHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-7 md:mt-9">
          <WhatsIncludedList items={items} />
        </div>
      </div>
    </section>
  );
}
