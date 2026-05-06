"use client";

import { useEffect, useMemo, useState } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BookingForm } from "./BookingForm";
import { BookingReview } from "./BookingReview";
import type {
  BookingFormErrors,
  BookingFormState,
  BookingLabels,
} from "./bookingTypes";

const DAY_KEY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

interface ExcursionBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  excursionId: string;
  excursionTitle: string;
  daysAvailable: string[];
  timeSlots: string[];
  bookingNoticeHours: number;
  depositAmount: number;
  pricePerPerson: number;
  childAgeRange?: string;
  labels: BookingLabels;
}

type Step = "form" | "review" | "success" | "error";

const INITIAL_FORM: BookingFormState = {
  name: "",
  email: "",
  phone: "",
  hotel: "",
  date: "",
  timeSlot: "",
  adults: 2,
  children: 0,
};

export function ExcursionBookingModal({
  isOpen,
  onClose,
  locale,
  excursionId,
  excursionTitle,
  daysAvailable,
  timeSlots,
  bookingNoticeHours,
  depositAmount,
  pricePerPerson,
  childAgeRange,
  labels,
}: ExcursionBookingModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [completedOrderID, setCompletedOrderID] = useState<string | null>(null);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset state on close (after fade)
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep("form");
        setForm(INITIAL_FORM);
        setErrors({});
        setPaymentError(null);
        setApiError(null);
        setRetrying(false);
        setCompletedOrderID(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const allowedDayIndexes = useMemo(
    () =>
      new Set(
        daysAvailable
          .map((k) => DAY_KEY_TO_INDEX[k.toLowerCase()])
          .filter((v): v is number => v !== undefined),
      ),
    [daysAvailable],
  );

  const minTimeMs = useMemo(
    () => Date.now() + bookingNoticeHours * 60 * 60 * 1000,
    [bookingNoticeHours],
  );

  function validateForm(): BookingFormErrors {
    const e: BookingFormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = labels.required;
    if (
      !form.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    )
      e.email = labels.invalidEmail;
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7)
      e.phone = labels.invalidPhone;
    if (!form.hotel.trim()) e.hotel = labels.required;

    if (!form.date) {
      e.date = labels.required;
    } else {
      const [y, m, d] = form.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      if (Number.isNaN(dateObj.getTime())) {
        e.date = labels.required;
      } else if (!allowedDayIndexes.has(dateObj.getDay())) {
        e.date = labels.dateInvalidWeekday;
      } else if (dateObj.getTime() < minTimeMs) {
        e.date = labels.dateInvalidNotice;
      }
    }

    if (timeSlots.length > 0 && !form.timeSlot) e.timeSlot = labels.timeRequired;
    if (form.adults < 1) e.adults = labels.required;

    return e;
  }

  function handleContinue() {
    const v = validateForm();
    setErrors(v);
    if (Object.keys(v).length === 0) {
      setStep("review");
      setPaymentError(null);
    }
  }

  async function submitBooking(orderID: string) {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderID,
        excursionId,
        locale: locale === "es" ? "es" : "en",
        formData: form,
      }),
    });

    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!res.ok || !json.ok) {
      throw new Error(json.error || "Booking submission failed");
    }
  }

  async function handleApproved(orderID: string) {
    setCompletedOrderID(orderID);
    setApiError(null);
    try {
      await submitBooking(orderID);
      setStep("success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unknown error");
      setStep("error");
    }
  }

  async function handleRetry() {
    if (!completedOrderID) return;
    setRetrying(true);
    setApiError(null);
    try {
      await submitBooking(completedOrderID);
      setStep("success");
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setRetrying(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center lg:mt-16 p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl lg:max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="min-w-0">
            <h2 className="font-heading font-bold text-navy text-xl">
              {step === "success"
                ? labels.successTitle
                : step === "error"
                  ? labels.errorTitle
                  : step === "review"
                    ? labels.stepReviewTitle
                    : labels.modalTitle}
            </h2>
            <p className="font-body text-sm text-slate/60 mt-0.5 line-clamp-1">
              {excursionTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate/50 hover:text-navy hover:bg-slate-100 transition-colors duration-150"
            aria-label={labels.close}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {step === "form" && (
            <BookingForm
              locale={locale}
              labels={labels}
              daysAvailable={daysAvailable}
              timeSlots={timeSlots}
              bookingNoticeHours={bookingNoticeHours}
              depositAmount={depositAmount}
              pricePerPerson={pricePerPerson}
              childAgeRange={childAgeRange}
              form={form}
              errors={errors}
              onFormChange={setForm}
              onErrorClear={(field) =>
                setErrors((prev) => ({ ...prev, [field]: undefined }))
              }
              onContinue={handleContinue}
            />
          )}

          {step === "review" && paypalClientId && (
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: "USD",
                intent: "capture",
              }}
            >
              <BookingReview
                locale={locale}
                labels={labels}
                excursionId={excursionId}
                excursionTitle={excursionTitle}
                form={form}
                depositAmount={depositAmount}
                pricePerPerson={pricePerPerson}
                paymentError={paymentError}
                onEdit={() => setStep("form")}
                onApproved={handleApproved}
                onPaymentError={setPaymentError}
              />
            </PayPalScriptProvider>
          )}

          {step === "review" && !paypalClientId && (
            <p className="font-body text-red-500 text-sm" role="alert">
              Payment is not configured. Please contact support.
            </p>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-navy text-lg mb-2">
                {labels.successTitle}
              </h3>
              <p className="font-body text-slate/70 text-sm leading-relaxed max-w-sm">
                {labels.successMessage}
              </p>
              <p className="font-body text-slate/60 text-xs mt-3">
                {labels.successCheckEmail} <strong>{form.email}</strong>
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.732 0 2.815-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"
                  />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-navy text-lg mb-2">
                {labels.errorTitle}
              </h3>
              <p
                className="font-body text-slate/70 text-sm leading-relaxed max-w-sm mb-4"
                role="alert"
                aria-live="polite"
              >
                {apiError || labels.errorContact}
              </p>
              {completedOrderID && (
                <p className="font-body text-xs text-slate/50 mb-4">
                  Order: {completedOrderID}
                </p>
              )}
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="px-6 py-3 rounded-xl bg-ocean text-white font-heading font-bold text-sm disabled:opacity-60"
              >
                {retrying ? "…" : labels.errorRetry}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
