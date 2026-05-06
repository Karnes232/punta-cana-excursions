"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import type { BookingFormState, BookingLabels } from "./bookingTypes";

interface BookingReviewProps {
  locale: string;
  labels: BookingLabels;
  excursionId: string;
  excursionTitle: string;
  form: BookingFormState;
  depositAmount: number;
  pricePerPerson: number;
  paymentError: string | null;
  onEdit: () => void;
  onApproved: (orderID: string) => Promise<void>;
  onPaymentError: (msg: string) => void;
}

function formatDateForLocale(iso: string, locale: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return iso;
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function BookingReview({
  locale,
  labels,
  excursionId,
  excursionTitle,
  form,
  depositAmount,
  pricePerPerson,
  paymentError,
  onEdit,
  onApproved,
  onPaymentError,
}: BookingReviewProps) {
  const totalGuests = form.adults + form.children;
  const depositTotal = depositAmount * totalGuests;
  const totalCost = pricePerPerson * totalGuests;
  const balanceDue = Math.max(0, totalCost - depositTotal);

  const guestLine =
    form.children > 0
      ? `${form.adults} × ${labels.adultsLabel.toLowerCase()} · ${form.children} × ${labels.childrenLabel.toLowerCase()}`
      : `${form.adults} × ${labels.adultsLabel.toLowerCase()}`;

  return (
    <div className="space-y-5">
      {/* Summary card */}
      <div className="rounded-2xl border border-slate-200 bg-sand/40 p-5">
        <h3 className="font-heading font-bold text-navy text-base mb-4">
          {labels.stepReviewTitle}
        </h3>

        <SummaryRow label={labels.reviewExcursion} value={excursionTitle} />
        <SummaryRow
          label={labels.reviewDate}
          value={formatDateForLocale(form.date, locale)}
        />
        {form.timeSlot && (
          <SummaryRow label={labels.reviewTime} value={form.timeSlot} />
        )}
        <SummaryRow label={labels.reviewGuests} value={guestLine} />
        <SummaryRow label={labels.reviewHotel} value={form.hotel} />

        <div className="my-4 h-px bg-slate-200" />

        <div className="flex items-baseline justify-between">
          <span className="font-body text-xs uppercase tracking-wider font-semibold text-slate">
            {labels.reviewDeposit}
          </span>
          <span className="font-heading font-bold text-ocean text-2xl">
            ${depositTotal.toFixed(2)}{" "}
            <span className="text-sm font-medium">USD</span>
          </span>
        </div>
        <p className="font-body text-xs text-slate/70 mt-1">
          {labels.reviewDepositNote}
        </p>

        {balanceDue > 0 && (
          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-body text-xs uppercase tracking-wider font-semibold text-slate">
              {labels.reviewBalanceLabel}
            </span>
            <span className="font-heading font-semibold text-navy text-base">
              ${balanceDue.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Edit details */}
      <button
        type="button"
        onClick={onEdit}
        className="font-body text-sm text-ocean underline underline-offset-2 hover:text-teal transition-colors"
      >
        ← {labels.editDetails}
      </button>

      {/* PayPal buttons */}
      <div>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 48,
          }}
          createOrder={async () => {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                excursionId,
                adults: form.adults,
                children: form.children,
                date: form.date,
                timeSlot: form.timeSlot || undefined,
              }),
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || "Failed to create order");
            }
            const json = (await res.json()) as { id: string };
            return json.id;
          }}
          onApprove={async (data) => {
            await onApproved(data.orderID);
          }}
          onError={(err) => {
            console.error("[paypal]", err);
            onPaymentError(labels.paymentError);
          }}
        />
      </div>

      {paymentError && (
        <p
          className="font-body text-red-500 text-sm text-center"
          role="alert"
          aria-live="polite"
        >
          {paymentError}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="font-body text-xs uppercase tracking-wider font-semibold text-slate flex-shrink-0">
        {label}
      </span>
      <span className="font-body text-sm font-medium text-navy text-right">
        {value}
      </span>
    </div>
  );
}
