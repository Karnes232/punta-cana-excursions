"use client";

import { useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "react-day-picker/locale";
import "react-day-picker/style.css";
import type { BookingFormErrors, BookingFormState, BookingLabels } from "./bookingTypes";

const DAY_KEY_TO_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

interface BookingFormProps {
  locale: string;
  labels: BookingLabels;
  daysAvailable: string[];
  timeSlots: string[];
  bookingNoticeHours: number;
  depositAmount: number;
  pricePerPerson: number;
  childAgeRange?: string;
  form: BookingFormState;
  errors: BookingFormErrors;
  onFormChange: (next: BookingFormState) => void;
  onErrorClear: (field: keyof BookingFormState) => void;
  onContinue: () => void;
}

function formatDateISO(d: Date): string {
  // yyyy-mm-dd in UTC-safe form
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseDateISO(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export function BookingForm({
  locale,
  labels,
  daysAvailable,
  timeSlots,
  bookingNoticeHours,
  depositAmount,
  pricePerPerson,
  childAgeRange,
  form,
  errors,
  onFormChange,
  onErrorClear,
  onContinue,
}: BookingFormProps) {
  const firstInvalidRef = useRef<HTMLInputElement | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const allowedDayIndexes = useMemo(
    () =>
      new Set(
        daysAvailable
          .map((k) => DAY_KEY_TO_INDEX[k.toLowerCase()])
          .filter((v): v is number => v !== undefined),
      ),
    [daysAvailable],
  );

  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + bookingNoticeHours);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }, [bookingNoticeHours]);



  const totalGuests = form.adults + form.children;
  const depositTotal = depositAmount * totalGuests;
  const totalPrice = pricePerPerson * totalGuests;
  const balanceDue = Math.max(0, totalPrice - depositTotal);

  function update<K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) {
    onFormChange({ ...form, [key]: value });
    if (errors[key]) onErrorClear(key);
  }

  function blur(field: keyof BookingFormState) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function changeAdults(delta: number) {
    const next = Math.max(1, Math.min(20, form.adults + delta));
    update("adults", next);
  }

  function changeChildren(delta: number) {
    const next = Math.max(0, Math.min(20, form.children + delta));
    update("children", next);
  }

  function handleDateSelect(d: Date | undefined) {
    update("date", d ? formatDateISO(d) : "");
    setTouched((p) => ({ ...p, date: true }));
  }

  const selectedDate = parseDateISO(form.date);

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-3 rounded-xl border font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-ocean focus:ring-2 focus:ring-ocean/20 ${
      hasError ? "border-red-400" : "border-slate-200"
    }`;

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    onContinue();
    // give time for parent to update errors then focus first invalid
    requestAnimationFrame(() => {
      firstInvalidRef.current?.focus();
    });
  }

  // Pick the first invalid field for focus management
  const firstInvalidKey = (Object.keys(form) as Array<keyof BookingFormState>).find(
    (k) => errors[k],
  );

  return (
    <form
      onSubmit={handleContinue}
      noValidate
      className="lg:grid lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-8 space-y-5 lg:space-y-0"
    >
      {/* ===== Date (left column on lg) ===== */}
      <div className="space-y-5 lg:space-y-0">
      <fieldset>
        <legend className="block font-body text-sm font-medium text-navy mb-2">
          {labels.dateLabel} <span className="text-sunset">*</span>
        </legend>
        <p className="font-body text-xs text-slate/60 mb-3">
          {labels.dateHelper.replace("{hours}", String(bookingNoticeHours))}
        </p>
        <div className="rounded-xl border border-slate-200 bg-sand/40 p-2 overflow-x-auto">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={locale === "es" ? es : undefined}
            disabled={[
              { before: minDate },
              (d) => !allowedDayIndexes.has(d.getDay()),
            ]}
            showOutsideDays={false}
            classNames={{
              today: "rdp-today text-sunset font-bold",
              selected: "rdp-selected bg-ocean text-white",
              chevron: "fill-ocean",
            }}
            styles={{
              root: { margin: 0 },
            }}
          />
        </div>
        {errors.date && (
          <p
            className="font-body text-red-500 text-xs mt-2"
            role="alert"
            aria-live="polite"
          >
            {errors.date}
          </p>
        )}
      </fieldset>
      </div>

      {/* ===== Right column on lg ===== */}
      <div className="space-y-5">
      {/* ===== Time slot ===== */}
      {timeSlots.length > 0 && (
        <fieldset>
          <legend className="block font-body text-sm font-medium text-navy mb-2">
            {labels.timeLabel} <span className="text-sunset">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => {
              const active = form.timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => update("timeSlot", slot)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean ${
                    active
                      ? "bg-ocean text-white border-ocean shadow-sm"
                      : "bg-white text-navy border-slate-200 hover:border-ocean/40"
                  }`}
                  aria-pressed={active}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          {errors.timeSlot && (
            <p
              className="font-body text-red-500 text-xs mt-2"
              role="alert"
              aria-live="polite"
            >
              {errors.timeSlot}
            </p>
          )}
        </fieldset>
      )}

      {/* ===== Guests ===== */}
      <fieldset>
        <legend className="block font-body text-sm font-medium text-navy mb-3">
          {labels.guestsLabel}
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Stepper
            label={labels.adultsLabel}
            value={form.adults}
            onDec={() => changeAdults(-1)}
            onInc={() => changeAdults(1)}
            decDisabled={form.adults <= 1}
          />
          <Stepper
            label={labels.childrenLabel}
            sublabel={childAgeRange ? `(${childAgeRange})` : undefined}
            value={form.children}
            onDec={() => changeChildren(-1)}
            onInc={() => changeChildren(1)}
            decDisabled={form.children <= 0}
          />
        </div>
        {errors.adults && (
          <p className="font-body text-red-500 text-xs mt-2" role="alert">
            {errors.adults}
          </p>
        )}

        <div className="mt-4 px-4 py-3 rounded-xl bg-ocean/[0.06] border border-ocean/10 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-body text-xs uppercase tracking-wider text-slate font-semibold">
              {labels.reviewTotal ?? "Total"}
            </span>
            <span className="font-heading font-semibold text-navy text-base">
              ${totalPrice.toFixed(2)} USD
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-ocean/10 pt-2">
            <span className="font-body text-xs uppercase tracking-wider text-ocean/80 font-semibold">
              {labels.reviewDeposit}
            </span>
            <span className="font-heading font-bold text-ocean text-lg">
              ${depositTotal.toFixed(2)} USD
            </span>
          </div>
          {balanceDue > 0 && (
            <div className="flex items-baseline justify-between">
              <span className="font-body text-xs uppercase tracking-wider text-slate font-semibold">
                {labels.reviewBalanceLabel}
              </span>
              <span className="font-heading font-medium text-navy text-sm">
                ${balanceDue.toFixed(2)} USD
              </span>
            </div>
          )}
        </div>
      </fieldset>

      {/* ===== Contact details ===== */}
      <fieldset className="space-y-4">
        <legend className="block font-body text-sm font-medium text-navy mb-1">
          {labels.contactSection}
        </legend>

        <Field
          label={labels.nameLabel}
          required
          error={touched.name ? errors.name : undefined}
        >
          <input
            ref={firstInvalidKey === "name" ? firstInvalidRef : undefined}
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => blur("name")}
            placeholder={labels.namePlaceholder}
            className={inputClass(errors.name)}
          />
        </Field>

        <Field
          label={labels.emailLabel}
          required
          error={touched.email ? errors.email : undefined}
        >
          <input
            ref={firstInvalidKey === "email" ? firstInvalidRef : undefined}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => blur("email")}
            placeholder={labels.emailPlaceholder}
            className={inputClass(errors.email)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label={labels.phoneLabel}
            required
            error={touched.phone ? errors.phone : undefined}
          >
            <input
              ref={firstInvalidKey === "phone" ? firstInvalidRef : undefined}
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              onBlur={() => blur("phone")}
              placeholder={labels.phonePlaceholder}
              className={inputClass(errors.phone)}
            />
          </Field>
          <Field
            label={labels.hotelLabel}
            required
            error={touched.hotel ? errors.hotel : undefined}
          >
            <input
              ref={firstInvalidKey === "hotel" ? firstInvalidRef : undefined}
              type="text"
              name="hotel"
              value={form.hotel}
              onChange={(e) => update("hotel", e.target.value)}
              onBlur={() => blur("hotel")}
              placeholder={labels.hotelPlaceholder}
              className={inputClass(errors.hotel)}
            />
          </Field>
        </div>
      </fieldset>

      {/* ===== Continue ===== */}
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ocean text-white font-heading font-bold text-sm shadow-sm hover:bg-teal hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean min-h-[48px]"
      >
        {labels.continueToPayment}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
      </div>
    </form>
  );
}

// =============================================================================
// Sub-components
// =============================================================================

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}
function Field({ label, required, error, children }: FieldProps) {
  return (
    <div>
      <label className="block font-body text-sm font-medium text-navy mb-1.5">
        {label} {required && <span className="text-sunset">*</span>}
      </label>
      {children}
      {error && (
        <p className="font-body text-red-500 text-xs mt-1" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

interface StepperProps {
  label: string;
  sublabel?: string;
  value: number;
  onDec: () => void;
  onInc: () => void;
  decDisabled?: boolean;
}
function Stepper({ label, sublabel, value, onDec, onInc, decDisabled }: StepperProps) {
  return (
    <div className="px-4 py-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
      <div className="min-w-0">
        <p className="font-body text-sm font-medium text-navy">{label}</p>
        {sublabel && (
          <p className="font-body text-[11px] text-slate/60 mt-0.5">{sublabel}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDec}
          disabled={decDisabled}
          className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center text-navy hover:border-ocean hover:text-ocean active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
          aria-label="Decrease"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
          </svg>
        </button>
        <span
          className="font-heading font-bold text-navy text-base w-6 text-center tabular-nums"
          aria-live="polite"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onInc}
          className="w-11 h-11 rounded-full border border-slate-200 flex items-center justify-center text-navy hover:border-ocean hover:text-ocean active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocean"
          aria-label="Increase"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
