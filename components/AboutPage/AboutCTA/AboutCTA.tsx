import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface AboutCTAProps {
  headline: string;
  subheadline: string;
  whatsappButtonText: string;
  whatsappNumber: string;
  contactButtonText: string;
}

export function AboutCTA({
  headline,
  subheadline,
  whatsappButtonText,
  whatsappNumber,
  contactButtonText,
}: AboutCTAProps) {
  const whatsappHref = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}`;

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #005F86 0%, #0EA5B7 100%)" }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative wave top */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg
          viewBox="0 0 1440 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0V25C360 50 720 0 1080 25C1260 37.5 1350 18.75 1440 25V0H0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <WordRevealHeading
          as="h2"
          text={headline}
          className="font-heading font-bold text-white text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5"
        />
        {subheadline && (
          <p className="font-body text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {subheadline}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* WhatsApp CTA */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-whatsapp text-white font-heading font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <WhatsAppIcon />
            {whatsappButtonText}
          </a>

          {/* Browse excursions link */}
          <Link
            href="/excursions"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/40 text-white font-heading font-bold text-base hover:bg-white/10 hover:border-white/60 transition-all duration-200"
          >
            {contactButtonText}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.115 1.533 5.84L.057 23.999l6.305-1.654A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.94a9.919 9.919 0 01-5.065-1.383l-.364-.215-3.742.982.999-3.648-.237-.375A9.913 9.913 0 012.06 12C2.06 6.51 6.51 2.06 12 2.06S21.94 6.51 21.94 12 17.49 21.94 12 21.94z" />
    </svg>
  );
}
