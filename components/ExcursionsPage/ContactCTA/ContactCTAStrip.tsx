import { ContactCTAContent } from "./ContactCTAContent";
import { ContactCTABackground } from "./ContactCTABackground";

interface ContactCTAStripProps {
  eyebrow?: string;
  headline: string;
  description: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function ContactCTAStrip({
  eyebrow,
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

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 md:py-24">
        <ContactCTAContent
          eyebrow={eyebrow}
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
