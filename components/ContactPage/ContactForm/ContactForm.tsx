"use client";

import { useState } from "react";

interface ContactFormProps {
  headline: string;
  phone: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    excursion: string;
    message: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    whatsappFallback: string;
    required: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    excursionPlaceholder: string;
    messagePlaceholder: string;
  };
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  excursion: string;
  message: string;
}

export function ContactForm({ headline, phone, labels }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    excursion: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const parts = [
      `Hi, my name is ${form.name}.`,
      form.excursion ? `I'm interested in: ${form.excursion}.` : "",
      form.message,
      form.phone ? `My phone: ${form.phone}` : "",
      `My email: ${form.email}`,
    ].filter(Boolean);

    const whatsappMessage = encodeURIComponent(parts.join("\n\n"));
    const whatsappNumber = phone.replace(/\D/g, "");
    const whatsappHref = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    }, 600);
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
        <p className="font-body text-slate/70 leading-relaxed max-w-sm mb-6">
          {labels.successMessage}
        </p>
        <p className="font-body text-slate/50 text-sm">{labels.whatsappFallback}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading font-bold text-navy text-2xl mb-8">
        {headline}
      </h2>

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

        {/* Excursion of interest */}
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
              <WhatsAppIcon />
              {labels.submit}
            </>
          )}
        </button>
      </form>
    </div>
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

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
