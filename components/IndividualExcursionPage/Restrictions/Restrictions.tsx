import { RestrictionsHeader } from "./RestrictionsHeader";
import { RestrictionsList } from "./RestrictionsList";

interface RestrictionsProps {
  /** Array of restriction strings from Sanity localizedStringArray */
  items: string[];
  /** i18n labels */
  labels: {
    heading: string; // "Important Information" / "Información Importante"
    subheading: string; // "Please review before booking" / "Por favor revisa antes de reservar"
  };
}

export function Restrictions({ items, labels }: RestrictionsProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-sand/50 py-10 md:py-14" id="restrictions">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <RestrictionsHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-7 md:mt-9">
          <RestrictionsList items={items} />
        </div>
      </div>
    </section>
  );
}
