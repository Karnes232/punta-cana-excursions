import { PriceDisplay } from "./PriceDisplay";
import { DepositInfo } from "./DepositInfo";
import { PriceCtaGroup } from "./PriceCtaGroup";
import { PriceTrustSignals } from "./PriceTrustSignals";
import type { BookingLabels } from "./bookingTypes";

interface PriceDepositProps {
  price: number;
  depositAmount: number;
  priceNote?: string;
  childPrice?: number;
  childAgeRange?: string;
  infantPolicy?: string;
  excursionId?: string;
  excursionTitle: string;
  whatsappNumber: string;
  locale: string;
  daysAvailable?: string[];
  timeSlots?: string[];
  bookingNoticeHours?: number;
  externalBookingUrl?: string;
  labels: {
    from: string;
    perPerson: string;
    depositRequired: string;
    payRestOnsite: string;
    reserveNow: string;
    contactCta: string;
    freeCancellation: string;
    instantConfirmation: string;
    securePayment: string;
    child?: string;
    infant?: string;
  };
  bookingLabels?: BookingLabels;
}

export function PriceDeposit({
  price,
  depositAmount,
  priceNote,
  childAgeRange,
  excursionId,
  excursionTitle,
  whatsappNumber,
  locale,
  daysAvailable,
  timeSlots,
  bookingNoticeHours,
  externalBookingUrl,
  labels,
  bookingLabels,
}: PriceDepositProps) {
  return (
    <div className="bg-sand rounded-2xl border border-sand-dark/30 p-6 md:p-7 shadow-sm">
      <PriceDisplay
        price={price}
        priceNote={priceNote || labels.perPerson}
        fromLabel={labels.from}
      />

      <div className="my-5 md:my-6 h-px bg-gradient-to-r from-transparent via-sand-dark/40 to-transparent" />

      <DepositInfo
        depositAmount={depositAmount}
        depositLabel={labels.depositRequired}
        balanceNote={labels.payRestOnsite}
      />

      <div className="mt-6 md:mt-7">
        <PriceCtaGroup
          reserveLabel={labels.reserveNow}
          contactLabel={labels.contactCta}
          excursionId={excursionId}
          excursionTitle={excursionTitle}
          whatsappNumber={whatsappNumber}
          locale={locale}
          daysAvailable={daysAvailable}
          timeSlots={timeSlots}
          bookingNoticeHours={bookingNoticeHours}
          depositAmount={depositAmount}
          pricePerPerson={price}
          childAgeRange={childAgeRange}
          externalBookingUrl={externalBookingUrl}
          bookingLabels={bookingLabels}
        />
      </div>

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
