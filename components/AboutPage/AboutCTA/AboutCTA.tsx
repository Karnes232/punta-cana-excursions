import { Link } from "@/i18n/navigation";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface AboutCTAProps {
  eyebrow?: string;
  headline: string;
  subheadline: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

export function AboutCTA({
  eyebrow,
  headline,
  subheadline,
  primaryButtonText,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonHref,
}: AboutCTAProps) {
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
        {eyebrow && (
          <p className="font-heading font-semibold text-white/70 text-sm uppercase tracking-widest mb-4">
            {eyebrow}
          </p>
        )}
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
          {/* Primary contact link — solid sunset */}
          {primaryButtonText && (
            <Link
              href={primaryButtonHref}
              className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-sunset text-white font-heading font-bold text-base shadow-lg hover:bg-sunset-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              {primaryButtonText}
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          )}

          {/* Secondary link — ghost white outline */}
          {secondaryButtonText && (
            <Link
              href={secondaryButtonHref}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-full border-2 border-white/40 text-white font-heading font-bold text-base hover:bg-white/10 hover:border-white/60 transition-all duration-200"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
