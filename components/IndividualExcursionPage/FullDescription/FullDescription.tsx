import { FullDescriptionHeader } from "./FullDescriptionHeader";
import { FullDescriptionBody } from "./FullDescriptionBody";
import type { PortableTextBlock } from "@portabletext/types";

interface FullDescriptionProps {
  /** Portable Text blocks from Sanity (already locale-resolved) */
  body: PortableTextBlock[];
  /** i18n labels */
  labels: {
    heading: string; // "About This Excursion" / "Sobre Esta Excursión"
  };
}

export function FullDescription({ body, labels }: FullDescriptionProps) {
  if (!body || body.length === 0) return null;

  return (
    <section className="relative bg-white py-10 md:py-14" id="description">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <FullDescriptionHeader heading={labels.heading} />

        <div className="mt-6 md:mt-8">
          <FullDescriptionBody body={body} />
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />
    </section>
  );
}
