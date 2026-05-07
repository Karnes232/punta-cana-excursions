"use client";

import { useEffect, useRef, useState } from "react";

interface FormState {
  name: string;
  email: string;
  phone: string;
  hotel: string;
  message: string;
}

interface ExcursionInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  excursionTitle: string;
  locale: string;
}

export function ExcursionInquiryModal({
  isOpen,
  onClose,
  excursionTitle,
  locale,
}: ExcursionInquiryModalProps) {
  const isEs = locale === "es";
  const panelRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    hotel: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setForm({ name: "", email: "", phone: "", hotel: "", message: "" });
        setErrors({});
        setSubmitted(false);
        setSubmitting(false);
        setSubmitError(null);
      }, 300);
    }
  }, [isOpen]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = isEs ? "Campo requerido" : "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = isEs ? "Campo requerido" : "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          excursionTitle,
          locale: isEs ? "es" : "en",
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          hotel: form.hotel.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      console.error("[inquiry] send failed", err);
      setSubmitError(
        isEs
          ? "No se pudo enviar tu mensaje. Inténtalo de nuevo."
          : "We couldn't send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-3 rounded-xl border font-body text-navy text-sm bg-white placeholder:text-slate/40 outline-none transition-colors duration-150 focus:border-ocean focus:ring-2 focus:ring-ocean/20 ${
      hasError ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
      <div
        ref={panelRef}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-bold text-navy text-xl">
              {isEs ? "Hacer una pregunta" : "Ask a Question"}
            </h2>
            <p className="font-body text-sm text-slate/60 mt-0.5 line-clamp-1">
              {excursionTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate/50 hover:text-navy hover:bg-slate-100 transition-colors duration-150"
            aria-label={isEs ? "Cerrar" : "Close"}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-teal" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-heading font-bold text-navy text-lg mb-2">
                {isEs ? "¡Mensaje enviado!" : "Message sent!"}
              </h3>
              <p className="font-body text-slate/60 text-sm leading-relaxed max-w-xs">
                {isEs
                  ? "Recibimos tu pregunta. Te responderemos por correo electrónico lo antes posible."
                  : "We've received your question and will reply by email as soon as possible."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1.5">
                  {isEs ? "Nombre completo" : "Full name"}{" "}
                  <span className="text-sunset">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={isEs ? "Juan García" : "John Smith"}
                  className={inputClass(errors.name)}
                />
                {errors.name && (
                  <p className="font-body text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1.5">
                  {isEs ? "Correo electrónico" : "Email address"}{" "}
                  <span className="text-sunset">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={isEs ? "juan@ejemplo.com" : "john@example.com"}
                  className={inputClass(errors.email)}
                />
                {errors.email && (
                  <p className="font-body text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone + Hotel row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">
                    {isEs ? "Teléfono (opcional)" : "Phone (optional)"}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (809) 000-0000"
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-1.5">
                    {isEs ? "Hotel (opcional)" : "Hotel (optional)"}
                  </label>
                  <input
                    type="text"
                    name="hotel"
                    value={form.hotel}
                    onChange={handleChange}
                    placeholder={isEs ? "Barceló Bávaro..." : "Barceló Bávaro..."}
                    className={inputClass()}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block font-body text-sm font-medium text-navy mb-1.5">
                  {isEs ? "Mensaje (opcional)" : "Message (optional)"}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={
                    isEs
                      ? "Cuéntenos sobre su grupo, fechas o cualquier pregunta..."
                      : "Tell us about your group, travel dates, or any questions..."
                  }
                  rows={3}
                  className={`${inputClass()} resize-none`}
                />
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
                className="w-full flex items-center justify-center gap-2.5 min-h-[48px] px-6 py-3.5 rounded-xl bg-ocean text-white font-heading font-bold text-sm shadow-sm hover:bg-teal hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {submitting ? (
                  <>
                    <SpinnerIcon />
                    {isEs ? "Enviando..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <SendIcon />
                    {isEs ? "Enviar pregunta" : "Send question"}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
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
