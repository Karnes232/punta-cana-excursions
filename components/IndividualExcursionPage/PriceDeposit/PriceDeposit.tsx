import { PriceDisplay } from "./PriceDisplay";
import { DepositInfo } from "./DepositInfo";
import { PriceCtaGroup } from "./PriceCtaGroup";
import { PriceTrustSignals } from "./PriceTrustSignals";

interface PriceDepositProps {
  /** Price in USD */
  price: number;
  /** Deposit amount in USD */
  depositAmount: number;
  /** Optional note (e.g. "per person", "per group up to 6") */
  priceNote?: string;
  /** Excursion title — used in WhatsApp pre-filled message */
  excursionTitle: string;
  /** WhatsApp number (digits only, e.g. "18091234567") */
  whatsappNumber: string;
  /** i18n labels */
  labels: {
    from: string; // "From" / "Desde"
    perPerson: string; // "per person" / "por persona" (fallback if no priceNote)
    depositRequired: string; // "Deposit to reserve" / "Depósito para reservar"
    payRestOnsite: string; // "Pay the rest on the day of the excursion" / "Paga el resto el día de la excursión"
    reserveNow: string; // "Reserve Your Spot" / "Reserva Tu Lugar"
    whatsappCta: string; // "Ask on WhatsApp" / "Preguntar por WhatsApp"
    whatsappMessage: string; // Pre-filled message template with {title} placeholder
    freeCancellation: string; // "Free cancellation 24h before" / "Cancelación gratis 24h antes"
    instantConfirmation: string; // "Instant confirmation" / "Confirmación instantánea"
    securePayment: string; // "Secure payment" / "Pago seguro"
  };
}

export function PriceDeposit({
  price,
  depositAmount,
  priceNote,
  excursionTitle,
  whatsappNumber,
  labels,
}: PriceDepositProps) {
  return (
    <section className="relative bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 md:py-10">
        <div className="max-w-xl">
          {/* Price card — the focal point */}
          <div className="bg-sand rounded-2xl border border-sand-dark/30 p-6 md:p-8">
            {/* Price + note */}
            <PriceDisplay
              price={price}
              priceNote={priceNote || labels.perPerson}
              fromLabel={labels.from}
            />

            {/* Divider */}
            <div className="my-5 md:my-6 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />

            {/* Deposit info */}
            <DepositInfo
              depositAmount={depositAmount}
              depositLabel={labels.depositRequired}
              balanceNote={labels.payRestOnsite}
            />

            {/* CTA buttons */}
            <div className="mt-6 md:mt-7">
              <PriceCtaGroup
                reserveLabel={labels.reserveNow}
                whatsappLabel={labels.whatsappCta}
                whatsappNumber={whatsappNumber}
                whatsappMessage={labels.whatsappMessage.replace(
                  "{title}",
                  excursionTitle,
                )}
              />
            </div>

            {/* Trust signals */}
            <div className="mt-5 md:mt-6">
              <PriceTrustSignals
                signals={[
                  labels.freeCancellation,
                  labels.instantConfirmation,
                  labels.securePayment,
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />
    </section>
  );
}
