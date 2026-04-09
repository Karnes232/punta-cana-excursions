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
    from: string;
    perPerson: string;
    depositRequired: string;
    payRestOnsite: string;
    reserveNow: string;
    whatsappCta: string;
    whatsappMessage: string;
    freeCancellation: string;
    instantConfirmation: string;
    securePayment: string;
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
    <div className="bg-sand rounded-2xl border border-sand-dark/30 p-6 md:p-7 shadow-sm">
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
  );
}
