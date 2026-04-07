import { CtaBannerContent } from "./CtaBannerContent";
import { CtaBannerBackground } from "./CtaBannerBackground";

interface CtaBannerProps {
  headline: string;
  subheadline?: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  whatsappNumber: string;
  whatsappText?: string;
  whatsappLabel?: string;
}

export function CtaBanner({
  headline,
  subheadline,
  primaryCtaText,
  primaryCtaHref,
  whatsappNumber,
  whatsappText,
  whatsappLabel,
}: CtaBannerProps) {
  // Build WhatsApp URL
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}${
    whatsappText ? `?text=${encodeURIComponent(whatsappText)}` : ""
  }`;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <CtaBannerBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <CtaBannerContent
          headline={headline}
          subheadline={subheadline}
          primaryCtaText={primaryCtaText}
          primaryCtaHref={primaryCtaHref}
          whatsappUrl={whatsappUrl}
          whatsappLabel={whatsappLabel}
        />
      </div>
    </section>
  );
}
