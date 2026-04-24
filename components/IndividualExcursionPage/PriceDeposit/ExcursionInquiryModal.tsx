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
  whatsappNumber: string;
  locale: string;
}

export function ExcursionInquiryModal({
  isOpen,
  onClose,
  excursionTitle,
  whatsappNumber,
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const parts = isEs
      ? [
          `Hola, tengo una pregunta sobre la excursión: ${excursionTitle}.`,
          form.hotel ? `Me hospedo en: ${form.hotel}.` : "",
          form.message || "",
          form.phone ? `Mi teléfono: ${form.phone}` : "",
          `Mi correo: ${form.email}`,
        ]
      : [
          `Hi, I have a question about the excursion: ${excursionTitle}.`,
          form.hotel ? `I'm staying at: ${form.hotel}.` : "",
          form.message || "",
          form.phone ? `My phone: ${form.phone}` : "",
          `My email: ${form.email}`,
        ];

    const text = encodeURIComponent(parts.filter(Boolean).join("\n\n"));
    const number = whatsappNumber.replace(/\D/g, "");

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener,noreferrer");
    }, 500);
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
                {isEs ? "¡Mensaje listo!" : "Message ready!"}
              </h3>
              <p className="font-body text-slate/60 text-sm leading-relaxed max-w-xs">
                {isEs
                  ? "Se abrió WhatsApp con tu mensaje. Haz clic en Enviar para contactarnos."
                  : "WhatsApp opened with your message. Click Send to reach us directly."}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-ocean text-white font-heading font-bold text-sm shadow-sm hover:bg-teal hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {submitting ? (
                  <>
                    <SpinnerIcon />
                    {isEs ? "Preparando..." : "Preparing..."}
                  </>
                ) : (
                  <>
                    <WhatsAppIcon />
                    {isEs ? "Enviar por WhatsApp" : "Send via WhatsApp"}
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

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
