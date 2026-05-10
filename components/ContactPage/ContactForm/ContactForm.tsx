"use client";

import { useState } from "react";
import { WordRevealHeading } from "@/components/ui/WordRevealHeading";

interface ContactFormProps {
  headline: string;
  locale: "en" | "es";
  labels: {
    name: string;
    email: string;
    phone: string;
    hotel: string;
    excursion: string;
    message: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    required: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    hotelPlaceholder: string;
    excursionPlaceholder: string;
    messagePlaceholder: string;
  };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  excursion: string;
  message: string;
}

export function ContactForm({ headline, locale, labels }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    excursion: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = labels.required;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = labels.required;
    if (!form.message.trim()) newErrors.message = labels.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          hotel: form.hotel.trim() || undefined,
          excursion: form.excursion.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[contact] send failed", err);
      setSubmitError(labels.errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-5">
          <svg
            className="w-8 h-8 text-teal"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-navy text-2xl mb-3">
          {labels.successTitle}
        </h3>
        <p className="font-body text-slate/70 leading-relaxed max-w-sm">
          {labels.successMessage}
        </p>
      </div>
    );
  }

  return (
    <div>
      <WordRevealHeading
        as="h2"
        text={headline}
        className="font-heading font-bold text-navy text-2xl mb-8"
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Name */}
        <div>
          <label className="block font-body text-sm font-medium text-navy mb-1.5">
            {labels.name} <span className="text-sunset">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={labels.namePlaceholder}
            className={`w-full px-4 py-3 rounded-xl border font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 ${
              errors.name ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.name && (
            <p className="font-body text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email + Phone row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-body text-sm font-medium text-navy mb-1.5">
              {labels.email} <span className="text-sunset">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={labels.emailPlaceholder}
              className={`w-full px-4 py-3 rounded-xl border font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 ${
                errors.email ? "border-red-400" : "border-slate-200"
              }`}
            />
            {errors.email && (
              <p className="font-body text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-navy mb-1.5">
              {labels.phone}
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={labels.phonePlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>

        {/* Hotel + Excursion row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block font-body text-sm font-medium text-navy mb-1.5">
              {labels.hotel}
            </label>
            <input
              type="text"
              name="hotel"
              value={form.hotel}
              onChange={handleChange}
              placeholder={labels.hotelPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
          <div>
            <label className="block font-body text-sm font-medium text-navy mb-1.5">
              {labels.excursion}
            </label>
            <input
              type="text"
              name="excursion"
              value={form.excursion}
              onChange={handleChange}
              placeholder={labels.excursionPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block font-body text-sm font-medium text-navy mb-1.5">
            {labels.message} <span className="text-sunset">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={labels.messagePlaceholder}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-teal focus:ring-2 focus:ring-teal/20 resize-none ${
              errors.message ? "border-red-400" : "border-slate-200"
            }`}
          />
          {errors.message && (
            <p className="font-body text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        {/* Error */}
        {submitError && (
          <p
            className="font-body text-red-500 text-sm text-center"
            role="alert"
            aria-live="polite"
          >
            {submitError}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-ocean text-white font-heading font-bold text-base shadow-md hover:bg-teal hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {submitting ? (
            <>
              <SpinnerIcon />
              {labels.submitting}
            </>
          ) : (
            <>
              <SendIcon />
              {labels.submit}
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
