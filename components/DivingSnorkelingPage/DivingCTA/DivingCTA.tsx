import { DivingCTAContent } from "./DivingCTAContent";
import { DivingCTABackground } from "./DivingCTABackground";

/* ---------------------------------------------------------------------------
   DivingCTA — Final conversion banner for the Diving & Snorkeling page
   
   Bold full-width section with a deep ocean gradient background,
   decorative wave top edge, headline, supporting copy, and two CTAs:
     1. WhatsApp button (accent green — primary action)
     2. Contact page link (ghost/outline — secondary)
   
   This mirrors the Home page's CTABanner concept but with the
   diving page's underwater visual treatment.
   --------------------------------------------------------------------------- */

interface DivingCTAProps {
  headline: string;
  /** Optional supporting text below the headline */
  subtext?: string;
  whatsappButtonText: string;
  whatsappNumber: string;
  /** Pre-filled WhatsApp message */
  whatsappMessage?: string;
  contactButtonText: string;
  contactHref: string;
}

export function DivingCTA({
  headline,
  subtext,
  whatsappButtonText,
  whatsappNumber,
  whatsappMessage = "",
  contactButtonText,
  contactHref,
}: DivingCTAProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Wave top transition — sand-to-gradient */}
      <div className="relative z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block -mb-px"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C240 55 480 10 720 35C960 60 1200 15 1440 40V0H0V30Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* Main banner area */}
      <div className="relative py-16 md:py-24">
        {/* Gradient background + decorative elements */}
        <DivingCTABackground />

        {/* Content */}
        <DivingCTAContent
          headline={headline}
          subtext={subtext}
          whatsappButtonText={whatsappButtonText}
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
          contactButtonText={contactButtonText}
          contactHref={contactHref}
        />
      </div>
    </section>
  );
}