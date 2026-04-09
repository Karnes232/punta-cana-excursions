import { WhatToBringHeader } from "./WhatToBringHeader";
import { WhatToBringList } from "./WhatToBringList";

interface WhatToBringProps {
  /** Array of items from Sanity localizedStringArray */
  items: string[];
  /** i18n labels */
  labels: {
    heading: string; // "What to Bring" / "Qué Llevar"
    subheading: string; // "Pack these for the best experience" / "Lleva esto para la mejor experiencia"
  };
}

export function WhatToBring({ items, labels }: WhatToBringProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative bg-white py-10 md:py-14" id="what-to-bring">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <WhatToBringHeader
          heading={labels.heading}
          subheading={labels.subheading}
        />

        <div className="mt-7 md:mt-9">
          <WhatToBringList items={items} />
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />
    </section>
  );
}
