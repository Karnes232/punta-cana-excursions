import { ContactCTAContent } from "./ContactCTAContent";
import { ContactCTABackground } from "./ContactCTABackground";

interface ContactCTAStripProps {
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function ContactCTAStrip({
  headline,
  description,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: ContactCTAStripProps) {
  return (
    <section className="relative overflow-hidden">
      <ContactCTABackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <ContactCTAContent
          headline={headline}
          description={description}
          primaryButtonText={primaryButtonText}
          primaryButtonHref={primaryButtonHref}
          secondaryButtonText={secondaryButtonText}
          secondaryButtonHref={secondaryButtonHref}
        />
      </div>
    </section>
  );
}
