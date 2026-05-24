import { CtaBannerContent } from "./CtaBannerContent";
import { CtaBannerBackground } from "./CtaBannerBackground";

interface CtaBannerProps {
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref: string;
}

export function CtaBanner({
  eyebrow,
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: CtaBannerProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <CtaBannerBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <CtaBannerContent
          eyebrow={eyebrow}
          headline={headline}
          subheadline={subheadline}
          primaryCtaText={primaryCtaText}
          primaryCtaHref={primaryCtaHref}
          secondaryCtaText={secondaryCtaText}
          secondaryCtaHref={secondaryCtaHref}
        />
      </div>
    </section>
  );
}
