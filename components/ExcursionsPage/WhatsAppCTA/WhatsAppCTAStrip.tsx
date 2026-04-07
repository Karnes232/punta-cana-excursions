import { WhatsAppCTAContent } from "./WhatsAppCTAContent";
import { WhatsAppCTABackground } from "./WhatsAppCTABackground";

interface WhatsAppCTAStripProps {
  headline: string;
  description: string;
  whatsappNumber: string;
  whatsappDefaultMessage?: string;
  whatsappButtonText: string;
  contactHref: string;
  contactButtonText: string;
}

export function WhatsAppCTAStrip({
  headline,
  description,
  whatsappNumber,
  whatsappDefaultMessage,
  whatsappButtonText,
  contactHref,
  contactButtonText,
}: WhatsAppCTAStripProps) {
  // Build WhatsApp URL with pre-filled message
  const whatsappUrl = `https://wa.me/${whatsappNumber}${
    whatsappDefaultMessage
      ? `?text=${encodeURIComponent(whatsappDefaultMessage)}`
      : ""
  }`;

  return (
    <section className="relative overflow-hidden">
      <WhatsAppCTABackground />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
        <WhatsAppCTAContent
          headline={headline}
          description={description}
          whatsappUrl={whatsappUrl}
          whatsappButtonText={whatsappButtonText}
          contactHref={contactHref}
          contactButtonText={contactButtonText}
        />
      </div>
    </section>
  );
}
